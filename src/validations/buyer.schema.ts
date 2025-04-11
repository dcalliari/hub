import { z } from "zod";
import { isValidDocument } from "../utils/document.utils";

export const registerBuyerPayloadSchema = z.object({
  documentoComprador: z.string().refine((doc) => isValidDocument(doc), "Documento do comprador deve ser um CPF ou CNPJ válido"),
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  nomeFantasia: z.string().min(3, "Nome fantasia deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 números").regex(/^\d+$/, "Telefone deve conter apenas números"),
});

export const fetchBuyerPayloadSchema = z.object({
  documentoComprador: z.string().refine((doc) => isValidDocument(doc), "Documento do comprador deve ser um CPF ou CNPJ válido"),
});
