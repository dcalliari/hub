import axios from "axios";
import Env from "../Env";

const BASE_URL = Env.BASE_URL!;

export async function cadastroLote(data: any, authToken: string): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/vt-gateway/cadastro/lote`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao cadastrar lote:", error.response?.data || error.message);
    throw new Error("Falha ao cadastrar lote");
  }
}

export async function cadastroLoteConsulta(data: any, authToken: string): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/vt-gateway/cadastro/lote/consulta`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao consultar lote:", error.response?.data || error.message);
    throw new Error("Falha ao consultar lote");
  }
}
