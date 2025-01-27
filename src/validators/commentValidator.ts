//Importações
import { z, ZodError } from 'zod';

//Validação para criação de uma publicação
export const createCommentSchema = z.object({
    content: z.string()
        .min(3, { message: 'Comment must be at least 3 characters long' })
        .max(400, { message: 'Comment must be at most 400 characters long' })
});