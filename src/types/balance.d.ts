/**
 * Payload que representa as informações de consulta de saldo.
 * 
 * @property cpfs - Lista de CPFs a serem consultados.
 */
interface FetchBalancePayload {
  cpfs: string[];
}