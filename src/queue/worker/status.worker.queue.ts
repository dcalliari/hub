import { Channel, ConsumeMessage } from 'amqplib';
import StatusProcess from '../process/status.process.queue';

export class StatusWorker {
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
      const status = JSON.parse(msg.content.toString());
      console.log(`Processing order status ${status.id}...`);

      const currentStatus = await this.process(status);

      if (currentStatus) {
        console.log(`Status ${status.id} is still in progress.`);
        this.channel.nack(msg, false, true); // Requeue the message
        return;
      }

      // Confirm successful processing
      this.channel.ack(msg);
      console.log(`Status ${status.id} processing finished.`);
    } catch (error) {
      console.error(`Job failed with error:`, error);

      // Retry logic or dead-letter queue handling
      const maxAttempts = 3;
      const attempts = (msg.properties.headers?.['x-attempts'] ?? 0) as number;

      if (attempts >= maxAttempts) {
        console.error(`Max attempts reached. Rejecting message.`);
        this.channel.sendToQueue('status-dead', msg.content, {
          headers: { 'x-attempts': attempts },
        });
        this.channel.ack(msg);
      } else {
        console.error(`Retrying message...`);
        this.channel.nack(msg, false, false);
        this.channel.sendToQueue(this.queueName, msg.content, {
          headers: { 'x-attempts': attempts + 1 },
        });
      }
    }
  }

  public async process(status: Status): Promise<boolean> {
    try {
      const processor = new StatusProcess();
      return await processor.process(status);
    } catch (error) {
      console.error(new Date(), `Error processing status ${status.id}:`, error);
      throw error;
    }
  }
}