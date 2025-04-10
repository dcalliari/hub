interface AuthResponse {
  token: string;
}

interface JwtPayload {
  jti: string;
  sub: string;
  nome: string;
  perfis: string[];
  login: string;
  iat: number;
  exp: number;
}