// Importações
import bcryptjs from "bcryptjs";

// Criptografando a senha do usuário
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcryptjs.genSalt(12); 
    return bcryptjs.hash(password, salt);
};

// Coferindo a senha do usuário;
export const checkePassword = async (passwordRequest: string, passwordUser: string) => {
    return await bcryptjs.compare(passwordRequest, passwordUser);
}