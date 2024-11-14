//Importações
import { Request, Response } from "express";

//Services
import { ReadingDiaryServices } from "../services/ReagingDiaryServices";

//Types

//Class
export class ReadingDiaryController {

    private readingDiaryServices: ReadingDiaryServices;

    constructor () {
        this.readingDiaryServices = new ReadingDiaryServices();
    };

    //Requisição para listar todos os diários de leitura
    async getListReadingDiariesOfUser(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id o usuário

            //Pesquisando os registros de diários de leitura
            const registersDiariesOfUser = await this.readingDiaryServices.listAllReadingDiariesOfUser(idUser);
            if (registersDiariesOfUser.length <= 0) return res.status(200).json({message: "User doesn't have reading diaries"});  

            //Retornando os registros
            return res.status(200).json({message: "Listing diaries of reading of user", data: registersDiariesOfUser});

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para listar os dados de um diário de leitura
    async getListDataReadingDiary(req: Request, res: Response): Promise<Response> {
        try {
            const idDiary = req.params.idDiary; //Pegando o id do diário de leitura
            
            //Validando que o diário existe
            const dataDiary = await this.readingDiaryServices.listReadingDiary(idDiary);
            if (!dataDiary) return res.status(404).json({message: "Reading diary not found"});

            //Retornando o diário de leitura
            return res.status(200).json({message:"Listing datas of diary of reading", data: dataDiary});

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição criar um diário de leitura
    async createReadingDiaryOfBook(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário;
            const idBook = req.params.idBook; //Pegando o id do livro
            
            //Criando e validando a entidade de reading
            const createReadingDiary = await this.readingDiaryServices.createReadingDiary(idBook, idUser);
            if (!createReadingDiary.success) return res.status(400).json({message: createReadingDiary.message});

            //Retornando a criação do reading diary
            return res.status(201).json({message: createReadingDiary.message, data: createReadingDiary.data});
        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error creating Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para remover um diário de leitura
    async removeReadingDiaryOfBook(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário;
            const idDiary = req.params.idDiary; //Pegando o id do diário de leitura
            
            //Criando e validando a entidade de reading
            const removeReadingDiary = await this.readingDiaryServices.removeReadingDiary(idDiary, idUser);
            if (!removeReadingDiary.success) return res.status(400).json({message: removeReadingDiary.message});
            
            //Retornando a criação do reading diary
            return res.status(201).json({message: removeReadingDiary.message});

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error creating Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
};