import { prisma } from "../../database/prisma.database";
import { CardService } from "../../services/card.service";


export default class StatusProcess {
  private cardService = new CardService();

  async process(unlock: Unlock): Promise<void> {
    console.log("Starting card unlock processing...");

    const employees = (await prisma.$queryRaw<any[]>`
      SELECT sc.document as "companyDocument", se.document as cpf
      FROM salesportal."SalEmployee" se
      LEFT JOIN salesportal."SalCompany" sc
      ON se."salCompanyId" = sc.id
      WHERE se.id = ANY(ARRAY[${unlock.employees.join(",")}]::INTEGER[]);
    `)

    // solicita o desbloqueio dos cartões
    await this.cardService.cardUnlock({documentoComprador: employees[0].companyDocument, cpfs: employees.map((employee) => employee.cpf)});

    // TODO: fazer
  }
}
