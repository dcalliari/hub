import { prisma } from "../../database/prisma.database";
import { UserService } from "../../services/user.service";

export default class StatusProcess {
  private userService = new UserService();

  async process(status: Status) {
    console.log("Starting status processing...");

    // busca o pedido na billing
    const currentStatus = await this.userService.userRechargeFetch({ uuid: status.paymentTransferCode });

    if (!currentStatus) {
      console.error("Status not found");
      return;
    }

    // volta para a fila caso o status seja 1 (pendente)
    if (currentStatus.statusPedido === 1){
      console.log("Status in progress");
      return;
    }

    // atualiza o status do pedido caso o status seja 2 (concluído)
    if (currentStatus.statusPedido === 2){
      console.log("Status concluded");
      await prisma.salOrder.update({
        where: { id: status.id },
        data: {
          isPaid: true,
          isReleased: true,
          paymentTransferCode: currentStatus.uid,
        },
      });
    }

    // tratar outros status (3 - Processamento com Erro e 4 - Nenhum registro importado)
  }
}
