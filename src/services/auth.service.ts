import { autenticacao } from "../api/auth.api";
import { jwtDecode } from "jwt-decode";
import env from "../env";

export class AuthService {
  private static instance: AuthService
  private static BILLING_USER = env.BILLING_USER!;
  private static BILLING_PASSWORD = env.BILLING_PASSWORD!;
  private authToken: string | null = null;

  private constructor() {
    // Singleton pattern to ensure only one instance of AuthService
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private isTokenExpired(token: string): boolean {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  public async authenticate(): Promise<string | null> {
    try {
      const response = await autenticacao(AuthService.BILLING_USER, AuthService.BILLING_PASSWORD);
      this.authToken = response.token;
      return this.authToken;
    } catch (error: any) {
      console.error("Erro na autenticação:", error.response?.data || error.message);
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

  public async ensureAuthenticated(): Promise<string | null> {
    if (!this.getAuthToken()) {
      console.log("Token não encontrado. Autenticando...");
      await this.authenticate();
    }
    return this.getAuthToken();
  }
}
