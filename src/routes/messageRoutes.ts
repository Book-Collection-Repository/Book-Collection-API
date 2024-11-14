//Importações
import { Router } from "express";

//Controllers
import { MessageController } from "../controllers/MessageController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";

//Configurações
const messageRoutes = Router();
const messageController = new MessageController();

//Routes
messageRoutes.get("/:receiverId", authValidationToken, checkingUserExists, messageController.findAllMessagesForUser.bind(messageController));
messageRoutes.get("/", authValidationToken, checkingUserExists, messageController.findChatsRecents.bind(messageController));
messageRoutes.post("/:receiverId", authValidationToken, checkingUserExists, messageController.createMessages.bind(messageController));
messageRoutes.delete("/:idMessage", authValidationToken, checkingUserExists, messageController.removeMessages.bind(messageController));

//Export
export { messageRoutes };