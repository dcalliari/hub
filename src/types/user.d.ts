interface UserRechargePayload {
  documentoComprador: string;
  numeroPedidoTicketeira: string;
  recargas: Recarga[];
}

type Recarga = {
  cpf: string;
  valor: number;
};