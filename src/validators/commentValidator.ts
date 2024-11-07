//Importações
import { z, ZodError } from 'zod';

//Validação para criação de uma publicação
export const createCommentSchema = z.object({
    content: z.string()
        .min(3, { message: 'Comment must be at least 3 characters long' })
        .max(150, { message: 'Comment must be at most 200 characters long' })
});