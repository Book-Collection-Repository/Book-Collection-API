//Importações
import axios from "axios";
import { ApiRealTime } from "../connection/realtimeClient";

//Types
import { createNotificationDTO } from "../types/NotificationTypes";

//Class
export class RealtimeServices {
    //Método para criar uma message
    async createNotification (data: createNotificationDTO) {
        try {
            await ApiRealTime.post("/notification", {notification: data });
        } catch (error) {
            console.error("Error in creating notification: ", error);
            throw new Error("Error in creating notification");
        }
    }
};