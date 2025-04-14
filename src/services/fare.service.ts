import { AuthService } from "./auth.service";
import { tarifasVigentes } from "../api/fare.api";

export class FareService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
  }

  public async fareFetch(payload: any): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar tarifas vigentes.");
      return;
    }

    try {
      const response = await tarifasVigentes(payload, authToken);
      console.log("Resposta da API tarifas/vigentes:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar tarifas vigentes:", error.response?.data || error.message);
    }
  }
}
