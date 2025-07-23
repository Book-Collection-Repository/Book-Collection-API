//Importações
import { Request, Response, NextFunction } from "express";
import { validate } from "uuid";

//Services
import { UserService } from "../services/UserService";

//Middleware
export async function checkingUserExists(req: Request, res: Response, next: NextFunction) {
    const userService = new UserService(); //Serviços de usuário
    const idUser = req.id_User; //Pegando o id do usuário

    try {
        //Verificando se o id do usuário foi fornecido
        if (!idUser || idUser === undefined || idUser === null) return res.status(401).json({ message: "ID of user not informed" });

        // Validando que o ID é um UUID válido
        if (!validate(idUser)) return res.status(400).json({ message: "Invalid format ID" });

        // Verificando se o usuário existe
        const authUser = await userService.getUserByID(idUser);
        if (!authUser) return res.status(404).json({ message: "User not found" });

        // Usuário encontrado, seguindo para a próxima função
        next();
        
    } catch (error) {
        console.error("Error checking user existence:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};