//Importações
import { ShippingStatus, ViewingStatus } from "@prisma/client";

//Definindo interface
export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    viewing: ViewingStatus;
    shippingStatus: ShippingStatus;
    createdAt: Date;
}

//Criando tipo que será usado nas requisições
export type CreateMessageDTO = Omit<Message, 'id' | 'viewing' | 'shippingStatus' |'createdAt'>