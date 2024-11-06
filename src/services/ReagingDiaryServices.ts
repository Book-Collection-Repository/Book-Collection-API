//Importações
import { prisma } from "./prisma";

//Services
import { BookService } from "./BookService";
import { RedisClientService } from "./RedisClientService";
import { ReadingFinished } from "@prisma/client";

//Types

//Class
export class ReadingDiaryServices {

    private bookService: BookService;
    private redisClientService: RedisClientService;

    constructor() {
        this.bookService = new BookService();
        this.redisClientService = new RedisClientService();
    }

    //Méotodo para listar todos os diários de leitura
    async listAllReadingDiariesOfUser(userId: string) {
        const diaries = await prisma.readingDiary.findMany({
            where: { userId }
        });

        return diaries;
    };

    //Método para listar os dados de umm diário de leitura
    async listReadingDiary(diaryId: string) {
        const diary = await prisma.readingDiary.findUnique({
            where: { id: diaryId },
            include: { readingDiaryRecords: true }
        });

        return diary;
    };

    //Método para criar um diário de leitura
    async createReadingDiary(bookId: string, userId: string) {
        //Validar que o usuário já não tenho um diário de leitura
        const existingDiary = await this.userHaveReadingDiaryOfBook(bookId, userId);

        //Se existir um diário de leitura marcado DONE, pode-se reabir como REREAD
        if (existingDiary) {
            if (existingDiary.readingFinished === "READING") return { success: false, message: "User already has an active reading diary for this book." };

            // Atualiza o status para `REREAD` para reiniciar a leitura
            if (existingDiary.readingFinished === "DONE") await this.updateCategoryOfReread(existingDiary.id);
        }

        // Criando um novo diário de leitura
        const createDiary = await prisma.readingDiary.create({
            data: {
                bookId,
                userId,
                readingPercentage: 0,
            },
        });

        return { success: true, message: "Reading Diary created", data: createDiary };
    };

    //Método para atualizar o status de um diário de leitura
    async updateCategoryOfReread(diaryId: string) {
        const updatedDiary = await prisma.readingDiary.update({
            where: { id: diaryId },
            data: { readingFinished: "REREAD", readingPercentage: 0 }
        });

        return { success: true, message: "Reading Diary reactivated for rereading.", data: updatedDiary };
    };

    //Método para atualizar o status de um diário de leitura
    async updateCategoryOfReadingDiaryForReafingFinished(diaryId: string, category: ReadingFinished) {
        const updatedDiary = await prisma.readingDiary.update({
            where: { id: diaryId },
            data: { readingFinished: category }
        });

        return { success: true, message: "Reading Diary is updating", data: updatedDiary };
    };

    //Método para atualizar porcentagem de leitura
    async updateReadingPercentageOfDiary(diaryId: string, pagesRead: number) {
        //Validando que o diário de leitura existe
        const data = await this.listReadingDiary(diaryId);
        if (!data) return { success: false, message: "ReadingDiary not found" };

        //Buscando o livro do diário de leitura
        const book = await this.bookService.getBookInDataBaseWithID(data.bookId);
        if (!book || book.quantityPages <= 0 || book.quantityPages === undefined) return { success: false, message: "Book not found or pages book not informed" };

        //Calculando a porcentagem
        const readPercentage = this.calcPercentageOfReadingBook(book.quantityPages, pagesRead);
        if (!readPercentage.success) return { success: readPercentage.success, message: readPercentage.message };

        //Se a porcentagem for maior ou igual a 100, finalizar diário
        if (readPercentage.data && readPercentage.data >= 100) await this.updateCategoryOfReadingDiaryForReafingFinished(diaryId, "DONE");

        //Salvando a porcentagem atual no Redis como porcentagem anterior antes de atualizar
        await this.redisClientService.savePreviousReadingPercentage(diaryId, data.readingPercentage);

        //Atualizando diário de leitura
        const updateReading = await prisma.readingDiary.update({
            where: { id: diaryId },
            data: {
                readingPercentage: readPercentage.data
            },
        });

        //Retornando
        return { success: true, message: "Reading percentage update successfull", data: updateReading };
    };

    //Método para retornar a porcentagem antiga da leitura
    async updateLastReadingPercentage(diaryId: string) {
        {
            //Validando que o diário de leitura existe
            const data = await this.listReadingDiary(diaryId);
            if (!data) return { success: false, message: "ReadingDiary not found" };

            //Buscando valor antigo
            const lastPercentage = await this.redisClientService.getPreviousReadingPercentage(diaryId);
            if (!lastPercentage) return { success: false, message: "Not found last percentage" };

            //Atualizar o estado da leitura
            if (lastPercentage >= 100) await this.updateCategoryOfReadingDiaryForReafingFinished(diaryId, "DONE");
            else await this.updateCategoryOfReadingDiaryForReafingFinished(diaryId, "READING");

            //Atualizando diário de leitura
            const updateReading = await prisma.readingDiary.update({
                where: { id: diaryId },
                data: {
                    readingPercentage: lastPercentage
                },
            });

            //Retornando
            return { success: true, message: "Reading percentage update successfull", data: updateReading };
        }
    };

    //Método para remover um diário de leitura
    async removeReadingDiary(diaryId: string, userId: string) {
        // Validação para garantir que o usuário é o responsável pelo diário de leitura
        const isResponsible = await this.userIsResponsibleForReadingDiary(diaryId, userId);
        if (!isResponsible) return { success: false, message: "User is not the owner of this reading diary." };

        await prisma.readingDiary.delete({
            where: { id: diaryId }
        });

        return { success: true, message: "Reading Diary is removed" };
    };

    //Função auxiliar para verificar se um usuário possui um diário de leitura para o livro específico
    private async userHaveReadingDiaryOfBook(bookId: string, userId: string) {
        const data = await prisma.readingDiary.findFirst({
            where: { bookId, userId }
        });

        return data;
    };

    //Função auxilar para verificar se um usuário é o resposável pelo diário de leitura
    async userIsResponsibleForReadingDiary(diaryId: string, userId: string) {
        const diary = await prisma.readingDiary.findUnique({
            where: { id: diaryId }
        });
        return diary?.userId === userId;
    };

    //Função auxiliar para calcular a porcentagem de leitura de um diário de leitura
    private calcPercentageOfReadingBook(totalPages: number, pagesRead: number) {
        //Verfica se os números existem corretamente
        if (totalPages <= 0) return { success: false, message: "Total pages must be greater than zero." }
        if (pagesRead <= 0) return { success: false, message: "Pages read must be greater than zero." }

        //Calcular a porcentagem
        const readPercentage = (pagesRead / totalPages) * 100;

        //Limita a porcentagem para ser arrendondado para um numéro entre 0 e 100
        const percentage = Math.min(Math.max(readPercentage, 0), 100);

        return { success: true, message: "Percentage calculed", data: percentage }
    };
};