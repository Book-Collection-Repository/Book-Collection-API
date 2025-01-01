//Importações
import { prisma } from "./prisma";

//Services
import { ReadingDiaryServices } from "./ReagingDiaryServices";
import { GoogleGeminiService } from "./GoogleGeminiServices";

//Types
import { RecordDiaryDTO } from "../types/readingDiaryRecordTypes";

//Class
export class ReadingDiaryRecordServices {

    private readingDiaryService: ReadingDiaryServices;
    private geminiServices: GoogleGeminiService;

    constructor() {
        this.readingDiaryService = new ReadingDiaryServices();
        this.geminiServices = new GoogleGeminiService();
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
            if (!verifyContent.sucess) return { success: verifyContent.sucess, message: verifyContent.message, description: verifyContent.description };

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

            //Chamando a atualização
            const updatedDiary = await this.readingDiaryService.updateLastReadingPercentage(recordDiaryExists.readingDiaryId);
            if (!updatedDiary.success) return { success: updatedDiary.success, message: updatedDiary.message };

            //Remove o resgistro do diário de leitura
            await prisma.readingDiaryRecord.delete({
                where: { id: recordId }
            });

            //Retornando resposta
            return { success: true, message: "Record of Reading Diary is removed" };
        } catch (error) {
            console.error("Error in removing record of reading diary: ", error);
            throw new Error("Error in removing record of reading diary");
        }
    };
};