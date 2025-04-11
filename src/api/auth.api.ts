import axios from "axios";
import env from "../env";

const BASE_URL = env.BASE_URL!;

export async function autenticacao(usuario: string, senha: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/autenticacao`, {
      usuario,
      senha,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro na autenticação:", error.response?.data || error.message);
    throw new Error("Falha na autenticação");
  }
}
