import { AuthService } from "./auth.service";
import { compradorCadastro, compradorConsulta } from "../api/buyer.api";
import { fetchBuyerPayloadSchema, registerBuyerPayloadSchema } from "../validations/buyer.schema";

export class BuyerService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
  }

  public async registerBuyer(payload: RegisterBuyerPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível cadastrar o comprador.");
      return;
    }

    const parsed = registerBuyerPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de cadastro de comprador inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await compradorCadastro(payload, authToken);
      console.log("Resposta da API comprador/cadastro:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao cadastrar comprador:", error.response?.data || error.message);
    }
  }

  public async fetchBuyer(payload: FetchBuyerPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar o comprador.");
      return;
    }

    const parsed = fetchBuyerPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de consulta de comprador inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await compradorConsulta(payload, authToken);
      console.log("Resposta da API comprador/consulta:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar comprador:", error.response?.data || error.message);
    }
  }
}
