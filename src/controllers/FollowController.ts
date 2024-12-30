//Importações
import { Request, Response } from "express";
import { validate } from "uuid";

//Service
import { FollowService } from "../services/FollowService";
import { UserService } from "../services/UserService";

//Class
export class FollowController {
    private followService: FollowService;
    private userService: UserService;

    constructor() {
        this.followService = new FollowService();
        this.userService = new UserService();
    }

    //Lista seguidores de um usuário A
    async getListFollowers(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando o id do usuário
            const userId = req.params.idUser;

            //Verificando se o id do usuário foi fornecido
            if (!userId || userId === undefined || userId === null) return res.status(401).json({ message: "ID of user not informed" });

            // Validando que o ID é um UUID válido
            if (!validate(userId)) return res.status(400).json({ message: "Invalid format ID" });

            //Buscando seguidores
            const followers = await this.followService.getUsersFollowerByUser(userId);

            return res.status(200).json({ allFollowers: followers });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return follow user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Listar seguindo de um usuário A
    async getListFollowing(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando o id do usuário
            const userId = req.params.idUser;

            //Verificando se o id do usuário foi fornecido
            if (!userId || userId === undefined || userId === null) return res.status(401).json({ message: "ID of user not informed" });

            // Validando que o ID é um UUID válido
            if (!validate(userId)) return res.status(400).json({ message: "Invalid format ID" });

            //Buscando seguidores
            const followeds = await this.followService.getUsersFollowedByUser(userId);

            return res.status(200).json({ allFollowed: followeds });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return follow user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Criando uma relação de seguindo
    async createFollowUsers(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando o id do usuário inicial (responsável por realizar o contato)
            const idUser = req.id_User;
            const idUserFollowed = req.params.idFriend;

            //Validando que o usuário existe
            if (!validate(idUserFollowed) || idUserFollowed === null || idUserFollowed === undefined) return res.status(400).json({ error: "Invalid ID format" });
            const userExistWithID = await this.userService.getUserByID(idUserFollowed);
            if (!userExistWithID) return res.status(404).json({ error: "User with ID not found" });

            //Criando a relação entre eles
            const createFollowRelation = await this.followService.followUser(idUser, idUserFollowed);
            if (!createFollowRelation.success) return res.status(createFollowRelation.status).json({ error: createFollowRelation.message });

            return res.status(createFollowRelation.status).json({ message: `User ${idUser} following ${idUserFollowed} sucessesful`, info: createFollowRelation.message, followed: createFollowRelation.followRelation });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return follow user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Deletando a relação de seguindo
    async removeFollowUsers(req: Request, res: Response): Promise<Response> {
        try {
            //Pegando o id do usuário inicial (responsável por realizar o contato)
            const idUser = req.id_User;
            const idUserFollowed = req.params.idFriend;

            //Validando que o usuário existe
            if (!validate(idUserFollowed) || idUserFollowed === null || idUserFollowed === undefined) return res.status(400).json({ error: "Invalid ID format" });
            const userExistWithID = await this.userService.getUserByID(idUserFollowed);
            if (!userExistWithID) return res.status(404).json({ error: "User with ID not found" });

            //Removendo a relação
            const removeFollowRelation = await this.followService.unfollowUser(idUser, idUserFollowed);
            if (!removeFollowRelation.success) return res.status(removeFollowRelation.status).json({ error: removeFollowRelation.message })

            return res.status(removeFollowRelation.status).json({ message: `User ${idUser} unfollowing ${idUserFollowed} sucessesful`, follow: removeFollowRelation.message });

        } catch (error) {
            // Caso seja um erro desconhecido, retornar erro genérico
            console.error("Error return unfollow user: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
};