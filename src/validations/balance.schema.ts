import { z } from "zod";
import { isValidCPF } from "../utils/document.utils";

export const balanceFetchPayloadSchema = z.object({
  cpfs: z.array(z.string().refine((doc) => isValidCPF(doc), "Documento do colaborador deve ser um CPF válido")),
});
