/**
 * Payload que representa as informações de cadastro de colaboradores em lote.
 *
 * @property documentoComprador - CNPJ ou CPF do comprador.
 * @property colaboradores - Lista de colaboradores a serem cadastrados no lote.
 */
interface RegisterBatchPayload {
  documentoComprador: string;
  colaboradores: Colaborador[];
}

/**
 * Tipo de endereço de entrega.
 *
 * @property logradouro - Logradouro do endereço.
 * @property numeroLogradouro - Número do logradouro.
 * @property complementoLogradouro - Complemento do logradouro (opcional).
 * @property bairro - Bairro do endereço.
 * @property cidade - Cidade do endereço.
 * @property cep - Código postal do endereço.
 * @property uf - Unidade federativa do endereço.
 */
type EnderecoEntrega = {
  logradouro: string;
  numeroLogradouro: string;
  complementoLogradouro?: string;
  bairro: string;
  cidade: string;
  cep: string;
  uf: string;
};

/**
 * Tipo de colaboradores que podem ser cadastrados.
 *
 * @property cpf - CPF do colaborador.
 * @property nome - Nome do colaborador.
 * @property dataNascimento - Data de nascimento do colaborador.
 * @property celular - Número de celular do colaborador.
 * @property solicitarCartao - Indica se o cartão deve ser solicitado.
 * @property enderecoEntrega - Endereço de entrega do colaborador.
 */
type Colaborador = {
  cpf: string;
  nome?: string;
  dataNascimento?: string;
  celular?: string;
  solicitarCartao: boolean;
  enderecoEntrega?: EnderecoEntrega;
};

/**
 * Payload que representa as informações de consulta de colaboradores em lote.
 *
 * @property uid - Identificador único do lote a ser consultado.
 */
interface RegisterFetchBatchPayload {
  uid: string;
}

/**
 * Payload que representa as informações de consulta de cadastro.
 *
 * @property documentoComprador - CNPJ ou CPF do comprador.
 * @property cpfs - Lista de CPFs a serem consultados.
 */
interface RegisterFetchPayload {
  documentoComprador: string;
  cpfs: string[];
}
