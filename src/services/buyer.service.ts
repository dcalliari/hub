import { AuthService } from "./auth.service";
import { compradorCadastro, compradorConsulta } from "../api/buyer.api";
import { buyerFetchPayloadSchema, buyerRegisterPayloadSchema } from "../validations/buyer.schema";

export class BuyerService {
  private auth: AuthService;

  constructor() {
    this.auth = AuthService.getInstance();
  }

  public async buyerRegister(payload: BuyerRegisterPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      throw new Error("Falha na autenticação. Não é possível cadastrar o comprador.");
    }

    // const parsed = buyerRegisterPayloadSchema.safeParse(payload);
    // if (!parsed.success) {
    //   throw new Error(`Payload de cadastro de comprador inválido: ${JSON.stringify(parsed.error.format())}`);
    // }

    try {
      const response = await compradorCadastro(payload, authToken);
      console.log("Resposta da API comprador/cadastro:", response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao cadastrar comprador: ${error.response?.data || error.message}`);
    }
  }

  public async buyerFetch(payload: BuyerFetchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      throw new Error("Falha na autenticação. Não é possível consultar o comprador.");
    }

    // const parsed = buyerFetchPayloadSchema.safeParse(payload);
    // if (!parsed.success) {
    //   throw new Error(`Payload de consulta de comprador inválido: ${JSON.stringify(parsed.error.format())}`);
    // }

    try {
      const response = await compradorConsulta(payload, authToken);
      console.log("Resposta da API comprador/consulta:", response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao consultar comprador: ${error.response?.data || error.message}`);
    }
  }
}
