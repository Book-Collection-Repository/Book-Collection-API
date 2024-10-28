//Importações
import { z, ZodError } from 'zod';

//Validação para criação de usuário
export const createUserSchema = z.object({
    userName: z.string()
        .min(3, { message: 'Name must be at least 3 characters long' })
        .max(50, { message: 'Name must be at most 50 characters long' }),

    email: z.string()
        .email({ message: 'Please enter a valid email address' }),

    profileName: z.string()
        .min(3, { message: 'ProfileName must be at least 3 characters long' })
        .max(30, { message: 'ProfileName must be at most 30 characters long' }),

    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
});

//Validação para a autenticação de um usuário
export const authenticateUserSchema = z.object({
    email: z.string()
        .email({ message: 'Please enter a valid email address' }),

    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
});

//Validação para a edição de perfil
export const updateProfileSchema = z.object({
    userName: z.string()
        .min(3, { message: 'Name must be at least 3 characters long' })
        .max(50, { message: 'Name must be at most 50 characters long' }),

    email: z.string()
        .email({ message: 'Please enter a valid email address' }),

    profileName: z.string()
        .min(3, { message: 'ProfileName must be at least 3 characters long' })
        .max(30, { message: 'ProfileName must be at most 30 characters long' }),
});

//Validação para a edição da senha
export const updatePasswordSchema = z.object({
    email: z.string()
        .email({ message: 'Please enter a valid email address' }),

    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' }),

    confirmPassword: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});