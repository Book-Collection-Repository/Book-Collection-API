//Importações
import { prisma } from "./prisma";

//Services
import { PublicationService } from "./PublicationService";

//Class
export class LikeService {
    private publicationService: PublicationService;

    constructor () {
        this.publicationService = new PublicationService();
    };

    //Método para realizar o like
    async likedPublication (publicationId: string, userId: string) {
        try {
            // Verifica se o usuário já curtiu a publicação
            const alreadyLiked = await this.userLikedThisPublication(publicationId, userId);
            if (alreadyLiked.success) return { success: false, message: "User already liked this publication" };

            //Criando like
            const like = await prisma.like.create({
                data: {publicationId, userId},
            });

            //Atualiza curtida da publicação
            await this.publicationService.updateLikedPublication(publicationId, true);

            //Retorna o dado
            return {success: true, message: "Like publication", data: like};
        
        } catch (error) {
            console.error("Error relized like: ", error);
            return {success: true, message: "Update publication"};
        }
    };

    //Método para realizar o deslike
    async deslikedPublication (publicationId: string, userId: string) {
        try {
            //Criando like
            await prisma.like.delete({
                where: {publicationId_userId: {publicationId, userId}}
            });

            //Atualiza curtida da publicação
            await this.publicationService.updateLikedPublication(publicationId, false);

            //Retorna o dado
            return {success: true, message: "Publication deslike"};
        
        } catch (error) {
            console.error("Error relized like: ", error);
            return {success: true, message: "Update publication"};
        }
    };

    //Função auxiliar para verificar se um usuáiro já curtiu uma publicação
    private async userLikedThisPublication (publicationId: string, userId: string) {
        try {
            // Verifica se o usuário já curtiu a publicação
            const like = await prisma.like.findUnique({
                where: { publicationId_userId: { publicationId, userId } }
            });

            // Se encontrar um registro, significa que o usuário já curtiu
            if (like) {
                return { success: true, message: "User already liked" };
            }

            // Caso contrário, o usuário ainda não curtiu a publicação
            return { success: false, message: "User not liked" };
        
        } catch (error) {
            console.error("Error checking like status: ", error);
            return { success: false, message: "Error checking like status" };
        }
    };
};