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
    throw new Error(error.response?.data?.message || "Falha na autenticação");
  }
}
