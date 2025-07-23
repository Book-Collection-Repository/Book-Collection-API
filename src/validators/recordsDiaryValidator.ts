//Importações
import { EntityVisibility } from '@prisma/client';
import { z, ZodError } from 'zod';

//Validação para criação de registro de um diário
export const createRecordSchema = z.object({
    content: z.string()
        .min(3, { message: 'Content must be at least 3 characters long' }),

    pagesRead: z.number()
        .int({ message: 'Evaluation grade must be an integer' })
        .min(1, { message: 'Pages read must be at least 3 characters long' }),

    evaluationGrade: z.number()
        .int({ message: 'Evaluation grade must be an integer' })
        .min(0, { message: 'Evaluation grade must be at least 0' })
        .max(5, { message: 'Evaluation grade must be at most 5' })
});

//Validação para ataulizar visibilidade de um registro de leitura
export const updateVisibilitySchema = z.object({
    visibility: z.enum([EntityVisibility.PRIVATE, EntityVisibility.PUBLIC]),
  });