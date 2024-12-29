//Importações
import { Request, Response } from "express";
import { validate } from "uuid";
import { ZodError } from "zod";

//Services
import { AvaliationService } from "../services/AvaliationsService";
import { BookCollectionService } from "../services/BookCollectionService";

//Types
import { CreateAvalaitonDTO } from "../types/AvaliationTypes";

//Validator
import { createAvaliationSchema } from "../validators/avaliationValidator";

//Utils
import { handleZodError } from "../utils/errorHandler";
import { UserService } from "../services/UserService";
import { GoogleGeminiService } from "../services/GoogleGeminiServices";

//Class
export class AvaliationController {
    private avaliationService: AvaliationService
    private userService: UserService;
    private bookCollectionService: BookCollectionService;
    private geminiServices: GoogleGeminiService;

    constructor() {
        this.avaliationService = new AvaliationService();
        this.userService = new UserService();
        this.bookCollectionService = new BookCollectionService();
        this.geminiServices = new GoogleGeminiService();
    };

    //Requisição para listar as avaliações de um livro
    async getListAvaliationsOfBook(req: Request, res: Response): Promise<Response> {
        try {
            const idBook = req.params.idBook; //Pegando o id do livro

            //Buscando avaliações do livro
            const avaliations = await this.avaliationService.findAvaliationsOfBook(idBook);
            if (avaliations.length <= 0) return res.status(200).json({ message: "Book not have avaliations" });

            return res.status(200).json({ message: "Book have some avaliations", avaliations });
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para listar as avaliações de um usuário por token
    async getListAvaliationsOfUserForToken(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;

            //Buscando avaliações feitas pelo usuário
            const avaliations = await this.avaliationService.findAvaliationsOfUser(idUser);
            if (avaliations.length <= 0) return res.status(200).json({ message: "User has no reviews" });

            return res.status(200).json({ message: "User has some reviews", avaliations });
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para listar as avaliações de um usuário
    async getListAvaliationsOfUser(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.params.idUser; //Pegando o id do usuário

            //Verificando que o id foi passado
            if (!idUser || idUser === undefined || idUser === null) return res.status(401).json({ message: "ID of user not informed" });
            if (!validate(idUser)) return res.status(400).json({ message: "Invalid format ID" });

            // Verificando se o usuário existe
            const authUser = await this.userService.getUserByID(idUser);
            if (!authUser) return res.status(404).json({ message: "User not found" });

            //Buscando avaliações feitas pelo usuário
            const avaliations = await this.avaliationService.findAvaliationsOfUser(idUser);
            if (avaliations.length <= 0) return res.status(200).json({ message: "User has no reviews", avaliations });

            return res.status(200).json({ message: "User has some reviews", avaliations });
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisilão para pesquisar uma avaliação de um livro
    async getDataAvaliation(req: Request, res: Response): Promise<Response> {
        try {
            const idAvaliation = req.params.idAvaliation;

            //Validando que o id foi passado
            if (!idAvaliation || idAvaliation === undefined) return res.status(404).json({ message: "ID not found" });
            if (!validate(idAvaliation)) return res.status(404).json({ message: "Invalid ID format" });

            //Pesquisando a avaliação
            const avaliation = await this.avaliationService.findAvaliaiton(idAvaliation);
            if (!avaliation) return res.status(404).json({ message: "Avaliation not found" });

            return res.status(200).json({ message: "Avalition encontred", avaliation });
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };

    };

    //Requisição para criar uma avaliação de um livro
    async createAvaliationsOfBook(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idBook = req.params.idBook;
            const avaliation: CreateAvalaitonDTO = createAvaliationSchema.parse(req.body);

            //Validando que o usuário ainda não tenha avaliado esse livro
            const userAvaliableBook = await this.avaliationService.userAvaliableBook(idBook, idUser);
            if (userAvaliableBook) return res.status(400).json({ message: "This book has already been rated by the user" });

            //Validando que a avaliação não é de cunho preconceituoso
            const verifyTextPublication = await this.geminiServices.verifyTextPublication(avaliation.content);
            if (!verifyTextPublication.sucess) return res.status(400).json({message: verifyTextPublication.message, description: verifyTextPublication.description});

            //Criando avaliação
            const createAvaliation = await this.avaliationService.createAvaliationForBook({ ...avaliation, userId: idUser, bookId: idBook });
            if (!createAvaliation.success) return res.status(400).json({ message: createAvaliation.message });

            //Adicionando o livro na coleção de livros avaliados
            const addtingBookInCollection = await this.bookCollectionService.addtingBookInDefaultCollection(idBook, idUser, "REVIEWED");
            if (!addtingBookInCollection.success && addtingBookInCollection.status !== undefined) return res.status(addtingBookInCollection.status).json({ message: addtingBookInCollection.message });

            //Retornando a avaliação
            return res.status(200).json({ message: createAvaliation.message, data: createAvaliation.data });

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
    async updatedAvaliationsOfBook(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idAvaliation = req.params.idAvaliation;
            const avaliation: CreateAvalaitonDTO = createAvaliationSchema.parse(req.body);

            //Validando que o id é válido
            if (!validate(idAvaliation)) return res.status(404).json({ message: "Invalid ID format" });

            //Validando que a avaliação existe
            const avaliationExistWithID = await this.avaliationService.findAvaliaiton(idAvaliation);
            if (!avaliationExistWithID) return res.status(404).json({ message: "Avaliation not found" });

            //Validando que a avaliação não é de cunho preconceituoso
            const verifyTextPublication = await this.geminiServices.verifyTextPublication(avaliation.content);
            if (!verifyTextPublication.sucess) return res.status(400).json({message: verifyTextPublication.message, description: verifyTextPublication.description});

            //Editando a avaliação
            const updateAvaliation = await this.avaliationService.updateAvaliationOfBook(idAvaliation, idUser, avaliation);
            if (!updateAvaliation.success) return res.status(400).json({ message: updateAvaliation.message })

            return res.status(200).json({ message: updateAvaliation.message, data: updateAvaliation.data });
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
    async deleteAvaliationsOfBook(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idAvaliation = req.params.idAvaliation;

            //Validando que o id é válido
            if (!validate(idAvaliation)) return res.status(404).json({ message: "Invalid ID format" });

            //Validando que a avaliação existe
            const avaliationExistWithID = await this.avaliationService.findAvaliaiton(idAvaliation);
            if (!avaliationExistWithID) return res.status(404).json({ message: "Avaliation not found" });

            //Removendo avaliação
            const removeAvaliation = await this.avaliationService.removeAvaliationOfBook(idAvaliation, idUser);
            if (!removeAvaliation.success) return res.status(400).json({ message: removeAvaliation.message });

            return res.status(200).json({ message: removeAvaliation.message });
        } catch (error) {
            console.error("Error return avaliation: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

};