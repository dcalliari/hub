import { AuthService } from "./auth.service";
import { usuarioConsultaUsoIndevido, usuarioRecarga, usuarioRecargaConsulta } from "../api/user.api";
import { userRechargeFetchPayloadSchema, userRechargePayloadSchema } from "../validations/user.schema";

export class UserService {
  private auth: AuthService;

  constructor() {
    this.auth = AuthService.getInstance();
  }

  public async userRecharge(payload: UserRechargePayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível realizar a recarga.");
      return;
    }

    const parsed = userRechargePayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de recarga inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await usuarioRecarga(payload, authToken);
      console.log("Resposta da API usuario/recarga:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao realizar recarga:", error.response?.data || error.message);
    }
  }

  public async userRechargeFetch(payload: UserRechargeFetchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar a recarga.");
      return;
    }

    const parsed = userRechargeFetchPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de consulta de recarga inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await usuarioRecargaConsulta(payload, authToken);
      console.log("Resposta da API usuario/recarga/consulta:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar recarga:", error.response?.data || error.message);
    }
  }

  public async userAbuseFetch(payload: any): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar uso indevido.");
      return;
    }

    try {
      const response = await usuarioConsultaUsoIndevido(payload, authToken);
      console.log("Resposta da API usuario/consulta-uso-indevido:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar uso indevido:", error.response?.data || error.message);
    }
  }
}
