import { z } from "zod";
import { isValidCPF, isValidDocument } from "../utils/document.utils";

export const cardReplacementPayloadSchema = z.object({
  documentoComprador: z.string().refine((doc) => isValidDocument(doc), "Documento do comprador deve ser um CPF ou CNPJ válido"),
  listaSegundaVia: z.array(
    z.object({
      cpf: z.string().refine(isValidCPF, { message: "Documento do colaborador deve ser um CPF válido" }),
    })
  ),
});

export const cardReplacementFetchPayloadSchema = z.object({
  uid: z.string().min(1, "UID deve ser um identificador válido"),
});

export const cardUnlockPayloadSchema = z.object({
  documentoComprador: z.string().refine((doc) => isValidDocument(doc), "Documento do comprador deve ser um CPF ou CNPJ válido"),
  cpfs: z.array(z.string().refine((doc) => isValidCPF(doc), "Documento do colaborador deve ser um CPF válido")),
});