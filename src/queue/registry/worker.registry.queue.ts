import { Channel } from "amqplib";
import { CompanyWorker } from "../worker/company.worker.queue";
import { EmployeeWorker } from "../worker/employee.worker.queue";
import { OrderWorker } from "../worker/order.worker.queue";
import { OrderStatusWorker } from "../worker/order.status.worker.queue";
import { UnlockWorker } from "../worker/unlock.worker.queue";

interface Worker {
  queueName: string;
  initialize(channel: Channel): Promise<void>;
}

export class WorkerRegistry {
  private static instance: WorkerRegistry;
  private workers: Map<string, Worker> = new Map();

  private constructor() {
    // Initialize the registry with default workers
    this.registerDefaultWorkers();
  }

  public static getInstance(): WorkerRegistry {
    if (!WorkerRegistry.instance) {
      WorkerRegistry.instance = new WorkerRegistry();
    }
    return WorkerRegistry.instance;
  }

  private registerDefaultWorkers(): void {
    this.registerWorker(new CompanyWorker('company-new'));

    this.registerWorker(new EmployeeWorker('employee-new'));

    this.registerWorker(new OrderWorker('order-new'));

    this.registerWorker(new OrderStatusWorker('order-status'));

    this.registerWorker(new UnlockWorker('unlock-new'));
  }

  public registerWorker(worker: Worker): void {
    this.workers.set(worker.queueName, worker);
  }

  public getWorker(queueName: string): Worker | undefined {
    return this.workers.get(queueName);
  }

  public getAllWorkers(): Worker[] {
    return Array.from(this.workers.values());
  }
}
