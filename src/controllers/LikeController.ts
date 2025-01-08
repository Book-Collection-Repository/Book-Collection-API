//Importações
import { Request, Response } from "express";

//Services
import { LikeService } from "../services/LikeService";

//Class
export class LikeController {
    private likeService: LikeService;

    constructor() {
        this.likeService = new LikeService();
    };
    
    //Requisição para realizar o like
    async setLikeForPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação 

            //Realizando like
            const createLike = await this.likeService.likedPublication(idPublication, idUser);
            if (!createLike.success) return res.status(404).json({ message: createLike.message });

            //Retornando os dados
            return res.status(201).json({ message: createLike.message, data: createLike.data });

        } catch (error) {
            console.error("Error liked publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Requisição para relizar o deslike
    async setDeslikeForPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação 

            //Realizando like
            const removeLike = await this.likeService.deslikedPublication(idPublication, idUser);
            if (!removeLike.success) return res.status(404).json({ message: removeLike.message });

            //Retornando os dados
            return res.status(200).json({ message: removeLike.message });

        } catch (error) {
            console.error("Error liked publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

};