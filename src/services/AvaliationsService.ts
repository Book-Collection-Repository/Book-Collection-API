//Importações
import { prisma } from "./prisma";

//Services

//Types
import { AvalaitonDTO, CreateAvalaitonDTO } from "../types/AvaliationTypes";

//Class
export class AvaliationService {

    //Método para lsitar as avaliações de um livro
    async findAvaliationsOfBook (bookId: string) {
        const avaliationsBook = await prisma.avaliation.findMany({
            where:{bookId}
        });

        return avaliationsBook;
    };

    //Método para listar as avaliações de um usuário
    async findAvaliationsOfUser (userId: string) {
        const avaliationsUser = await prisma.avaliation.findMany({
            where: {userId},
            include: {
                book: true,
            }
        });

        return avaliationsUser;
    };

    //Método para listar uma avaliação
    async findAvaliaiton (id: string) {
        const avaliation = await prisma.avaliation.findUnique({
            where: {id},
            include: {
                book: true,
            }
        });

        return avaliation;
    };

    //Método para criar uma avaliação
    async createAvaliationForBook (data: AvalaitonDTO) {
        try {
            const creteAvaliation = await prisma.avaliation.create({
                data: {...data},
                include: {book: true},
            });

            return {success: true, message: "Avaliation created for book", data: creteAvaliation};

        } catch (error) {
            console.error("Error in created Avaliation: ", error);
            return {success: false, message: "Error in created avaliation"};
        };
    };

    //Método para editar uma avaliação
    async updateAvaliationOfBook (id: string, userId: string, data: CreateAvalaitonDTO) {
        //Validar que o usuário é o responsável pela a avaliação
        const userIsResponsible = await this.userIsResponsibleForAvaliation(id, userId);
        if (!userIsResponsible.success) return {success: userIsResponsible.success, message: userIsResponsible.message, data: null};

        //Edita o usuário
        const updateAvaliation = await prisma.avaliation.update({
            where:{id},
            data: {...data},
            include: {book: true},
        });

        //Retorna resposta
        return {success: true, message: "Avaliation is updated", data: updateAvaliation};
    };

    //Método para remover uma avaliação
    async removeAvaliationOfBook (id: string, userId: string) {
        //Validar que o usuário é o responsável pela a avaliação
        const userIsResponsible = await this.userIsResponsibleForAvaliation(id, userId);
        if (!userIsResponsible.success) return {success: userIsResponsible.success, message: userIsResponsible.message};

        //Removendo avaliação
        await prisma.avaliation.delete({
            where: {id}
        });

        //Retornando resposta
        return {success: true, message: "Avalition is removid"};
    };

    //Função auxiliar para verificar se o usuário é o responsável pela a avaliação
    private async userIsResponsibleForAvaliation(avaliationId: string, userId: string) {
        const avaliationBook = await prisma.avaliation.findUnique({
            where: {id: avaliationId},
        });

        if (avaliationBook?.userId !== userId) return {success: false, message: "User not responsible for this avaliation"};

        return {success: true, message: "User is responsible for this message"};
    };

    //Função auxiliar para verificar se o usuário já avaliou um livro
    async userAvaliableBook(bookId: string, userId: string) {
        const avaliationBook = await prisma.avaliation.findUnique({
            where:{ userId_bookId: {bookId, userId}}
        });

        return avaliationBook;
    };
}