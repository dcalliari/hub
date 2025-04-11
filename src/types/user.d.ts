/**
 * Payload que representa as informações de recarga de usuário.
 *
 * @property documentoComprador - CNPJ ou CPF do comprador.
 * @property numeroPedidoTicketeira - Número do pedido na ticketeira.
 * @property recargas - Lista de recargas a serem realizadas.
 */
interface UserRechargePayload {
  documentoComprador: string;
  numeroPedidoTicketeira: string;
  recargas: Recarga[];
}

/**
 * Tipo de recarga.
 *
 * @property cpf - CPF do usuário.
 * @property valor - Valor da recarga.
 */
type Recarga = {
  cpf: string;
  valor: number;
};

/**
 * Payload que representa as informações de consulta de recarga de usuário.
 *
 * @property uid - Identificador único de recarga.
 */
interface UserRechargeFetchPayload {
  uid: string;
}
