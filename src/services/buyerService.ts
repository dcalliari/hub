import { AuthService } from "./authService";
import { compradorCadastro, compradorConsulta } from "../api/buyerApi";

export class BuyerService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
  }

  private async ensureAuthenticated(): Promise<string | null> {
    if (!this.auth.getAuthToken()) {
      console.log("Token não encontrado. Autenticando...");
      await this.auth.authenticate();
    }
    return this.auth.getAuthToken();
  }

  public async registerBuyer(): Promise<any> {
    const payload = {
      telefone: "91982219481",
      nomeFantasia: "Empresa Teste Tmob",
      documentoComprador: "32332318000166",
      nome: "Empresa Teste Tmob",
      email: "daniel@tecsomobi.com.br",
    };

    const authToken = await this.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível cadastrar o comprador.");
      return;
    }

    try {
      const response = await compradorCadastro(payload, authToken);
      console.log("Resposta da API:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao cadastrar comprador:", error.response?.data || error.message);
    }
  }

  public async fetchBuyer(): Promise<any> {
    const payload = {
      documentoComprador: "32332318000166",
    };

    const authToken = await this.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar o comprador.");
      return;
    }

    try {
      const response = await compradorConsulta(payload, authToken);
      console.log("Resposta da API:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar comprador:", error.response?.data || error.message);
    }
  }
}
