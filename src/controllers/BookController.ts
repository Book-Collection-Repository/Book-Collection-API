//Importações
import { Request, Response } from "express";

//Services
import { BookService } from "../services/BookService";
import { GoogleGeminiService } from "../services/GoogleGeminiServices";

//Class
export class BookController {
    private bookService: BookService;
    private geminiService: GoogleGeminiService;

    constructor() {
        this.bookService = new BookService();
        this.geminiService = new GoogleGeminiService();
    };

    //Método para listar livros para pesquisa aleatória
    async getListBooksRandom(req: Request, res: Response): Promise<Response>{
        try {
            
            const data = await this.bookService.getListRandomBooksForGenres();

            //Retornando lista
            return res.status(200).json({message: "List of books random", data: data.message});

        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar livros do banco de dados por título
    async getBooksInDataBaseForTitle(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando atributo
            const title = req.params.title;
            if (!title || title === null || title === undefined) return res.status(400).json({error: "Title not found"});

            //Buscando título no banco de dados
            const getBooks = await this.bookService.searchBooksInDataBaseForTitle(title);
            if (!getBooks) return res.status(404).json({ message: "Book not found" });

            //Retornando respostas
            return res.status(200).json({ message: getBooks });

        } catch (error) {
            console.error("Error return book: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar livros do banco de dados por ISBN
    async getBooksInDataBaseForISBN(req: Request, res: Response): Promise<Response> {
        try {
            const isbn = req.params.isbn; //Pegando ISBN
            if (!isbn || isbn === null || isbn === undefined) return res.status(400).json({error: "ISBN not found"});

            //Buscando livro no banco de dados
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
            if (!title || title === null || title === undefined) return res.status(400).json({error: "Title not found"});

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
            if (!isbn || isbn === null || isbn === undefined) return res.status(400).json({error: "ISBN not found"});

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
            if (!genre || genre === null || genre === undefined) return res.status(400).json({error: "genre not found"});

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
            if (!author || author === null || author === undefined) return res.status(400).json({error: "Author not found"});

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