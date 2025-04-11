import { AuthService } from "./auth.service";
import { cadastroConsulta, cadastroLote, cadastroLoteConsulta } from "../api/register.api";
import { fetchBatchPayloadSchema, registerBatchPayloadSchema, registerFetchPayloadSchema } from "../validations/register.schema";

export class RegisterService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
  }

  public async registerBatch(payload: RegisterBatchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível cadastrar o lote.");
      return;
    }

    const parsed = registerBatchPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de cadastro de lote inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await cadastroLote(payload, authToken);
      console.log("Resposta da API cadastro/lote:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao cadastrar lote:", error.response?.data || error.message);
    }
  }

  public async fetchBatch(payload: FetchBatchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar o lote.");
      return;
    }

    const parsed = fetchBatchPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de consulta de lote inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await cadastroLoteConsulta(payload, authToken);
      console.log("Resposta da API cadastro/consulta:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar lote:", error.response?.data || error.message);
    }
  }
  
  public async registerFetch(payload: RegisterFetchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar o cadastro.");
      return;
    }
    const parsed = registerFetchPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de consulta de cadastro inválido: ${parsed.error.format()}`);
    }
    try {
      const response = await cadastroConsulta(payload, authToken);
      console.log("Resposta da API cadastro/consulta:", response.data);
      return response.data;
    }
    catch (error: any) {
      console.error("Erro ao consultar cadastro:", error.response?.data || error.message);
    }
  }
}


