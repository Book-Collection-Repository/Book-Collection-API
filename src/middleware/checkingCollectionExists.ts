//Importações
import { Request, Response, NextFunction } from "express";
import { validate } from "uuid";

//Services
import { CollectionService } from "../services/CollectionService";

//Middleware
export async function checkingCollectionExists(req: Request, res: Response, next: NextFunction) {
    const collectionService = new CollectionService(); //Serviços do coleção
    const idCollection = req.params.idCollection; //Pegando o id da coleção

    try {
        //Verificando se o id da coleção foi fornecido
        if (!idCollection || idCollection === undefined || idCollection === null) return res.status(401).json({ message: "ID of Reading Diary not informed" });

        //Validando que o id é válido
        if (!validate(idCollection)) return res.status(401).json({ message: "Invalid format ID" });

        //Pesquisando e validando que a coleção existe
        const dataCollection = await collectionService.getFindExistsCollection(idCollection);
        if (!dataCollection) return res.status(404).json({message: "Collection not found"});

        //Seguindo para próxima função
        next();

    } catch (error) {
        console.error("Error checking collection existence:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};