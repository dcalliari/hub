import { AuthService } from "./auth.service";
import { cartaoDesbloaquear, cartaoSegundaVia, cartaoSegundaViaConsulta } from "../api/card.api";
import { cardReplacementPayloadSchema, cardReplacementFetchPayloadSchema, cardUnlockPayloadSchema } from "../validations/card.schema";

export class CardService {
  private auth: AuthService;

  constructor() {
    this.auth = AuthService.getInstance();
  }

  public async cardReplacement(payload: CardReplacementPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível solicitar a segunda-via de cartão.");
      return;
    }

    const parsed = cardReplacementPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de segunda-via inválido: ${JSON.stringify(parsed.error.format())}`);
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
      throw new Error(`Payload de consulta de segunda-via inválido: ${JSON.stringify(parsed.error.format())}`);
    }

    try {
      const response = await cartaoSegundaViaConsulta(payload, authToken);
      console.log("Resposta da API cartao/segunda-via/consulta:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao consultar segunda-via de cartão:", error.response?.data || error.message);
    }
  }

  public async cardUnlock(payload: CardUnlockPayload): Promise<any> {
    const authToken = await this.auth.ensureAuthenticated();
    if (!authToken) {
      console.error("Falha na autenticação. Não é possível desbloquear cartões.");
      return;
    }

    const parsed = cardUnlockPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Payload de desbloqueio de cartões inválido: ${JSON.stringify(parsed.error.format())}`);
    }

    try {
      const response = await cartaoDesbloaquear(payload, authToken);
      console.log("Resposta da API desbloquear/midias:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao desbloquear cartões:", error.response?.data || error.message);
    }
  }
}
