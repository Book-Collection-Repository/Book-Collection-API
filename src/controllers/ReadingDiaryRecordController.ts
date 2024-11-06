//Importações
import { Request, Response } from "express";
import { ZodError } from "zod";

//Services
import { ReadingDiaryRecordServices } from "../services/ReadingDiaryRecordService";

//Types
import { RecordDiaryDTO } from "../types/readingDiaryRecordTypes";

//Validator
import { createRecordSchema } from "../validators/recordsDiaryValidator";

//Utils
import { handleZodError } from "../utils/errorHandler";

//Class
export class ReadingDiaryRecordController {
    private readingDiaryRecordService: ReadingDiaryRecordServices;

    constructor() {
        this.readingDiaryRecordService = new ReadingDiaryRecordServices();
    };

    //Requisição para listar todos os regsitro de um diário
    async getListRecordOfReadingDiary(req: Request, res: Response): Promise<Response> {
        try {
            const idDiary = req.params.idDiary; //Pegando o id do diáiro

            //Realizando a busca
            const dataRecords = await this.readingDiaryRecordService.findListRecordsOfReadingDiary(idDiary);
            
            //Retornando
            return res.status(200).json({message: "Reading return datas records", data: dataRecords});
        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return records of Reading Diary: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para listar dados de um registro
    async getDataRecordOfReadingDiary(req: Request, res: Response): Promise<Response> {
        try {
            const idRecord = req.params.idRecord; //Pegando o id do registro

            //Realizando a busca
            const dataRecords = await this.readingDiaryRecordService.findDataRecordOfReadingDiary(idRecord);
            
            //Retornando
            return res.status(200).json({message: "Reading return data record", data: dataRecords});
        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return records of Reading Diary: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para criar um registro
    async createDataRecordOfReadingDiary(req: Request, res: Response): Promise<Response> {
        try {
            const idDiary = req.params.idDiary; //Pegando o id do diáiro
            const idUser = req.id_User; //Pegando o id do usuário
            const data: RecordDiaryDTO = createRecordSchema.parse(req.body); //Validando o que vem do body
            //Criando objeto
            const dataRecords = await this.readingDiaryRecordService.createRecordOfReadingDiary(idDiary, idUser, data);
            if (!dataRecords.success) return res.status(400).json({message: dataRecords.message})
            
            //Retornando
            return res.status(201).json({message: dataRecords.message, data: dataRecords.data});
        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return records of Reading Diary: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para editar um registro
    async updateDataRecordOfReadingDiary(req: Request, res: Response): Promise<Response> {
        try {
            const idRecord = req.params.idRecord; //Pegando o id do diáiro
            const idUser = req.id_User; //Pegando o id do usuário
            const data: RecordDiaryDTO = createRecordSchema.parse(req.body); //Validando o que vem do body

            //Criando objeto
            const dataRecords = await this.readingDiaryRecordService.updateRecordOfReadingDiary(idRecord, idUser, data);
            if (!dataRecords.success) return res.status(400).json({message: dataRecords.message})
            
            //Retornando
            return res.status(200).json({message: dataRecords.message, data: dataRecords.data});
        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }
            
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return records of Reading Diary: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para remover um registro
    async deleteDataRecordOfReadingDiary(req: Request, res: Response): Promise<Response> {
        try {
            const idRecord = req.params.idRecord; //Pegando o id do diáiro
            const idUser = req.id_User; //Pegando o id do usuário

            //Criando objeto
            const dataRecords = await this.readingDiaryRecordService.removeRecordOfReadingDiary(idRecord, idUser);
            if (!dataRecords.success) return res.status(400).json({message: dataRecords.message})
            
            //Retornando
            return res.status(200).json({message: dataRecords.message});
        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return records of Reading Diary: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

};