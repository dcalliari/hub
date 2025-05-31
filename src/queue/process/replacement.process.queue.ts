import { prisma } from "../../database/prisma.database";
import { BuyerService } from "../../services/buyer.service";
import { CardService } from "../../services/card.service";
import CompanyProcess from "./company.process.queue";

export default class ReplacementProcess {
  private cardService = new CardService();
  private buyerService = new BuyerService();
  private companyProcess = new CompanyProcess();

  async process(replacement: Replacement): Promise<void> {
    console.log("Starting card replacement processing...");

    // busca a empresa
    const company = (await prisma.$queryRaw<Company[]>`
      SELECT sc.id, sc.document, sc.name, sc.description, su.email, sc."contactPhoneNbr" as phone
      FROM salesportal."SalCompany" sc
      LEFT JOIN "security"."SecUser" su
      ON sc.DOCUMENT = su."document"
      WHERE sc.id = ${replacement.salCompanyId};
    `)[0];

    if (!company) {
      throw new Error("Company not found");
    }

    try {
      // verifica se a empresa já existe na billing
      await this.buyerService.buyerFetch({
        documentoComprador: company.document,
      });

    } catch (error) {
      // se não existir, cria a empresa na billing
      await this.companyProcess.process(company);
      console.log("Company not found in billing, creating...");
    }

    const replacementStatus = await this.cardService.cardReplacement({
      documentoComprador: company.document,
      listaSegundaVia: replacement.cpfs.map(cpf => ({
        cpf
      })),
    });

    console.log("Replacement request sent to billing:", replacementStatus);
  }
}
