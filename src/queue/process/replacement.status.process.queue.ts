import { prisma } from "../../database/prisma.database";
import { CardService } from "../../services/card.service";

export default class ReplacementStatusProcess {
  private cardService = new CardService();

  async process(replacementStatus: ReplacementStatus): Promise<boolean> {
    console.log("Starting replacement status processing...");
    const uid: string = replacementStatus.uid;
    // busca o pedido na billing
    const currentStatus = await this.cardService.cardReplacementFetch({ uid });

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
      return false;
    }

    throw new Error(`Something went wrong with the status processing: ${currentStatus}`);

    // TODO: tratar outros status (3 - Processamento com Erro e 4 - Nenhum registro importado)
  }
}
