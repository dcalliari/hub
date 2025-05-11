import { AuthService } from "./auth.service";
import { cadastroConsulta, cadastroLote, cadastroLoteConsulta } from "../api/register.api";
import { registerFetchBatchPayloadSchema, registerBatchPayloadSchema, registerFetchPayloadSchema } from "../validations/register.schema";

export class RegisterService {
  private auth: AuthService;

  constructor() {
    this.auth = AuthService.getInstance();
  }

  public async registerBatch(payload: RegisterBatchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      throw new Error("Falha na autenticação. Não é possível cadastrar o lote.");
    }

    const parsed = registerBatchPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de cadastro de lote inválido: ${JSON.stringify(parsed.error.format())}`);
    }

    try {
      const response = await cadastroLote(payload, authToken);
      console.log("Resposta da API cadastro/lote:", response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao cadastrar lote: ${error.response?.data || error.message}`);
    }
  }

  public async registerFetchBatch(payload: RegisterFetchBatchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar o lote.");
      return;
    }

    const parsed = registerFetchBatchPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de consulta de lote inválido: ${JSON.stringify(parsed.error.format())}`);
    }

    try {
      const response = await cadastroLoteConsulta(payload, authToken);
      console.log("Resposta da API cadastro/lote/consulta:", response.data);
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
      throw new Error(`Payload de consulta de cadastro inválido: ${JSON.stringify(parsed.error.format())}`);
    }
    try {
      const response = await cadastroConsulta(payload, authToken);
      console.log("Resposta da API cadastro/consulta:", response.data);
      return response.data;
    }
    catch (error: any) {
      throw new Error(`Erro ao consultar cadastro: ${error.response?.data || error.message}`);
    }
  }
}


