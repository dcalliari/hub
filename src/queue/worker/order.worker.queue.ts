import { Channel, ConsumeMessage } from 'amqplib';
import OrderProcess from '../process/order.process.queue';

export class OrderWorker {
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
      const order: Order = JSON.parse(msg.content.toString());
      console.log(`Processing order ${order.id}...`);

      await this.process(order, this.channel);

      // Confirm successful processing
      this.channel.ack(msg);
      console.log(`Order ${order.id} processing finished.`);
    } catch (error) {
      console.error(`Job failed with error:`, error);

      // Retry logic or dead-letter queue handling
      const maxAttempts = 3;
      const attempts = (msg.properties.headers?.['x-attempts'] ?? 0) as number;

      if (attempts >= maxAttempts) {
        console.error(`Max attempts reached. Rejecting message.`);
        this.channel.sendToQueue('order-dead', msg.content, {
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

  public async process(order: Order, channel: Channel): Promise<void> {
    try {
      const processor = new OrderProcess();
      return await processor.process(order, channel);
    } catch (error) {
      console.error(new Date(), `Error processing order ${order.id}:`, error);
      throw error;
    }
  }
}