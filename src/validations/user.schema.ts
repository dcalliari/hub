import { z } from "zod";
import { isValidCPF, isValidDocument } from "../utils/document.utils";

export const userRechargePayloadSchema = z.object({
  documentoComprador: z.string().refine((doc) => isValidDocument(doc), "Documento do comprador deve ser um CPF ou CNPJ válido"),
  numeroPedidoTicketeira: z.string(),
  recargas: z.array(
    z.object({
      cpf: z.string().refine(isValidCPF, { message: "Documento do colaborador deve ser um CPF válido" }),
      valor: z.number().positive(),
    })
  ),
});

export const userRechargeFetchPayloadSchema = z.object({
  uuid: z.string().min(1, "UID deve ser um identificador válido"),
});