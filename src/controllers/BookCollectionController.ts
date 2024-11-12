//Importações
import { Request, Response } from "express";

//Types
import { CreateBookDTO } from "../types/bookTypes";

//Services
import { CollectionService } from "../services/CollectionService";
import { BookService } from "../services/BookService";
import { BookCollectionService } from "../services/BookCollectionService";

//Class
export class BookCollectionController {
    private collectionService: CollectionService;
    private bookService: BookService;
    private bookCollectionService: BookCollectionService;

    constructor() {
        this.collectionService = new CollectionService();
        this.bookService = new BookService();
        this.bookCollectionService = new BookCollectionService();
    };

    //Requisição para listar todos os livros de uma coleção
    async getListBooksInCollection(req: Request, res: Response): Promise<Response> {
        try {
            const idCollection = req.params.idCollection;

            //Procurando os livros da coleção
            const booksInCollection = await this.bookCollectionService.listBookOfCollection(idCollection);
            if (!booksInCollection) return res.status(400).json({ message: "Collection does not yet have a book" });

            //Retornando os livros da coleção
            return res.status(200).json({ books: booksInCollection });
        } catch (error) {
            console.error("Error return books in the collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para adicionar um livro na coleção
    async postAdditingBooksInCollection(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;
            const idBook = req.params.idBook; //Id da API Externa

            //Verificando e pesquisando o livro na API externa
            const dataBook = await this.bookService.searchBookInExternalApiForId(idBook); //Pesquisando na API externa
            if (!dataBook.success || dataBook.data === null || dataBook.data === undefined) return res.status(400).json({ message: dataBook.message });

            // Obtém ou cria o livro no banco de dados
            const bookId = await this.findOrCreateBookInDatabase(dataBook.data, idBook);

            //Adicionando o livro na coleção
            const addBookInCollection = await this.bookCollectionService.addtingBookInCollection(idCollection, bookId, idUser);
            if (!addBookInCollection.success) return res.status(addBookInCollection.status).json({ message: addBookInCollection.message });

            //Retornando os livros da coleção
            return res.status(addBookInCollection.status).json({ message: addBookInCollection.message, data: addBookInCollection.data });
        } catch (error) {
            console.error("Error return books in the collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição apra remover um livro da coleção
    async deleteRemovingBooksInCollection(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idCollection = req.params.idCollection;
            const idBook = req.params.idBook;

            //Validando que o usuário é o responsável pela a coleção
            const userIsResponsibleForCollection = await this.collectionService.getUserResponsibleForCollection(idCollection, idUser);
            if (!userIsResponsibleForCollection) return res.status(400).json({ error: "User not found OR user not responsible for collection" });

            //Adicionando o livros aa coleção
            const removeBookInCollection = await this.bookCollectionService.removingBookInCollection(idCollection, idBook);
            if (!removeBookInCollection.success) return res.status(removeBookInCollection.status).json({ message: removeBookInCollection.message });

            //Retornando os livros da coleção
            return res.status(removeBookInCollection.status).json({ message: removeBookInCollection.message });
        } catch (error) {
            console.error("Error return books in the collection: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    // Função para encontrar ou criar o livro no banco de dados
    private async findOrCreateBookInDatabase(bookData: CreateBookDTO, idBook: string): Promise<string> {
        //Validando que o livro já esteja armazenado no sistema
        const existingBook = await this.bookService.getBookInDataBaseWithExternalID(idBook);
        if (existingBook) return existingBook.id;

        //Adicionando o livro no sistema
        const newBook = await this.bookService.addtingBookInDataBase(bookData);
        if (!newBook.success || !newBook.data) throw new Error("Failed to add book to the database");

        //Retornando o id do livro caso o livro esteja no banco de dados
        return newBook.data.id;
    };
}