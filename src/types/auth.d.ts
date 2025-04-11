/**
 * Payload que representa as informações de resposta da autenticação.
 *
 * @property token - O token JWT retornado pela API após autenticação.
 */
interface AuthResponse {
  token: string;
}

/**
 * Payload que representa as informações decodificadas do JWT.
 *
 * @property jti - ID do token.
 * @property sub - ID do usuário.
 * @property nome - Nome do usuário.
 * @property perfis - Perfis do usuário.
 * @property login - Login do usuário, geralmente CPF ou CNPJ.
 * @property iat - Data de emissão do token (em segundos desde a época Unix).
 * @property exp - Data de expiração do token (em segundos desde a época Unix).
 */
interface JwtPayload {
  jti: string;
  sub: string;
  nome: string;
  perfis: string[];
  login: string;
  iat: number;
  exp: number;
}
