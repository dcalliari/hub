import { Channel, ChannelModel, connect } from 'amqplib';
import env from '../../env';

export class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  private connection: ChannelModel | null = null;
  private channels: Map<string, Channel> = new Map();
  private connecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.connection) return;

    if (this.connecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connecting = true;
    this.connectionPromise = this.establishConnection();
    return this.connectionPromise;
  }

  private async establishConnection(): Promise<void> {
    try {
      this.connection = await connect(env.RABBITMQ_URL!);

      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.reconnect();
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed, attempting to reconnect');
        this.reconnect();
      });

      console.log('RabbitMQ connection established successfully');
      this.connecting = false;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      this.connecting = false;
      this.reconnect();
      throw error;
    }
  }

  private async reconnect(): Promise<void> {
    try {
      // Clear all existing channels
      this.channels.clear();

      if (this.connection) {
        await this.connection.close();
      }
    } catch (err) {
      console.error('Error closing RabbitMQ connection:', err);
    }

    this.connection = null;
    this.connectionPromise = null;

    // Attempt to reconnect after an interval
    setTimeout(() => this.connect(), 5000);
  }

  public async createChannel(queueName: string, options: any = { durable: true }): Promise<Channel> {
    if (!this.connection) {
      await this.connect();
    }

    if (!this.channels.has(queueName) && this.connection) {
      const channel = await this.connection.createChannel();

      channel.assertExchange("delay", "x-delayed-message", { durable: true, arguments: { "x-delayed-type": "direct" } });

      await channel.assertQueue(queueName, options);
      await channel.bindQueue(queueName, "delay", queueName);
      this.channels.set(queueName, channel);
    }

    const channel = this.channels.get(queueName);
    if (!channel) {
      throw new Error(`Failed to create channel for queue: ${queueName}`);
    }

    return channel;
  }

  public async closeConnection(): Promise<void> {
    try {
      for (const [name, channel] of this.channels.entries()) {
        try {
          await channel.close();
          console.log(`Closed channel for queue: ${name}`);
        } catch (error) {
          console.error(`Error closing channel for queue ${name}:`, error);
        }
      }

      this.channels.clear();

      if (this.connection) {
        await this.connection.close();
        console.log('RabbitMQ connection closed successfully');
      }
    } catch (error) {
      console.error('Error closing RabbitMQ connections:', error);
    } finally {
      this.connection = null;
    }
  }
}
