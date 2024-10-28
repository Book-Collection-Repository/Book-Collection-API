//Importações
import { sign } from "jsonwebtoken";
import { validate } from "uuid";

export const generateToken = (profileName: string, id: string) => {
    if (!validate(id)) {
        return { success: false, message: 'Invalid ID format' }; // Retorna um objeto de erro
    }

    const secret = process.env.SECRET;

    if (!secret) {
        return { success: false, message: "JWT secret is not defined" }; // Retorna um objeto de erro
    }

    const token = sign({ name: profileName }, secret, {
        expiresIn: "1d", //Valido para um dia
        subject: id,
    });

    return { success: true, token }; // Retorna o token em um objeto de sucesso
};
