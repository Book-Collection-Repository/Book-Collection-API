//Importações
import { Request, Response, NextFunction } from "express";
import { validate } from "uuid";

//Services
import { ReadingDiaryServices } from "../services/ReagingDiaryServices";

//Middleware
export async function checkingDiaryExists(req: Request, res: Response, next: NextFunction) {
    const diaryService = new ReadingDiaryServices(); //Serviços do livro
    const idDiary = req.params.idDiary; //Pegando o id do livro

    try {
        //Verificando se o id do diário de leitura foi fornecido
        if (!idDiary || idDiary === undefined || idDiary === null) return res.status(401).json({ message: "ID of Reading Diary not informed" });

        //Validando que o id é válido
        if (!validate(idDiary)) return res.status(401).json({ message: "Invalid format ID" });

        //Pesquisando e validando que o livro existe
        const dataDiary = await diaryService.listReadingDiary(idDiary);
        if (!dataDiary) return res.status(404).json({message: "Reading Diary not found"});

        //Seguindo para próxima função
        next();

    } catch (error) {
        console.error("Error checking book existence:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};