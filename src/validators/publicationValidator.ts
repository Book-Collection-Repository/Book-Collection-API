//Importações
import { z, ZodError } from 'zod';

//Validação para criação de uma publicação
export const createPublicationSchema = z.object({
    content: z.string()
        .min(3, { message: 'Publication must be at least 3 characters long' })
        .max(200, { message: 'Publication must be at most 200 characters long' })
});