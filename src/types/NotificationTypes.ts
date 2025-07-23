//Importando
import { ActionNotification } from "@prisma/client";

//Type default
export interface Notification {
    id: string;
    content: string;
    receiverId: string;
    senderId: string;
    action: ActionNotification;
    chatId?: string;
    publicationId?: string;
    createdAt: string,
};

//Tipo para criar um notificação
export type createNotificationDTO = Omit<Notification, "id" | "createdAt">