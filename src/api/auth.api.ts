import axios from "axios";
import env from "../env";

const BILLING_URL = env.BILLING_URL!;

export async function autenticacao(usuario: string, senha: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${BILLING_URL}/autenticacao`,
      {
        usuario,
        senha,
      },
      {
        timeout: 15000,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Falha na autenticação");
  }
}
