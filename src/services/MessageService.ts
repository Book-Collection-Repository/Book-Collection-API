// Importações
import { prisma } from "./prisma";

//Types
import { CreateMessageDTO } from "../types/messageTypes";
import { ShippingStatus, ViewingStatus } from "@prisma/client";

//Class
export class MessageService {

    //Método para lista todas as mensagens enviadas para um determinado usuário
    async getMessageForUser(senderId: string, receiverId: string) {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId, receiverId },
                    { receiverId, senderId }
                ]
            },
            orderBy: { createdAt: 'asc' },
        });

        return messages
    };

    //Método para listar as conversa recentes
    async getUsersWithMessagesRecent(senderId: string) {
        const messages = await prisma.message.findMany({
            where: {senderId},
            orderBy: {createdAt: 'desc'},
            select: {
                receiverId: true,
                createdAt: true
            }
        });

        const uniqueMessages = new Map<string, { receiverId: string; createdAt: Date }>();
    messages.forEach((message) => {
        if (!uniqueMessages.has(message.receiverId)) {
            uniqueMessages.set(message.receiverId, message);
        }
    });

    // Converte o Map para um array de resultados
    return Array.from(uniqueMessages.values());
    };

    //Método para criar um mensagem
    async createMessageForUser(data:CreateMessageDTO) {
        try {
            if (data.senderId === data.receiverId) return { success: false, status: 400, message: "User cannot send themselves"}

            const message = await prisma.message.create({
                data: {
                    ... data,
                    viewing: 'UNSEEN', // Estado inicial de visualização
                    shippingStatus: 'PENDING' // Estado inicial de envio
                }
            });

            return {success: true, status: 201, message: message};
        } catch (error) {
            console.error("Error creating message: ", error);
            throw new Error("Failed to create message");
        }
    };

    //Método para atualizar o estado de envio da mensagem
    async updateStateShippingMessage(id: string, shipping: ShippingStatus) {
        try {
            const message = await prisma.message.update({
                where:{id},
                data: {
                    shippingStatus: shipping,
                },
            });
    
            return message;
        } catch (error) {
            console.error("Error updating message: ", error);
            throw new Error("Failed to create message");
        }
    };

    //Método para atualizar o estado de visibilidade da mensagem
    async updateStateViewingMessage(id: string, viewing: ViewingStatus) {
        try {
            const message = await prisma.message.update({
                where:{id},
                data: {
                    viewing,
                },
            });
    
            return message;
        } catch (error) {
            console.error("Error updating message: ", error);
            throw new Error("Failed to create message");
        }
    };

    //Método para validar que a mensagem é mesmo do usuário
    async verifyUserCreatorMessage(idUser:string, idMessage:string) {
        const message = await prisma.message.findUnique({
            where: {id: idMessage},
        });

        if (message?.senderId !== idUser) return {sucsess: false, status:400, message: "User not creator the message"};

        return {sucess: true, status:200, message: "User is the creator the message"};
    }

    //Método para deletar uma mensagem
    async removeMessageForUser(id: string) {
        try {
            await prisma.message.delete({
                where: { id }
            });

            return "Message removed";

        } catch (error) {
            console.error("Error removing message: ", error);
            throw new Error("Failed to create message");
        }
    };
}