//Importações
import { prisma } from "./prisma";

//Types

//Class
export class PublicationService {

    //Método para lsitar todas publicações realizadas recentemente
    async findAllLatestPublication () {
        const publications = await prisma.publication.findMany({
            orderBy:{createdAt: "desc"},
            include: {commentaries: true, likes: true}
        });

        return publications;
    };

    //Método para listar todas publicações realizadas por um usuário
    async findAllPublcationsOfUser (userId: string) {
        const publications = await prisma.publication.findMany({
            where: {userId},
            include: {commentaries: true, likes: true}
        });

        return publications;
    };

    //Método para listar dados de uma publicação em específico
    async findDataPublication (publicationId: string) {
        const data = await prisma.publication.findUnique({
            where: {id: publicationId},
            include: {commentaries: true, likes: true}
        });

        return data;
    };

    //Método para criar uma publicação
    async createPublication (userId: string, content: string) {
        try {
            const publication = await prisma.publication.create({
                data: {
                    content, userId,
                }
            });
    
            return {success: true, message: "Create publication", data: publication};
        } catch (error) {
            console.error("Error creating publicaiton: ", error);
            return {success: true, message: "Create publication"};
        }
    };

    //Método para editar uma publicação
    async updatePublication (publicationId: string, userId: string, content: string) {
        try {
            //Verificar se o usuário é o responsável por essa publicação
            const userIsResponsible = await this.verifyUserIsResponsibleForPublication(publicationId, userId);
            if (!userIsResponsible.success) return {success: userIsResponsible.success, message: userIsResponsible.message};

            //Realiza a atulização
            const publication = await prisma.publication.update({
                where: {id: publicationId},
                data: {content}
            });

            //Retorna o dado
            return {success: true, message: "Update publication", data: publication};
        
        } catch (error) {
            console.error("Error updating publicaiton: ", error);
            return {success: true, message: "Update publication"};
        }
    };

    // Método para atualizar a quantidade de curtidas de uma publicação
    async updateLikedPublication(publicationId: string, increment: boolean) {
        try {
            // Incrementa ou decrementa o contador de curtidas
            const updatedPublication = await prisma.publication.update({
                where: { id: publicationId },
                data: {
                    likesCount: increment ? { increment: 1 } : { decrement: 1 }
                }
            });

            return { success: true, message: "Publication like count updated", data: updatedPublication };
        
        } catch (error) {
            console.error("Error updating publication like count: ", error);
            return { success: false, message: "Error updating like count" };
        }
    };

    // Método para atualizar a quantidade de comentários de uma publicação
    async updateCommentCount(publicationId: string, increment: boolean) {
        try {
            // Incrementa ou decrementa o contador de comentários
            const updatedPublication = await prisma.publication.update({
                where: { id: publicationId },
                data: {
                    commentariesCount: increment ? { increment: 1 } : { decrement: 1 }
                }
            });

            return { success: true, message: "Publication comment count updated", data: updatedPublication };
        
        } catch (error) {
            console.error("Error updating publication comment count: ", error);
            return { success: false, message: "Error updating comment count" };
        }
    };

    //Método para remover uma publicação
    async removePublication (publicationId: string, userId: string) {
        try {
            //Verificar se o usuário é o responsável pela a requisição
            const userIsResponsible = await this.verifyUserIsResponsibleForPublication(publicationId, userId);
            if (!userIsResponsible.success) return {success: userIsResponsible.success, message: userIsResponsible.message};

            //Realizando a remoção
            await prisma.publication.delete({
                where: {id: publicationId}
            });

            //Retornar a mensagem
            return {success: true, message: "Remove publication"};
        } catch (error) {
            console.error("Error in creating publicaiton: ", error);
            return {success: true, message: "Create publication"};
        }
    }

    //Função auxiliar para verificar se o usuário é o responsável pela a publicação
    async verifyUserIsResponsibleForPublication (publicationId: string, userId: string) {
        //Procurando e obtendo a publicação
        const data = await this.findDataPublication(publicationId);
        if (!data) return {success: false, message: "Publication not found"};

        //Validar se o usuário é o responsavel pela a publicação
        if (data.userId !== userId) return {success: false, message: "User not responsible for publication"};

        //Retorna mensagem final
        return {success: true, message: "User is responsible"};
    };
};