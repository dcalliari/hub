import axios from "axios";
import { encodeJWT } from "../utils/jwt.utils";
import env from "../env";

const BILLING_URL = env.BILLING_URL!;

export async function cartaoSegundaVia(payload: CardReplacementPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BILLING_URL}/vt-gateway/cartao/segunda-via`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha ao solicitar segunda-via de cartão");
  }
}

export async function cartaoSegundaViaConsulta(payload: CardReplacementFetchPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BILLING_URL}/vt-gateway/cartao/segunda-via/consulta`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha ao consultar segunda-via de cartão");
  }
}
