import { prisma } from "../../database/prisma.database";
import { UserService } from "../../services/user.service";

export default class StatusProcess {
  private userService = new UserService();

  async process(status: Status): Promise<boolean> {
    console.log("Starting status processing...");
    const uuid: string = status.uuid;
    // busca o pedido na billing
    const currentStatus = await this.userService.userRechargeFetch({ uuid });

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
      await prisma.$executeRaw`
        UPDATE salesportal."SalOrder"
        SET 
          "isReleased" = true,
          "releaseDate" = NOW(),
          "paymentTransferCode" = ${currentStatus.uuid},
          "blameUser" = 'carioca_hub'
        WHERE id = ${status.id};
      `;

      const [{ externalId }] = await prisma.$queryRaw<Array<{ externalId: number }>>`
        SELECT "externalId"
        FROM salesportal."SalOrder"
        WHERE id = ${status.id};
      `;

      await prisma.$queryRaw`
        UPDATE commerce."ComRechargeOrder"
        SET "isReleased" = TRUE,
            "releaseObservation" = 'Processado pelo Carioca Hub',
            "releaseDate" = NOW(),
            "releaseUser" = 'Processamento Carioca Hub',
            "comRechargeOrderReleaseReasonId" = 1
        WHERE id = ${externalId}::int;`;

      console.log("Status concluded");

      return false;
    }

    throw new Error(`Something went wrong with the status processing: ${currentStatus}`);

    // TODO: tratar outros status (3 - Processamento com Erro e 4 - Nenhum registro importado)
  }
}
