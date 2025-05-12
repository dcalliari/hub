import { prisma } from "../../database/prisma.database";
import { BuyerService } from "../../services/buyer.service";
import { RegisterService } from "../../services/register.service";
import CompanyProcess from "./company.process.queue";

export default class EmployeeProcess {

  private companyProcess = new CompanyProcess()
  private registerService = new RegisterService();
  private buyerService = new BuyerService();

  async process(employees: Employee[]) {
    console.log("Starting employee processing...");

    const companyDocument = employees[0].companyDocument;

    // verifica se a empresa já existe na billing
    try {
      await this.buyerService.buyerFetch({
        documentoComprador: companyDocument,
      });
    } catch (error) {
      // se não existir, envia a empresa para a fila company-new
      const company = (await prisma.$queryRaw<Company[]>`
      SELECT sc.id, sc.document, sc.name, sc.description, su.email, sc."contactPhoneNbr" as phone
      FROM salesportal."SalCompany" sc
      LEFT JOIN "security"."SecUser" su
      ON sc.DOCUMENT = su."document"
      WHERE sc.document = ${companyDocument};
    `)[0];

      if (!company) {
        throw new Error("Company not found");
      }

      // se não existir, cria a empresa na billing
      await this.companyProcess.process(company);
      console.log("Company not found in billing, creating...");
    }

    // registra os funcionários na billing
    const colaboradores = employees.map((employee) => ({
      cpf: employee.document || "",
      nome: employee.name || "",
      dataNascimento: employee.birthDate || "",
      celular: (employee.phone || "0000000000").replace(/\D/g, ""),
      solicitarCartao: true,
      enderecoEntrega: {
        logradouro: employee.deliveryAddress.street || "",
        numeroLogradouro: employee.deliveryAddress.number || "",
        complementoLogradouro: employee.deliveryAddress.complement || "",
        bairro: employee.deliveryAddress.district || "",
        cidade: employee.deliveryAddress.city || "",
        cep: (employee.deliveryAddress.zipCode || "").replace(/\D/g, ""),
        uf: employee.deliveryAddress.state || "",
      },
    }));

    await this.registerService.registerBatch({
      documentoComprador: companyDocument,
      colaboradores,
    });
  }
}
