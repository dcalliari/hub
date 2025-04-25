import { prisma } from "../../database/prisma.database";
import { BuyerService } from "../../services/buyer.service";
import { RegisterService } from "../../services/register.service";
import { UserService } from "../../services/user.service";

export default class OrderProcess {
  private buyerService = new BuyerService();

  private registerService = new RegisterService();

  private userService = new UserService();

  async process(order: Order) {
    console.log("Starting order processing...");

    // busca a empresa
    const company = await prisma.salCompany.findUnique({
      where: { id: order.salCompanyId },
      include: {
        SalCompanyCredential: {
          take: 1,
          select: {
            SecUser: {
              select: {
                email: true,
              }
            }
          },
        }
      }
    });

    if (!company) {
      console.error("Company not found");
      return;
    }

    try {
      // verifica se a empresa já existe na billing
      await this.buyerService.buyerFetch({
        documentoComprador: company.document,
      });

    // se não existir, cria a empresa na billing
    // TODO: verificar retorno de companyFetch
    if (!companyFetch) {
      await this.buyerService.buyerRegister({
        documentoComprador: company.document,
        nome: company.name,
        nomeFantasia: company.description,
        email: "",
        telefone: company.contactPhoneNbr || "",
      });
    }

    // busca todos os funcionários relacionados ao pedido
    const employees = await prisma.salEmployee.findMany({
      where: { id: { in: order.SalOrderItem.map((item) => item.salEmployeeId) } },
    });

    if (!employees || employees.length === 0) {
      console.error("Employees not found");
      return;
    }

    console.log('funcionarios:', employees) //TODO - remover

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
          dataNascimento: employee.birthDate?.toISOString().split("T")[0] || "",
          celular: employee.phone || "",
          solicitarCartao: true,
          enderecoEntrega: {
            logradouro: employee.addrStreet || "",
            numeroLogradouro: employee.addrNbr || "",
            complementoLogradouro: employee.addrComplement || "",
            bairro: employee.addrDistrict || "",
            cidade: employee.addrCity || "",
            cep: employee.addrZipCode || "",
            uf: employee.addrState || "",
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

    await prisma.salOrder.update({
      where: { id: order.id },
      data: {
        paymentTransferCode: userRecharge.uuid, // NOTE: Gambiarra
        // orderStatusUUID: userRecharge.uuid,
      },
    })
  }
}
