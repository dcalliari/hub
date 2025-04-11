import { AuthService } from "./auth.service";
import { cartaoSegundaVia, cartaoSegundaViaConsulta } from "../api/card.api";
import { cardReplacementPayloadSchema, cardReplacementFetchPayloadSchema } from "../validations/card.schema";

export class UserService {
  private auth: AuthService;

  constructor() {
    this.auth = new AuthService();
  }

  public async cardReplacement(payload: CardReplacementPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível solicitar a segunda-via de cartão.");
      return;
    }

    const parsed = cardReplacementPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de segunda-via inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await cartaoSegundaVia(payload, authToken);
      console.log("Resposta da API cartao/segunda-via:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao solicitar segunda-via de cartão:", error.response?.data || error.message);
    }
  }

  public async cardReplacementFetch(payload: CardReplacementFetchPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível consultar a segunda-via de cartão.");
      return;
    }

    const parsed = cardReplacementFetchPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de consulta de segunda-via inválido: ${parsed.error.format()}`);
    }

    try {
      const response = await cartaoSegundaViaConsulta(payload, authToken);
      console.log("Resposta da API cartao/segunda-via/consulta:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar segunda-via de cartão:", error.response?.data || error.message);
    }
  }
}
