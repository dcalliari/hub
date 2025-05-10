import { prisma } from "../../database/prisma.database";
import { UserService } from "../../services/user.service";

export default class StatusProcess {
  private userService = new UserService();

  async process(status: Status): Promise<boolean> {
    console.log("Starting status processing...");

    // busca o pedido na billing
    const currentStatus = await this.userService.userRechargeFetch({ uuid: status.paymentTransferCode });

    if (!currentStatus) {
      throw new Error("Status not found");
    }

    // volta para a fila caso o status seja 1 (pendente)
    if (currentStatus.statusPedido === 1) {
      console.log("Status in progress");
      return true;
    }

    // atualiza o status do pedido caso o status seja 2 (concluído)
    if (currentStatus.statusPedido === 2) {
      console.log("Status concluded");
      await prisma.$executeRaw`
        UPDATE sal_order
        SET 
          is_released = true,
          release_date = ${new Date()},
          payment_transfer_code = ${currentStatus.uid},
          blame_user = 'carioca_hub'
        WHERE id = ${status.id};
      `;

      return false;
    }

    throw new Error(`Something went wrong with the status processing: ${currentStatus}`);

    // TODO: tratar outros status (3 - Processamento com Erro e 4 - Nenhum registro importado)
  }
}
