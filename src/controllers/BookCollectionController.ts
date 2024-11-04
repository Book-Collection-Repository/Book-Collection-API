//Importações
import { Request, Response } from "express";
import { validate } from "uuid";

//Types
import { CustomCollectionDTO } from "../types/collectionTypes";

//Services
import { CollectionService } from "../services/CollectionService";
import { UserService } from "../services/UserService";
import { BookService } from "../services/BookService";
import { BookCollectionService } from "../services/BookCollectionService";

//Class
export class BookCollectionController {
    private collectionService: CollectionService;
    private userService: UserService;
    private bookService: BookService;
    private bookCollectionService: BookCollectionService;

    constructor() {
        this.collectionService = new CollectionService();
        this.userService = new UserService();
        this.bookService = new BookService();
        this.bookCollectionService = new BookCollectionService();
    }

    //Requisição para listar todos os livros de uma coleção
    async getListBooksInCollection(req: Request, res: Response): Promise<Response> {
        try {
            const idCollection = req.params.idCollection;

            //Validando que o id é válido
            if (!validate(idCollection)) return res.status(400).json({ error: "Invalid ID format" });

            //Validandando que a coleção existe
            const existCollectionWithID = await this.collectionService.listDataFromCollection(idCollection);
            if (!existCollectionWithID.success) return res.status(existCollectionWithID.status).json({ message: existCollectionWithID.message });

            //Procurando os livros da coleção
            const booksInCollection = await this.bookCollectionService.listBookOfCollection(idCollection);
            if (!booksInCollection) return res.status(400).json({ message: "Collection does not yet have a book" });

            //Retornando os livros da coleção
            return res.status(200).json({ collection: existCollectionWithID, books: booksInCollection });
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
            const idBook = req.params.idBook;

            //Validando que o id é válido
            if (!validate(idCollection) || !validate(idBook)) return res.status(400).json({ error: "Invalid ID format" });

            //Validandando que a coleção existe
            const existCollectionWithID = await this.collectionService.listDataFromCollection(idCollection);
            if (!existCollectionWithID.success) return res.status(existCollectionWithID.status).json({ message: existCollectionWithID.message });

            //Validando que o usuário existe e é o responsável pela a coleção
            const userExistWithID = await this.userService.getUserByID(idUser);
            const userIsResponsibleForCollection = await this.collectionService.getUserResponsibleForCollection(idCollection, idUser);
            if (!userExistWithID || !userIsResponsibleForCollection) return res.status(400).json({error: "User not found OR user not responsible for collection"});

            //Validando que o livro existe
            const existBookWithIDInDataBase = await this.bookService.getBookInDataBaseWithID(idBook);
            if (!existBookWithIDInDataBase) return res.status(404).json({ message: "Book with ID not found" });

            //Adicionando o livros aa coleção
            const addBookInCollection = await this.bookCollectionService.addtingBookInCollection(idCollection, idBook);
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

            //Validando que o id é válido
            if (!validate(idCollection) || !validate(idBook)) return res.status(400).json({ error: "Invalid ID format" });

            //Validandando que a coleção existe
            const existCollectionWithID = await this.collectionService.listDataFromCollection(idCollection);
            if (!existCollectionWithID.success) return res.status(existCollectionWithID.status).json({ message: existCollectionWithID.message });

            //Validando que o usuário existe e é o responsável pela a coleção
            const userExistWithID = await this.userService.getUserByID(idUser);
            const userIsResponsibleForCollection = await this.collectionService.getUserResponsibleForCollection(idCollection, idUser);
            if (!userExistWithID || !userIsResponsibleForCollection) return res.status(400).json({error: "User not found OR user not responsible for collection"});

            //Validando que o livro existe
            const existBookWithIDInDataBase = await this.bookService.getBookInDataBaseWithID(idBook);
            if (!existBookWithIDInDataBase) return res.status(404).json({ message: "Book with ID not found" });

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
}