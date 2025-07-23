//Importações
import { Request, Response } from "express";

//Services
import { LikeService } from "../services/LikeService";
import { PublicationService } from "../services/PublicationService";
import { createNotificationDTO } from "../types/NotificationTypes";
import { RealtimeServices } from "../services/RealtimeServices";

//Class
export class LikeController {
    private likeService: LikeService;
    private notificationService: RealtimeServices;
    private publicationService: PublicationService;

    constructor() {
        this.likeService = new LikeService();
        this.notificationService = new RealtimeServices();
        this.publicationService = new PublicationService();
    };
    
    //Requisição para realizar o like
    async setLikeForPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação 

            //Busacando publicação
            const publication = await this.publicationService.findDataPublication(idPublication);
            if (!publication) return res.status(404).json({ message: "Publication not found" });

            //Realizando like
            const createLike = await this.likeService.likedPublication(idPublication, idUser);
            if (!createLike.success) return res.status(404).json({ message: createLike.message });

            if (idUser !== publication.userId) {
                //Criando notificação
                const notification: createNotificationDTO = {
                    action: "SEE_PUBLICATION",
                    content: "liked your publication",
                    receiverId: publication.userId,
                    senderId: idUser,
                    publicationId: idPublication
                };
    
                //Enviando notificação
                await this.notificationService.createNotification(notification);
            }

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