import { Channel } from "amqplib";
import { prisma } from "../../database/prisma.database";
import { BuyerService } from "../../services/buyer.service";
import { RegisterService } from "../../services/register.service";
import { UserService } from "../../services/user.service";

export default class OrderProcess {
  private buyerService = new BuyerService();

  private registerService = new RegisterService();

  private userService = new UserService();

  async process(order: Order, channel: Channel): Promise<void> {
    console.log("Starting order processing...");

    // busca a empresa
    const company = (await prisma.$queryRaw<Company[]>`
      SELECT sc.id, sc.document, sc.name, sc.description, su.email, sc."contactPhoneNbr" as phone
      FROM salesportal."SalCompany" sc
      LEFT JOIN "security"."SecUser" su
      ON sc.DOCUMENT = su."document"
      WHERE sc.id = ${order.salCompanyId};
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
      await channel.sendToQueue("company-new", Buffer.from(JSON.stringify(company)), { headers: { "x-delay": 5000 } });
      console.log("Company not found in billing, sending to company-new queue");
    }

    // busca todos os funcionários relacionados ao pedido
    const employeeIds = order.SalOrderItem.map((item) => Number(item.salEmployeeId)).filter((id) => !isNaN(id));
    const employees = (await prisma.$queryRaw<any[]>`
      SELECT se.id, sc.document as "companyDocument", se.name, se.document, se."birthDate", se."phone",
      se."addrStreet" as "deliveryAddress.street", se."addrNbr" as "deliveryAddress.number",
      se."addrComplement" as "deliveryAddress.complement", se."addrDistrict" as "deliveryAddress.district",
      se."addrCity" as "deliveryAddress.city", se."addrZipCode" as "deliveryAddress.zipCode",
      se."addrState" as "deliveryAddress.state"
      FROM salesportal."SalEmployee" se
      LEFT JOIN salesportal."SalCompany" sc
      ON se."salCompanyId" = sc.id
      WHERE se.id = ANY(ARRAY[${employeeIds.join(",")}]::INTEGER[]);
    `).map((employee) => {
      const deliveryAddress = {
        street: employee["deliveryAddress.street"],
        number: employee["deliveryAddress.number"],
        complement: employee["deliveryAddress.complement"],
        district: employee["deliveryAddress.district"],
        city: employee["deliveryAddress.city"],
        zipCode: employee["deliveryAddress.zipCode"],
        state: employee["deliveryAddress.state"],
      };

      // remove os campos desnecessários
      delete employee["deliveryAddress.street"];
      delete employee["deliveryAddress.number"];
      delete employee["deliveryAddress.complement"];
      delete employee["deliveryAddress.district"];
      delete employee["deliveryAddress.city"];
      delete employee["deliveryAddress.zipCode"];
      delete employee["deliveryAddress.state"];

      return { ...employee, deliveryAddress };
    }) as Employee[];
    
    if (!employees || employees.length === 0) {
      throw new Error("Employees not found");
    }

    // verifica se os funcionários já existem
    const employeeFetch = await this.registerService.registerFetch({
      documentoComprador: company.document,
      cpfs: employees.map((employee) => employee.document || ""),
    });

    // filtra os funcionários que precisam ser criados (status 3)
    const employeesToCreate = employees.filter((employee) => {
      const fetchStatus = employeeFetch.cpfs.find((cpfs: any) => cpfs.cpf === employee.document);
      return fetchStatus?.status === 3;
    });

    // se não existir, cria funcionário
    if (employeesToCreate.length > 0) {
      await this.registerService.registerBatch({
        documentoComprador: company.document,
        colaboradores: employeesToCreate.map((employee) => ({
          cpf: employee.document || "",
          nome: employee.name,
          dataNascimento: employee.birthDate || "",
          celular: employee.phone || "0000000000",
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
        })),
      });
    }

    const recargas = order.SalOrderItem.map((item) => {
      const employee = employees.find((emp) => emp.id === item.salEmployeeId);
      return {
        cpf: employee?.document || "",
        valor: item.value / 100,
      };
    });

    const userRecharge = await this.userService.userRecharge({
      documentoComprador: company.document,
      numeroPedidoTicketeira: order.id.toString(),
      recargas,
    });

    // Envia o UUID da recarga para a fila "status-new"
    await channel.sendToQueue("status-new", Buffer.from(JSON.stringify({ uuid: userRecharge.uuid })));

    await prisma.$executeRaw`
      UPDATE salesportal."SalOrder"
      SET "paymentTransferCode" = ${userRecharge.uuid} -- // NOTE: Gambiarra deveria ter uma coluna orderStatusUUID
      WHERE id = ${order.id};
    `;
  }
}
