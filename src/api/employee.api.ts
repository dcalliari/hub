import axios from "axios";
import { encodeJWT } from "../utils/jwt.utils";
import env from "../env";

const BASE_URL = env.BASE_URL!;

export async function cadastroLote(payload: RegisterBatchPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BASE_URL}/vt-gateway/cadastro/lote`, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha ao cadastrar lote");
  }
}

export async function cadastroLoteConsulta(payload: FetchBatchPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BASE_URL}/vt-gateway/cadastro/lote/consulta`, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha ao consultar lote");
  }
}

export async function cadastroConsulta(payload: registerFetchPayload, authToken: string): Promise<any> {
  try {
    const body = encodeJWT(payload);
    const response = await axios.post(`${BASE_URL}/vt-gateway/cadastro/consulta`, body, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha ao consultar cadastro");
  }
}
