import axios from "axios";
import { encodeJWT } from "../utils/jwt.utils";
import env from "../env";

const BILLING_URL = env.BILLING_URL!;

export async function compradorCadastro(payload: BuyerRegisterPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BILLING_URL}/vt-gateway/comprador/cadastro`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha ao cadastrar comprador");
  }
}

export async function compradorConsulta(payload: BuyerFetchPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BILLING_URL}/vt-gateway/comprador/consulta`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha ao consultar comprador");
  }
}
