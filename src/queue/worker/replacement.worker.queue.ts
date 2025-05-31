import { Channel, ConsumeMessage } from 'amqplib';
import ReplacementProcess from '../process/replacement.process.queue';

export class ReplacementWorker {
  public queueName: string;
  public prefetchCount: number;
  private channel: Channel | null = null;

  constructor(queueName: string, prefetchCount: number = 1) {
    this.queueName = queueName;
    this.prefetchCount = prefetchCount;
  }

  public async initialize(channel: Channel): Promise<void> {
    this.channel = channel;

    // Setup prefetch to avoid overloading the worker
    await this.channel.prefetch(this.prefetchCount);

    // Consume messages from the queue
    await this.channel.consume(this.queueName, this.handleMessage.bind(this));

    console.log(`Worker initialized for queue: ${this.queueName}`);
  }

  private async handleMessage(msg: ConsumeMessage | null): Promise<void> {
    if (!msg || !this.channel) return;

    try {
      const replacement: Replacement = JSON.parse(msg.content.toString());
      console.log(`Processing card replacement ${replacement.id}...`);

      await this.process(replacement);

      // Confirm successful processing
      this.channel.ack(msg);
      console.log(`Card replacement ${replacement.id} processing finished.`);
    } catch (error) {
      console.error(`Job failed with error:`, error);

      // Retry logic or dead-letter queue handling
      const maxAttempts = 3;
      const attempts = (msg.properties.headers?.['x-attempts'] ?? 0) as number;

      if (attempts >= maxAttempts) {
        console.error(`Max attempts reached. Rejecting message.`);
        // Ensure dead letter queue exists
        await this.channel.assertQueue('replacement-dead', { durable: true });

        // Send to dead letter queue
        this.channel.sendToQueue('replacement-dead', msg.content, {
          headers: { 'x-attempts': attempts },
        });
        this.channel.ack(msg);
      } else {
        console.error(`Retrying message...`);
        this.channel.nack(msg, false, false);
        this.channel.publish("delay", this.queueName, msg.content, {
          headers: { 'x-attempts': attempts + 1, "x-delay": 5000 },
        });
      }
    }
  }

  public async process(replacement: Replacement): Promise<void> {
    try {
      const processor = new ReplacementProcess();
      return await processor.process(replacement);
    } catch (error) {
      console.error(new Date(), `Error processing card replacement ${replacement.id}:`, error);
      throw error;
    }
  }
}