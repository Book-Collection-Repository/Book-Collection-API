//Importações
import { z, ZodError } from 'zod';

//Validação para criação de uma mensagem
export const createMessageSchema = z.object({
    content: z.string()
        .min(3, { message: 'Message must be at least 3 characters long' })
});
