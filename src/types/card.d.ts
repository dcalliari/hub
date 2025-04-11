/**
 * Payload que representa as informações de segunda-via de cartão.
 *
 * @property documentoComprador - CNPJ ou CPF do comprador.
 * @property listaSegundaVia - Lista de segunda-via de cartão a serem solicitadas.
 */
interface CardReplacementPayload {
  documentoComprador: string;
  listaSegundaVia: ListaSegundaVia[];
}

/**
 * Tipo de segunda via.
 *
 * @property cpf - CPF do usuário.
 */
type ListaSegundaVia = {
  cpf: string;
};

/**
 * Payload que representa as informações de consulta de segunda-via de cartão.
 *
 * @property uid - Identificador único de segunda-via de cartão.
 */
interface CardReplacementFetchPayload {
  uid: string;
}

/**
 * Payload que representa as informações de desbloqueio de cartões.
 *
 * @property documentoComprador - CNPJ ou CPF do comprador.
 * @property cpfs - Lista de CPFs a serem desbloqueados.
 */
interface CardUnlockPayload {
  documentoComprador: string;
  cpfs: string[];
}