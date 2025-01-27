//Importações
import { Request, Response } from "express";

//Services
import { RedisClientService } from "../services/RedisClientService";

//Class
export class RedisClientController {
    private redisClientService: RedisClientService;

    constructor() {
        this.redisClientService = new RedisClientService();
    };

    //Requisição para listar gêneros preferidos por coleção de usuário
    async getPreferredGenresForCollection(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando indentificadores
            const userId = req.id_User;
            const collectionId = req.params.idCollection;

            //Buscando dados
            const dataPreferredGenres = await this.redisClientService.getUserPreferredGenresForCollections(userId, collectionId);
            if (!dataPreferredGenres) return res.status(404).json({ message: "Preferred genre not found" });

            return res.status(200).json({ message: "Preferred genres found", preferred: dataPreferredGenres });
        } catch (error) {
            console.error("Error return preferred genres: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para listar autores preferidos por coleção de usuário
    async getPreferredAuthorsForCollection(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando indentificadores
            const userId = req.id_User;
            const collectionId = req.params.idCollection;

            //Buscando dados
            const dataPreferredAuthors = await this.redisClientService.getUserPreferredAuthorsForCollections(userId, collectionId);
            if (!dataPreferredAuthors) return res.status(404).json({ message: "Preferred authors not found" });

            return res.status(200).json({ message: "Preferred authors found", preferred: dataPreferredAuthors });
        } catch (error) {
            console.error("Error return preferred authors: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para listar gêneros preferidos de usuário
    async getPreferredAllGenres(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando indentificadores
            const userId = req.id_User;

            //Buscando dados
            const dataPreferredGenres = await this.redisClientService.getUserPreferredAllGenres(userId);
            if (!dataPreferredGenres) return res.status(404).json({ message: "Preferred genre not found" });

            return res.status(200).json({ message: "Preferred genres found", preferred: dataPreferredGenres });
        } catch (error) {
            console.error("Error return preferred genres: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Requisição para salvar gêneros preferidos de um usuário
    async postPreferredAllGenres(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando indentificadores
            const userId = req.id_User;
            const { genres } = req.body;

            // Validações
            if (!genres || !Array.isArray(genres) || genres.length === 0) return res.status(400).json({ message: "Genres must be a non-empty array." });
            if (!genres.every((genre: any) => typeof genre === "string")) return res.status(400).json({ message: "All genres must be strings." });

            //Salvando dados
            await this.redisClientService.saveUserPreferredAllGenres(userId, genres);

            return res.status(200).json({ message: "Preferred genres salved" });
        } catch (error) {
            console.error("Error return preferred genres: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
};