//Importações
import {z, ZodError} from "zod";

//Types
import { EntityVisibility } from "@prisma/client";

//Definindo tipo de validação para a criação de coleção personalizada
export const createCustomCollectionSchema = z.object({
    title: z.string()
        .min(3, {message: "The title of the collection must be at least 3 characters long"})
        .max(50, {message: "The title of the collection must be no longer than 50 characters"}),
    
    description: z.string().optional(),

    visibility: z.nativeEnum(EntityVisibility, {
        errorMap: () => ({ message: "Visibility must be either PUBLIC or PRIVATE" })
    }),
});