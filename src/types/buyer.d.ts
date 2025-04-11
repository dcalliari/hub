/**
 * Payload que representa as informações de cadastro do comprador.
 *
 * @property documentoComprador - CNPJ ou CPF do comprador.
 * @property nome - Razão social do PJ ou nome do PF.
 * @property nomeFantasia - Nome fantasia no caso de PJ. Não usado para PF
 * @property email - O endereço de e-mail do comprador.
 * @property telefone - O número de telefone do comprador.
 */
interface RegisterBuyerPayload {
  documentoComprador: string;
  nome: string;
  nomeFantasia?: string;
  email: string;
  telefone: string;
}

/**
 * Payload que representa as informações de consulta do comprador.
 *
 * @property documentoComprador - CNPJ ou CPF do comprador.
 */
interface FetchBuyerPayload {
  documentoComprador: string;
}
