//Importações
import { prisma } from "./prisma";

//Services
import { ReadingDiaryServices } from "./ReagingDiaryServices";
import { GoogleGeminiService } from "./GoogleGeminiServices";
import { ComplaintService } from "./ComplaintService";

//Types
import { RecordDiaryDTO } from "../types/readingDiaryRecordTypes";

//Class
export class ReadingDiaryRecordServices {

    private readingDiaryService: ReadingDiaryServices;
    private geminiServices: GoogleGeminiService;
    private complaintService: ComplaintService;

    constructor() {
        this.readingDiaryService = new ReadingDiaryServices();
        this.geminiServices = new GoogleGeminiService();
        this.complaintService = new ComplaintService();
    };

    //Método para listar todos os registros de um diário de leitura
    async findListRecordsOfReadingDiary(readingDiaryId: string) {
        const data = await prisma.readingDiaryRecord.findMany({
            where: { readingDiaryId }
        });

        return data;
    };

    // Método para listar o último registro de um diário de leitura
    async findLastRecordOfReadingDiary(readingDiaryId: string) {
        const lastRecord = await prisma.readingDiaryRecord.findFirst({
            where: { readingDiaryId },
            orderBy: { createdAt: 'desc' },
        });
        return lastRecord;
    }

    //Método para listar um único registro de leitura
    async findDataRecordOfReadingDiary(recordId: string) {
        const data = await prisma.readingDiaryRecord.findUnique({
            where: { id: recordId },
        });

        return data;
    };

    //Método para criar um registro de leitura
    async createRecordOfReadingDiary(diaryId: string, userId: string, data: RecordDiaryDTO) {
        try {
            //Verificar se o usuário é o responsável por esse diário de leitura
            const userIsResponsible = await this.readingDiaryService.userIsResponsibleForReadingDiary(diaryId, userId);
            if (!userIsResponsible) return { success: false, message: "User not responsible for reading diary" };

            //Verificando o conteúdo do registro de leitura
            const verifyContent = await this.geminiServices.verifyTextPublication(data.content);
            if (!verifyContent.sucess) {
                if (verifyContent.description) await this.complaintService.createComplaint({ userId, type: "READING_DIARY", text: data.content, description: verifyContent.description });
                return { success: verifyContent.sucess, message: verifyContent.message, description: verifyContent.description };
            }

            //Criando o registro
            const createRecord = await prisma.readingDiaryRecord.create({
                data: {
                    ...data,
                    readingDiaryId: diaryId,
                }
            });

            //Atualizando a porcentagem de leitua do usuário
            const updatePercentageRead = await this.readingDiaryService.updateReadingPercentageOfDiary(diaryId, userId, createRecord.pagesRead);
            if (!updatePercentageRead.success) return { success: updatePercentageRead.success, message: updatePercentageRead.message };

            //Retornando a criação do registro
            return { success: true, message: "Record creted successfull", data: createRecord };

        } catch (error) {
            console.error("Error in creating record of reading diary: ", error);
            throw new Error("Error in creating record of reading diary");
        }
    };

    //Método para editar um registro de leitura
    async updateRecordOfReadingDiary(recordId: string, userId: string, data: RecordDiaryDTO) {
        try {
            //Verifica se o registro do diário existe
            const recordDiaryExists = await this.findDataRecordOfReadingDiary(recordId);
            if (!recordDiaryExists) return { success: false, message: "Record diary not exist" };

            //Verificar se o usuário é o responsável por esse diário de leitura
            const userIsResponsible = await this.readingDiaryService.userIsResponsibleForReadingDiary(recordDiaryExists.readingDiaryId, userId);
            if (!userIsResponsible) return { success: false, message: "User not responsible for reading diary" };

            //Editando registro
            const updateRecord = await prisma.readingDiaryRecord.update({
                where: { id: recordId },
                data: { ...data }
            });

            //Atualizando a porcentagem de leitua do usuário
            const updatePercentageRead = await this.readingDiaryService.updateReadingPercentageOfDiary(recordDiaryExists.readingDiaryId, userId, updateRecord.pagesRead);
            if (!updatePercentageRead.success) return { success: updatePercentageRead.success, message: updatePercentageRead.message };


            return { success: true, message: "Record of Reading diary is updated", data: updateRecord };

        } catch (error) {
            console.error("Error in updating record of reading diary: ", error);
            throw new Error("Error in updating record of reading diary");
        }
    };

    //Método para remover um registro de leitura
    async removeRecordOfReadingDiary(recordId: string, userId: string) {
        try {
            //Verifica se o registro do diário existe
            const recordDiaryExists = await this.findDataRecordOfReadingDiary(recordId);
            if (!recordDiaryExists) return { success: false, message: "Record diary not exist" };

            //Verificar se o usuário é o responsável por esse diário de leitura
            const userIsResponsible = await this.readingDiaryService.userIsResponsibleForReadingDiary(recordDiaryExists.readingDiaryId, userId);
            if (!userIsResponsible) return { success: false, message: "User not responsible for reading diary" };

            //Remove o resgistro do diário de leitura
            await prisma.readingDiaryRecord.delete({
                where: { id: recordId }
            });

            //Buscando o último registro de leitura
            const lastRecord = await this.findLastRecordOfReadingDiary(recordDiaryExists.readingDiaryId);
            if (!lastRecord) {
                //Atualizando a porcentagem de leitura do diário
                await this.readingDiaryService.updateReadingPercentageOfDiary(recordDiaryExists.readingDiaryId, userId, 0);
            } else {
                //Atualizando a porcentagem de leitura do diário
                await this.readingDiaryService.updateReadingPercentageOfDiary(recordDiaryExists.readingDiaryId, userId, lastRecord.pagesRead);
            }

            //Retornando resposta
            return { success: true, message: "Record of Reading Diary is removed" };
        } catch (error) {
            console.error("Error in removing record of reading diary: ", error);
            throw new Error("Error in removing record of reading diary");
        }
    };
};