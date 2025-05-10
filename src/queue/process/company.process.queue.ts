import { BuyerService } from "../../services/buyer.service";

export default class CompanyProcess {
  private buyerService = new BuyerService();

  async process(company: Company) {
    console.log("Starting company processing...");

    try {
      await this.buyerService.buyerFetch({
        documentoComprador: company.document,
      });
    } catch (error) {
      await this.buyerService.buyerRegister({
        documentoComprador: company.document,
        nome: company.name.replace(/[^a-zA-Z\s]/g, ""),
        nomeFantasia: company.description?.replace(/[^a-zA-Z\s]/g, ""),
        email: company.email || "tmob@migration.com",
        telefone: (company.phone || "").replace(/\D/g, ""),
      });
    }
  }
}
