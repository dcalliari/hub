import { autenticacao } from "../api/authApi";
import { jwtDecode } from "jwt-decode";
import Env from "../Env";

export class AuthService {
  private static USER = Env.USER!;
  private static PASSWORD = Env.PASSWORD!;
  private authToken: string | null = null;

  private isTokenExpired(token: string): boolean {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  public async authenticate(): Promise<string | null> {
    try {
      const response = await autenticacao(
        AuthService.USER,
        AuthService.PASSWORD
      );
      this.authToken = response.token;
      return this.authToken;
    } catch (error: any) {
      console.error(
        "Erro na autenticação:",
        error.response?.data || error.message
      );
      this.authToken = null;
      return null;
    }
  }

  public getAuthToken(): string | null {
    if (this.authToken && this.isTokenExpired(this.authToken)) {
      console.warn("Token expirado. É necessário autenticar novamente.");
      this.authToken = null;
    }
    return this.authToken;
  }
}
