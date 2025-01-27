//Importações
import { EntityVisibility } from "@prisma/client";
import { Request, Response } from "express";

//Services
import { ReadingDiaryServices } from "../services/ReagingDiaryServices";
import { validate } from "uuid";

//Validação
import { updateVisibilitySchema } from "../validators/recordsDiaryValidator";
import { ReadingDiariesCacheServices } from "../services/cacheClient/ReadingDiariesCacheServices";

//Types

//Class
export class ReadingDiaryController {

    private readingDiaryServices: ReadingDiaryServices;
    private cacheServices: ReadingDiariesCacheServices;

    constructor() {
        this.readingDiaryServices = new ReadingDiaryServices();
        this.cacheServices = new ReadingDiariesCacheServices();
    };

    //Requisição para listar todos os diários de leitura
    async getListReadingDiariesOfUser(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id o usuário

            //Verificando se o id do usuário foi fornecido
            if (!idUser || idUser === undefined || idUser === null) return res.status(401).json({ message: "ID of user not informed" });

            // Validando que o ID é um UUID válido
            if (!validate(idUser)) return res.status(400).json({ message: "Invalid format ID" });

            //Busca no cache
            const diariesCache = await this.cacheServices.getListAllReadingDiaries(idUser);
            if (diariesCache) return res.status(200).json({ message: "Listing diaries of reading of user", data: diariesCache });

            //Pesquisando os registros de diários de leitura
            const registersDiariesOfUser = await this.readingDiaryServices.listAllReadingDiariesOfUser(idUser);
            if (registersDiariesOfUser.length <= 0) {
                await this.cacheServices.saveAllReadingDiaries(idUser, registersDiariesOfUser);
                return res.status(200).json({ message: "User doesn't have reading diaries",  });
            }    

            //Salvando dados no cache
            await this.cacheServices.saveAllReadingDiaries(idUser, registersDiariesOfUser);
            
            //Retornando os registros
            return res.status(200).json({ message: "Listing diaries of reading of user", data: registersDiariesOfUser });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para listar todos os diários de leitura
    async getListReadingDiariesForID(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.params.idUser; //Pegando o id o usuário

            //Pesquisando os registros de diários de leitura
            const registersDiariesOfUser = await this.readingDiaryServices.listAllReadingDiariesOfUser(idUser);
            if (registersDiariesOfUser.length <= 0) return res.status(200).json({ message: "User doesn't have reading diaries", data: registersDiariesOfUser });

            //Retornando os registros
            return res.status(200).json({ message: "Listing diaries of reading of user", data: registersDiariesOfUser });

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
            if (!dataDiary) return res.status(404).json({ message: "Reading diary not found" });

            //Retornando o diário de leitura
            return res.status(200).json({ message: "Listing datas of diary of reading", data: dataDiary });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição criar um diário de leitura
    async createReadingDiaryOfBook(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; // Pegando o id do usuário
            const idBook = req.params.idBook; // Pegando o id do livro
    
            // Validando o corpo da requisição
            const validationResult = updateVisibilitySchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    message: "Dados inválidos",
                    errors: validationResult.error.errors,
                });
            }
    
            // Pegando a visibilidade (ou usando o padrão PRIVATE)
            const visibility = validationResult.data.visibility ?? EntityVisibility.PRIVATE;
    
            // Criando e validando a entidade de ReadingDiary
            const createReadingDiary = await this.readingDiaryServices.createReadingDiary(idBook, idUser, visibility);
            if (!createReadingDiary.success) {
                return res.status(400).json({ message: createReadingDiary.message });
            }
    
            // Retornando a criação do ReadingDiary
            return res.status(201).json({
                message: createReadingDiary.message,
                data: createReadingDiary.data,
            });
        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error creating Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    //Requisição para atualizar a visiblidade do diário de leitura
    async updateVisibilityReadingDiary(req: Request, res: Response): Promise<Response> {
        try {
            //Buscando dados da requisição
            const userId = req.id_User;
            const diaryId = req.params.idDiary;
            
            // Validando os dados recebidos
            const validationResult = updateVisibilitySchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    message: "Dados inválidos",
                    errors: validationResult.error.errors,
                });
            }

            const data: EntityVisibility = validationResult.data.visibility;

            //Chamando a dunção de atualização
            const updateFuction = await this.readingDiaryServices.updateVisibilityOfDiary(diaryId, userId, data);
            if (!updateFuction.success) return res.status(400).json({ message: updateFuction.message });

            //Retornando dados
            return res.status(200).json({ message: updateFuction.message, data: updateFuction.data });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error updatting Reading Diaries: ", error);
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
            if (!removeReadingDiary.success) return res.status(400).json({ message: removeReadingDiary.message });

            //Retornando a criação do reading diary
            return res.status(201).json({ message: removeReadingDiary.message });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error creating Reading Diaries: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
};