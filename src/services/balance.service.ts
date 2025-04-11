import { AuthService } from "./auth.service";
import { saldoConsulta } from "../api/balance.api";
import { fetchBalancePayloadSchema } from "../validations/balance.schema";

export class BalanceService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
  }

  public async fetchBalance(payload: FetchBalancePayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar o saldo.");
      return;
    }

    const parsed = fetchBalancePayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de consulta de saldo inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await saldoConsulta(payload, authToken);
      console.log("Resposta da API saldo/consulta:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar saldo:", error.response?.data || error.message);
    }
  }
}
