//Importações
import { Request, Response, NextFunction } from "express";
import { validate } from "uuid";

//Services
import { BookService } from "../services/BookService";

//Middleware
export async function checkingBookExists(req: Request, res: Response, next: NextFunction) {
    const bookService = new BookService(); //Serviços do livro
    const idBook = req.params.idBook; //Pegando o id do livro

    try {
        //Verificando se o id do livro foi fornecido
        if (!idBook || idBook === undefined || idBook === null) return res.status(401).json({ message: "ID of book not informed" });

        //Validando que o id é válido
        if (!validate(idBook)) return res.status(401).json({ message: "Invalid format ID" });

        //Pesquisando e validando que o livro existe
        const dataBook = await bookService.getBookInDataBaseWithID(idBook);
        if (!dataBook) return res.status(404).json({message: "Book not found"});

        //Seguindo para próxima função
        next();

    } catch (error) {
        console.error("Error checking book existence:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};