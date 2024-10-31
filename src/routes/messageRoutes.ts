//Importações
import { Router } from "express";

//Controllers
import { MessageController } from "../controllers/MessageController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";

//Configurações
const messageRoutes = Router();
const messageController = new MessageController();

//Routes
messageRoutes.get("/:receiverId", authValidationToken, messageController.findAllMessagesForUser.bind(messageController));
messageRoutes.get("/", authValidationToken, messageController.findChatsRecents.bind(messageController));
messageRoutes.post("/:receiverId", authValidationToken, messageController.createMessages.bind(messageController));
messageRoutes.delete("/:idMessage", authValidationToken, messageController.removeMessages.bind(messageController));

//Export
export { messageRoutes };