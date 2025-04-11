import axios from "axios";
import { encodeJWT } from "../utils/jwt.utils";
import env from "../env";

const BASE_URL = env.BASE_URL!;

export async function compradorCadastro(payload: CompradorCadastroPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BASE_URL}/vt-gateway/comprador/cadastro`, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar comprador:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Falha ao cadastrar comprador");
  }
}

export async function compradorConsulta(payload: CompradorConsultaPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BASE_URL}/vt-gateway/comprador/consulta`, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao consultar comprador:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Falha ao consultar comprador");
  }
}
