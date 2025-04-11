import { z } from "zod";
import { isValidCPF, isValidDocument } from "../utils/document.utils";

export const registerBatchPayloadSchema = z.object({
  documentoComprador: z.string().refine((doc) => isValidDocument(doc), "Documento do comprador deve ser um CPF ou CNPJ válido"),
  colaboradores: z.array(
    z.object({
      cpf: z.string().refine((doc) => isValidCPF(doc), "Documento do colaborador deve ser um CPF válido"),
      nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
      dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento deve estar no formato YYYY-MM-DD"),
      celular: z.string().min(10, "Celular deve ter pelo menos 10 números").regex(/^\d+$/, "Celular deve conter apenas números"),
      solicitarCartao: z.boolean(),
      enderecoEntrega: z.object({
        logradouro: z.string(),
        numeroLogradouro: z.string(),
        complementoLogradouro: z.string().optional(),
        bairro: z.string(),
        cidade: z.string(),
        cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato XXXXX-XXX"),
        uf: z.string().length(2, "UF deve ter exatamente 2 caracteres"),
      }),
    })
  ),
});

export const fetchBatchPayloadSchema = z.object({
  uid: z.string().min(1, "UID deve ser um identificador válido"),
});

export const registerFetchPayloadSchema = z.object({
  documentoComprador: z.string().refine((doc) => isValidDocument(doc), "Documento do comprador deve ser um CPF ou CNPJ válido"),
  cpfs: z.array(
    z.object({
      cpf: z.string().refine((doc) => isValidCPF(doc), "Documento do colaborador deve ser um CPF válido"),
    })
  ),
});
