//Importações
import { Request, Response, NextFunction } from "express";
import { validate } from "uuid";

//Services
import { PublicationService } from "../services/PublicationService";

//Middleware
export async function checkingPublicationExists(req: Request, res: Response, next: NextFunction) {
    const publicationService = new PublicationService(); //Usando os services de publicações
    const idPublication = req.params.idPublication; //Pegando o id do livro

    try {
        //Verificando se o id da publicaçãi foi fornecido
        if (!idPublication || idPublication === undefined || idPublication === null) return res.status(401).json({ message: "ID of Reading Diary not informed" });

        //Validando que o id é válido
        if (!validate(idPublication)) return res.status(401).json({ message: "Invalid format ID" });

        //Pesquisando e validando que o livro existe
        const dataPublication = await publicationService.findDataPublication(idPublication);
        if (!dataPublication) return res.status(404).json({message: "Reading Diary not found"});

        //Seguindo para próxima função
        next();

    } catch (error) {
        console.error("Error checking publication existence:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};