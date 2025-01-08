//Importações
import { prisma } from "./prisma";

//Services
import { PublicationService } from "./PublicationService";

//Class
export class CommentService {
    private publicationService: PublicationService;

    constructor () {
        this.publicationService = new PublicationService();
    };

    //Método para listar todos os comentários de um publicação

    //Método para listar dado de um comentário
    async findDataComment (commentId: string) {
        const data = await prisma.comment.findUnique({
            where: {id: commentId}
        });

        return data;
    };

    //Método para criar um comentário
    async createComment (publicationId: string, userId: string, content: string) {
        try {
            //Criando comentário
            const comment = await prisma.comment.create({
                data:{content, userId, publicationId},
                include: {
                    user: true,
                }
            });
      
            //Atualiza a quantidade de comentário da publicação
            await this.publicationService.updateCommentCount(publicationId, true);

            return {success: true, messsage: "Creating publication comment", data: comment};
      
        } catch (error) {
            console.error("Error creating publication comment: ", error);
            return { success: false, message: "Error creating comment" };
        }
    };

    //Método para remover um comentário
    async removeComment (publicationId: string, userId: string, commentId: string) {
        try {
            //Verifica se o comentário existe
            const dataComment = await this.findDataComment(commentId);
            if (!dataComment) return {success: false, message: "Comment not found"};
      
            //Verificando se o usuário passado é o responsável pelo o comentário ou publicação
            const isOwner = await this.isCommentOrPublicationOwner(commentId, publicationId, userId);
            if (!isOwner) return { success: false, message: "User is not authorized to remove this comment" };

            //Deletanto comentário
            const comment = await prisma.comment.delete({
                where: {id: commentId}
            });
      
            //Atualiza a quantidade de comentário da publicação
            await this.publicationService.updateCommentCount(publicationId, false);

            return {success: true, message: "Removing publication comment", data: comment};
      
        } catch (error) {
            console.error("Error removing publication comment: ", error);
            return { success: false, message: "Error removing comment" };
        }
    };

    //Função auxiliar para garantir que somente o responsável pelo o perfil e o dono do comentário possam remover
    private async isCommentOrPublicationOwner(commentId: string, publicationId: string, userId: string): Promise<boolean> {
        // Verifica se o usuário é dono do comentário
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true }
        });

        // Se o usuário é dono do comentário, retorna true
        if (comment && comment.userId === userId) return true;

        // Caso contrário, verifica se o usuário é dono da publicação
        const userIsResponsibleForPublication = await this.publicationService.verifyUserIsResponsibleForPublication(publicationId, userId);
        return userIsResponsibleForPublication.success;
    };
};