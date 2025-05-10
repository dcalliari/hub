import { RabbitMQConnection } from './connection/rabbitmq.connection.queue';
import { WorkerRegistry } from './registry/worker.registry.queue';

export default class StartQueue {
  private rabbitConnection: RabbitMQConnection;
  private workerRegistry: WorkerRegistry;

  constructor() {
    this.rabbitConnection = RabbitMQConnection.getInstance();
    this.workerRegistry = WorkerRegistry.getInstance();
    this.initialize();
  }

  private async initialize() {
    try {
      // Connect to RabbitMQ
      await this.rabbitConnection.connect()

      // Initialize all registered workers
      const workers = this.workerRegistry.getAllWorkers();

      for (const worker of workers) {
        const channel = await this.rabbitConnection.createChannel(worker.queueName);
        await worker.initialize(channel);
        console.log(`Worker for queue ${worker.queueName} initialized successfully.`);
      }

      console.log('All workers initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize queue workers:', error);

      // Try to reconnect after a delay
      setTimeout(() => this.initialize(), 5000);
    }
  }

}
