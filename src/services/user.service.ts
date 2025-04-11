import { AuthService } from "./auth.service";
import { usuarioRecarga } from "../api/user.api";
import { userRechargePayloadSchema } from "../validations/user.schema";

export class UserService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
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
}
