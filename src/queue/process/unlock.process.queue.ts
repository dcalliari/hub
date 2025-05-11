import { prisma } from "../../database/prisma.database";
import { CardService } from "../../services/card.service";


export default class StatusProcess {
  private cardService = new CardService();

  async process(unlock: Unlock): Promise<void> {
    console.log("Starting card unlock processing...");

    // busca o pedido na billing
    const cardUnlock = await this.cardService.cardUnlock({documentoComprador: unlock.document, cpfs: unlock.cpfs});

    // TODO: fazer
  }
}
