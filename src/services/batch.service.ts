import { AuthService } from "./auth.service";
import { encodeJWT } from "../utils/jwt.utils";
import { cadastroLote, cadastroLoteConsulta } from "../api/batch.api";

export class BatchService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
  }

  public async cadastrarLote(): Promise<any> {
    const payload: LotePayload = {
      documentoComprador: "32332318000166",
      colaboradores: [
        {
          cpf: "25587890074",
          nome: "Colaborador Hang 1",
          dataNascimento: "1999-10-22",
          celular: "2198877665",
          solicitarCartao: true,
          enderecoEntrega: {
            logradouro: "Rua Teste 1",
            numeroLogradouro: "350",
            complementoLogradouro: "casa 2 fundos",
            bairro: "Centro",
            cidade: "Teste",
            cep: "00000000",
            uf: "RJ",
          },
        },
        // Outros colaboradores...
      ],
    };

    if (!this.auth.getAuthToken()) {
      console.log("Token não encontrado. Autenticando...");
      await this.auth.authenticate();
    }

    const authToken = this.auth.getAuthToken();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível cadastrar o lote.");
      return;
    }

    const body = encodeJWT(payload);

    try {
      const response = await cadastroLote(body, authToken);

      console.log("Resposta da API:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao cadastrar lote:", error.response?.data || error.message);
    }
  }

  public async consultarLote(): Promise<any> {
    const payload = {
      uid: "1234567890",
    };

    if (!this.auth.getAuthToken()) {
      console.log("Token não encontrado. Autenticando...");
      await this.auth.authenticate();
    }

    const authToken = this.auth.getAuthToken();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar o lote.");
      return;
    }

    const body = encodeJWT(payload);

    try {
      const response = await cadastroLoteConsulta(body, authToken);

      console.log("Resposta da API:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar lote:", error.response?.data || error.message);
    }
  }
}
