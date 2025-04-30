import { CronJob } from 'cron';
import env from '../env';
import { prisma } from '../database/prisma.database';
import { BullmqQueue } from '../services/queue/bullmq.queue.service';

const bullmq = new BullmqQueue();

export default class CronJobQueue {
    constructor() {
        // if (
        //     env.DISABLE_CRONJOB
        //     || (env.STAGE !== 'test' && env.SERVER_ENVIRONMENT === 'LocalMachine')
        // ) return;

        new CronJob(env.CRONJOB_INTERVAL, this.processUnprocessed.bind(this)).start();
        console.log(`Cron job started with interval: ${env.CRONJOB_INTERVAL}`);
    }


    async processUnprocessed() {
        this.processUnfinishedOrders();
        this.processUnfinishedStatus();
    }

    async processUnfinishedOrders() {
        try {
            console.log(`Executing Cron Orders ${new Date().toLocaleString()}`);

            const orders: Order[] = await prisma.salOrder.findMany({
                where: {
                        isPaid: true,
                        isReleased: false,
                        paymentTransferCode: null, // NOTE: Gambiarra
                        // orderStatusUUID: null,
                },
                select: {
                    id: true,
                    salCompanyId: true,
                    SalOrderItem: {
                        select: {
                            salCompanyId: true,
                            salEmployeeId: true,
                            value: true,
                        },
                    },
                },
            });

            for (const order of orders) {
                await bullmq.addNewOrder(order);
            }

        } catch (error) {
            console.error('Error processing orders:', error);
        }
    }

    async processUnfinishedStatus() {
        try {
            console.log(`Executing Cron Status ${new Date().toLocaleString()}`);

            const statuses: Status[] = await prisma.salOrder.findMany({
                where: {
                    isPaid: true,
                    isReleased: false,
                    NOT: { paymentTransferCode: null}  // NOTE: Gambiarra
                    // NOT: { orderStatusUUID: null}
                },
                select: {
                    id: true,
                    paymentTransferCode: true,
                }
            });

            for (const status of statuses) {
                await bullmq.addNewStatus(status);
            }

        } catch (error) {
            console.error('Error processing statuses:', error);
        }
    }
}
