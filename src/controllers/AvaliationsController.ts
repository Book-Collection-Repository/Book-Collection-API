//Importações
import { Request, Response } from "express";
import { validate } from "uuid";
import { ZodError } from "zod";

//Services
import { AvaliationService } from "../services/AvaliationsService";
import { UserService } from "../services/UserService";
import { BookService } from "../services/BookService";

//Types
import { CreateAvalaitonDTO } from "../types/AvaliationTypes";

//Validator
import { createAvaliationSchema } from "../validators/avaliationValidator";

//Utils
import { handleZodError } from "../utils/errorHandler";

//Class
export class AvaliationController {
    private avaliationService: AvaliationService;
    private userService: UserService;
    private bookService: BookService;

    constructor () {
        this.avaliationService = new AvaliationService();
        this.userService = new UserService();
        this.bookService = new BookService();
    };

    //Requisição para listar as avaliações de um livro
    async getListAvaliationsOfBook (req: Request, res: Response): Promise<Response> {
        try {
            const idBook = req.params.idBook; //Pegando o id do livro

            //Validando que o id foi passado
            if (!idBook || idBook === undefined) return res.status(404).json({message: "Book ID not exist"});
            if (!validate(idBook)) return res.status(404).json({message: "Invalid ID format"});

            //Validando que o livro existe no banco de dados
            const bookExistWithId = await this.bookService.getBookInDataBaseWithID(idBook);
            if (!bookExistWithId) return res.status(404).json({message: "Book not found"});

            //Buscando avaliações do livro
            const avaliations = await this.avaliationService.findAvaliationsOfBook(idBook);
            if(avaliations.length < 0) return res.status(400).json({message: "Book not have avaliations"});

            return res.status(200).json({message: "Book have some avaliations", avaliations});
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });            
        };
    };

    //Requisilão para pesquisar uma avaliação de um livro
    async getDataAvaliation (req: Request, res: Response): Promise<Response> {
        try {
            const idAvaliation = req.params.idAvaliation;

            //Validando que o id foi passado
            if (!idAvaliation || idAvaliation === undefined) return res.status(404).json({message: "ID not found"});
            if (!validate(idAvaliation)) return res.status(404).json({message: "Invalid ID format"});

            //Pesquisando a avaliação
            const avaliation = await this.avaliationService.findAvaliaiton(idAvaliation);
            if (!avaliation) return res.status(404).json({message: "Avaliation not found"});

            return res.status(200).json({message: "Avalition encontred", avaliation});
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });            
        };
    
    };

    //Requisição para criar uma avaliação de um livro
    async createAvaliationsOfBook (req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idBook = req.params.idBook;
            const avaliation: CreateAvalaitonDTO = createAvaliationSchema.parse(req.body);

            //Validando que o id foi passado
            if (!idBook || idBook === undefined) return res.status(404).json({message: "Book ID not exist"});
            if (!validate(idBook)) return res.status(404).json({message: "Invalid ID format"});

            //Validando que o livro existe no banco de dados
            const bookExistWithId = await this.bookService.getBookInDataBaseWithID(idBook);
            if (!bookExistWithId) return res.status(404).json({message: "Book not found"});

            //Validando que o usuário existe
            const userExistWithID = await this.userService.getUserByID(idUser);
            if (!userExistWithID) return res.status(404).json({message: "User not found"});

            //Validando que o usuário ainda não tenha avaliado esse livro
            const userAvaliableBook = await this.avaliationService.userAvaliableBook(idBook, idUser);
            if (userAvaliableBook) return res.status(400).json({message: "This book has already been rated by the user"});

            //Criando avaliação
            const createAvaliation = await this.avaliationService.createAvaliationForBook({...avaliation, userId: idUser, bookId: idBook});
            if (!createAvaliation.success) return res.status(400).json({message: createAvaliation.message});

            //Retornando a avaliação
            return res.status(200).json({message: createAvaliation.message, data: createAvaliation.data});
        
        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }
            
            console.error("Error create avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });            
        };
    };

    //Requisição para editar uma avaliação de um livro
    async updatedAvaliationsOfBook (req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idAvaliation = req.params.idAvaliation;
            const avaliation: CreateAvalaitonDTO = createAvaliationSchema.parse(req.body);

            //Validando que o id é válido
            if (!validate(idAvaliation)) return res.status(404).json({message: "Invalid ID format"});
            
            //Validando que o usuário existe
            const userExistWithID = await this.userService.getUserByID(idUser);
            if (!userExistWithID) return res.status(404).json({message: "User not found"});
            
            //Validando que a avaliação existe
            const avaliationExistWithID = await this.avaliationService.findAvaliaiton(idAvaliation);
            if (!avaliationExistWithID) return res.status(404).json({message: "Avaliation not found"});

            //Editando a avaliação
            const updateAvaliation = await this.avaliationService.updateAvaliationOfBook(idAvaliation, idUser, avaliation);
            if (!updateAvaliation.success) return res.status(400).json({message: updateAvaliation.message})

            return res.status(200).json({message: updateAvaliation.message, data: updateAvaliation.data});
        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }

            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });            
        };
    };

    //Requisição para deletar uma avaliação de um livro
    async deleteAvaliationsOfBook (req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idAvaliation = req.params.idAvaliation;

            //Validando que o id é válido
            if (!validate(idAvaliation)) return res.status(404).json({message: "Invalid ID format"});
            
            //Validando que o usuário existe
            const userExistWithID = await this.userService.getUserByID(idUser);
            if (!userExistWithID) return res.status(404).json({message: "User not found"});
            
            //Validando que a avaliação existe
            const avaliationExistWithID = await this.avaliationService.findAvaliaiton(idAvaliation);
            if (!avaliationExistWithID) return res.status(404).json({message: "Avaliation not found"});

            //Removendo avaliação
            const removeAvaliation = await this.avaliationService.removeAvaliationOfBook(idAvaliation, idUser);
            if (!removeAvaliation.success) return res.status(400).json({message: removeAvaliation.message});

            return res.status(200).json({message: removeAvaliation.message});
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });            
        };
    };

};