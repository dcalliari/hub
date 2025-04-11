interface LotePayload {
  documentoComprador: string;
  colaboradores: Colaborador[];
}

interface Colaborador {
  cpf: string;
  nome: string;
  dataNascimento: string;
  celular: string;
  solicitarCartao: boolean;
  enderecoEntrega: EnderecoEntrega;
}

interface EnderecoEntrega {
  logradouro: string;
  numeroLogradouro: string;
  complementoLogradouro?: string;
  bairro: string;
  cidade: string;
  cep: string;
  uf: string;
}
