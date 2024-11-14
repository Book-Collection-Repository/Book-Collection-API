//Importações
import { z, ZodError } from 'zod';

//Validação para criação de uma avaliação
export const createAvaliationSchema = z.object({
    content: z.string()
        .min(3, { message: 'Avaliation content must be at least 3 characters long' })
        .max(100, { message: 'Avaliation content at most 100 characters long' }),

    evaluationGrade: z.number()
        .int({ message: 'Evaluation grade must be an integer' })
        .min(0, { message: 'Evaluation grade must be at least 0' })
        .max(5, { message: 'Evaluation grade must be at most 5' })
})