//Importações
import { prisma } from "./prisma";

//Types
import { DefaultType } from "@prisma/client";

//Class
export class BookCollectionService {  

    //Listar livros de uma coleção
    async listBookOfCollection (collectionId: string) {
        const booksCollection = await prisma.bookCollection.findMany({
            where: {collectionId},
        });

        return booksCollection;
    };

    //Método para adicionar um livro na coleção personalizada
    async addtingBookInCollection (collectionId: string, bookId: string) {
        try {
            //Verificando se o livro já está presente na coleção
            const verifyBookInCollection = await this.CheckingIfBookIsStoredTheCollection(collectionId, bookId);
            if (verifyBookInCollection) return {success: false, status: 400, message: "The book is already in this collection"};
            
            //Adicionando livro na coleção
            const addtingBook = await prisma.bookCollection.create({
                data: { collectionId, bookId, },
            });

            //Retornando o dado
            return {success: true, status: 201, message: "Book is additing in collection", data: addtingBook};

        } catch (error) {
            console.error("Error addting book in collection: ", error);
            return { success: false, status: 400, message: "There was a problem, default collection not created" };
        }
    };

    //Método para adicionar um livro na coleções padrão
    async addtingBookInDefaultCollection (bookId: string, type: DefaultType) {
        try {
            const collection = await prisma.collection.findUnique({
                where: { defaultType: type}
            });

            if (!collection) return {success: false, status: 400, message: "Collection not found"};

            //Chama o método de de adiciona um livro
            const addtingBook = await this.addtingBookInCollection(collection.id, bookId);
            
            //Retorna a resposta do método
            return {success: addtingBook.success, status: addtingBook.status, message: addtingBook.message, data: addtingBook.data};
        } catch (error) {
            console.error("Error addting book in collection: ", error);
            return { success: false, status: 400, message: "There was a problem, default collection not created" };
        } 
    };

    //Método para remover um livro da coleção
    async removingBookInCollection (collectionId: string, bookId: string) {
        try {
            //Verificando se o livro já está presente na coleção
            const verifyBookInCollection = await this.CheckingIfBookIsStoredTheCollection(collectionId, bookId);
            if (!verifyBookInCollection) return {success: false, status: 400, message: "The book is not already in this collection"};

            //Removendo livro da coleção
            await prisma.bookCollection.delete({
                where: {
                    bookId_collectionId:{
                        bookId, collectionId
                    }
                },
            });

            //Retornando resposta
            return {success: true, status: 200, message: "Book is removing in the collection"};

        } catch (error) {
            console.error("Error removing book in collection: ", error);
            return { success: false, status: 400, message: "There was a problem, default collection not created" };
        }
    };

    //Função para identificar se o livro já faz parte da coleção
    private async CheckingIfBookIsStoredTheCollection (collectionId: string, bookId: string) {
        const data = await prisma.bookCollection.findUnique({
            where: {
                bookId_collectionId: {
                    bookId,
                    collectionId
                },
            },
        });

        return data;
    };
}