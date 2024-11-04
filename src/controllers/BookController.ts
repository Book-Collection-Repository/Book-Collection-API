//Importações
import { Request, Response } from "express";

//Services
import { BookService } from "../services/BookService";

//Class
export class BookController {
    private bookService: BookService;

    constructor() {
        this.bookService = new BookService();
    }

    //Método para listar livros do banco de dados por título
    async getBooksInDataBaseForTitle(req: Request, res: Response): Promise<Response> {
        try {
            const title = req.params.title;

            const getBooks = await this.bookService.searchBooksInDataBaseForTitle(title);

            if (!getBooks) return res.status(404).json({ message: "Book not found" });

            return res.status(200).json({ message: getBooks });

        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar livros do banco de dados por ISBN
    async getBooksInDataBaseForISBN(req: Request, res: Response): Promise<Response> {
        try {
            const isbn = req.params.isbn;

            const getBooks = await this.bookService.searchBookInExternalApiForId(isbn);

            if (!getBooks) return res.status(404).json({ message: "Book not found" });

            return res.status(200).json({ message: getBooks });
        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar livros da API externa pesquisados por título
    async getBooksInExternalApiForTitle(req: Request, res: Response): Promise<Response> {
        try {
            const title = req.params.title; //Pegando título

            //Fazendo e validando a resposta da pesquisa
            const getBooks = await this.bookService.searchBookInExternalApiForTitle(title);
            if (!getBooks.success || getBooks.data === null) return res.status(404).json({ message: getBooks.message });

            //Retornando
            return res.status(200).json({ message: getBooks });
        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar livros da API externa pesquisado por ISBN
    async getBooksInExternalApiForISBN(req: Request, res: Response): Promise<Response> {
        try {
            const isbn = req.params.isbn; //Pegando o identificador

            //Realizando e validando a busca
            const getBooks = await this.bookService.searchBookInExternalApiForISBN(isbn);
            if (!getBooks.success) return res.status(404).json({ message: getBooks.message });

            //Retornando resposta
            return res.status(200).json({ message: getBooks });
        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar livros da API externa pesquisado por Gênero
    async getBooksInExternalApiForGenre(req: Request, res: Response): Promise<Response> {
        try {
            const genre = req.params.genre; //Busanco por gênero

            //Realizando e validando a pesquisa
            const getBooks = await this.bookService.searchBookInExternalApiForGenre(genre);
            if (!getBooks.success) return res.status(404).json({ message: getBooks.message });

            //Retornando
            return res.status(200).json({ message: getBooks });
        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Métoso para listar livro da API externa pesquisado por Autor
    async getBooksInExternalApiForAuthor(req: Request, res: Response): Promise<Response> {
        try {
            const author = req.params.author; //Buscando autor

            //Realizando e validando a pesquisa
            const getBooks = await this.bookService.searchBookInExternalApiForAuthor(author);
            if (!getBooks.success) return res.status(404).json({ message: getBooks.message });

            //Retornando
            return res.status(200).json({ message: getBooks });
        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para adicionar livro ao banco de dados
    async addtingBookInDataBase(req: Request, res: Response): Promise<Response> {
        try {
            const idBook = req.params.idBook;//Pegando o ISBN

            //Validando que o livro jão não fora criado
            const bookExistInDataBase = await this.bookService.getBookInDataBaseWithExternalID(idBook);
            if (bookExistInDataBase) return res.status(400).json({ message: "Book exists in database" });

            //Busca o livro na API externa
            const externalBookResponse = await this.bookService.searchBookInExternalApiForId(idBook);
            if (!externalBookResponse.success || externalBookResponse.data === null) return res.status(404).json({ message: externalBookResponse.message });

            // Adicionar livro ao banco de dados
            const createBook = await this.bookService.addtingBookInDataBase(externalBookResponse.data);
            return res.status(201).json({ message: "Book added to database", book: createBook });

        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para deletar livro do banco de dados
    async removeBookInDataBase(req: Request, res: Response): Promise<Response> {
        try {
            const idBook = req.params.id;

            //Validando que o livro existe
            const existBookWithID = await this.bookService.getBookInDataBaseWithID(idBook);
            if (!existBookWithID) return res.status(404).json({ message: "Book With ID not exist" });

            await this.bookService.removingBookInDataBase(idBook);

            return res.status(200).json({ message: "Book removing in database" });

        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}