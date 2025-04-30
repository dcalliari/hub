import { RedisOptions, Worker } from 'bullmq';
import OrderProcess from './process/order.process.queue';
import StatusProcess from './process/status.process.queue';
import env from '../env';

class NewQueue {
  private QUEUE_ORDER = env.QUEUE_ORDER;
  private QUEUE_STATUS = env.QUEUE_STATUS;

  constructor() {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = env;

    this.initWorker(REDIS_HOST, parseInt(REDIS_PORT), REDIS_PASSWORD);
  }

  private initWorker(host: string, port: number, password: string) {
    const redisOptions: RedisOptions = { host, port, password, maxRetriesPerRequest: null };

    // Create a new worker for processing ORDERS
    const orderWorker = new Worker(this.QUEUE_ORDER, async job => {
      console.log(`Processing order ${job.data.id}...`);
      await this.OrderProcess(job.data);
      console.log(`Order ${job.data.id} processing finished.`);
      return { success: true };
    }, { connection: redisOptions });

    orderWorker.on('completed', (job: any, result: any) => {
      console.log(`Job ${job.id} completed with result:`, result);
    });

    orderWorker.on('failed', (job: any, err: any) => {
      console.error(`Job ${job.id} failed with error:`, err);
    });

    // Create a new worker for processing STATUSES
    const statusWorker = new Worker(this.QUEUE_STATUS, async job => {
      console.log(`Processing status ${job.data.id}...`);
      await this.StatusProcess(job.data);
      console.log(`Status ${job.data.id} processing finished.`);
      return { success: true };
    }, { connection: redisOptions });

    statusWorker.on('completed', (job: any, result: any) => {
      console.log(`Job ${job.id} completed with result:`, result);
    });
  
    statusWorker.on('failed', (job: any, err: any) => {
      console.error(`Job ${job.id} failed with error:`, err);
    });
  }

  private async OrderProcess(order: Order) {
    try {
      const processor = new OrderProcess();
      await processor.process(order);
      return;

    } catch (error) {
      console.error(new Date(), `Error processing order ${order.id}:`, error);
      throw error;
    }
  }

  private async StatusProcess(status: Status) {
    try {
      const processor = new StatusProcess();
      await processor.process(status);
      return;

    } catch (error) {
      console.error(new Date(), `Error processing status:`, error);
      throw error;
    }
  }
}

export default NewQueue;