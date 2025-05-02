import { Queue, RedisOptions } from "bullmq";
import env from "../../env";

export class BullmqQueue {
  private orderQueue: Queue;
  private statusQueue: Queue;
  private QUEUE_ORDER = env.QUEUE_ORDER;
  private QUEUE_STATUS = env.QUEUE_STATUS;

  constructor() {
    // Ler as variáveis de ambiente
    const REDIS_HOST = env.REDIS_HOST;
    const REDIS_PORT = env.REDIS_PORT;
    const REDIS_PASSWORD = env.REDIS_PASSWORD;

    // Configurar as opções do Redis
    const redisOptions: RedisOptions = {
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT),
      password: REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    };

    // Criar uma nova instância da fila com as opções do Redis
    this.orderQueue = new Queue(this.QUEUE_ORDER, { connection: redisOptions });
    this.statusQueue = new Queue(this.QUEUE_STATUS, { connection: redisOptions });
  }

  async addNewOrder(order: Order) {
    try {
      // Adicionar a novo pedido à fila
      await this.orderQueue.add(
        this.QUEUE_ORDER, order,
        {
          // BullMQ exige que o jobId seja uma string não númerica
          jobId: `order-${order.id}`,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );

      console.log(`Pedido ${order.id} adicionado à fila.`);
    } catch (error) {
      console.error(`Erro ao adicionar pedido ${order.id} à fila:`, error);
    }
  }

  async addNewStatus(status: Status) {
    try {
      // Adicionar a novo status à fila
      await this.statusQueue.add(
        this.QUEUE_STATUS, status,
        {
          // BullMQ exige que o jobId seja uma string não númerica
          jobId: `status-${status.id}`,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );

      console.log(`Status ${status.id} adicionado à fila.`);
    } catch (error) {
      console.error(`Erro ao adicionar status ${status.id} à fila:`, error);
    }
  }
}
