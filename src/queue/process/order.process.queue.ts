import { prisma } from "../../database/prisma.database";
import { BuyerService } from "../../services/buyer.service";
import { RegisterService } from "../../services/register.service";
import { UserService } from "../../services/user.service";
import { RabbitMQConnection } from "../connection/rabbitmq.connection.queue";

export default class OrderProcess {
  private buyerService = new BuyerService();

  private registerService = new RegisterService();

  private userService = new UserService();

  async process(order: Order) {
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
      const rabbitConnection = RabbitMQConnection.getInstance();
      const channel = await rabbitConnection.createChannel("company-new");
      await channel.sendToQueue("company-new", Buffer.from(JSON.stringify(company)));
      console.log("Company not found in billing, sending to company-new queue");
    }

    // busca todos os funcionários relacionados ao pedido
    const employees = await prisma.$queryRaw<Employee[]>`
      SELECT *
      FROM salesportal."SalEmployee"
      WHERE id IN (${order.SalOrderItem.map((item) => item.salEmployeeId).join(",")});
    `;

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
    const rabbitConnection = RabbitMQConnection.getInstance();
    const channel = await rabbitConnection.createChannel("status-new");
    await channel.sendToQueue("status-new", Buffer.from(JSON.stringify({ uuid: userRecharge.uuid })));

    await prisma.$executeRaw`
      UPDATE salesportal."SalOrder"
      SET "paymentTransferCode" = ${userRecharge.uuid} -- // NOTE: Gambiarra deveria ter uma coluna orderStatusUUID
      WHERE id = ${order.id};
    `;
  }
}
