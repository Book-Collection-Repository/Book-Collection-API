//Importações
import { Request, Response, NextFunction } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";

//Importando tipo
import { IPayload } from "../types/IPayloadTypes";

export async function authValidationToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Restricted access" });
    }

    try {
        const secret = process.env.SECRET;
        if (!secret) {
            throw new Error('JWT secret is not defined');
        }

        const payload = verify(token, secret) as IPayload;
        req.id_User = payload.sub;

        next(); //Chamando a próxima função
    
    } catch (error) {
        console.error(error);

        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(401).json({ message: "Invalid token" });
    }
}