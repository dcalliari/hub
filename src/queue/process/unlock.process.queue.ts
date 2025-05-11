import { Channel } from "amqplib";
import { prisma } from "../../database/prisma.database";
import { CardService } from "../../services/card.service";
import { BuyerService } from "../../services/buyer.service";


export default class StatusProcess {
  private cardService = new CardService();
  private buyerService = new BuyerService();

  async process(unlock: Unlock, channel: Channel): Promise<void> {
    console.log("Starting card unlock processing...");

    const employees = (await prisma.$queryRaw<any[]>`
      SELECT sc.document as "companyDocument", se.document as cpf
      FROM salesportal."SalEmployee" se
      LEFT JOIN salesportal."SalCompany" sc
      ON se."salCompanyId" = sc.id
      WHERE se.id = ANY(ARRAY[${unlock.employees.join(",")}]::INTEGER[]);
    `)

    // busca a empresa
    const company = (await prisma.$queryRaw<Company[]>`
      SELECT sc.id, sc.document, sc.name, sc.description, su.email, sc."contactPhoneNbr" as phone
      FROM salesportal."SalCompany" sc
      LEFT JOIN "security"."SecUser" su
      ON sc.DOCUMENT = su."document"
      WHERE sc.document = ${employees[0].companyDocument};
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
      // se não existir, envia a empresa para a fila company-new
      channel.publish("delay", "company-new", Buffer.from(JSON.stringify(company)), { headers: { "x-delay": 5000 } });
      console.log("Company not found in billing, sending to company-new queue");
    }

    // solicita o desbloqueio dos cartões
    await this.cardService.cardUnlock({ documentoComprador: company.document, cpfs: employees.map((employee) => employee.cpf) });
  }
}
