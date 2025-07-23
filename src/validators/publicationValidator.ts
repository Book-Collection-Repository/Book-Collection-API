//Importações
import { z, ZodError } from 'zod';

//Validação para criação de uma publicação
export const createPublicationSchema = z.object({
    content: z.string()
        .min(3, { message: 'Publication must be at least 3 characters long' })
        .max(500, { message: 'Publication must be at most 500 characters long' })
});