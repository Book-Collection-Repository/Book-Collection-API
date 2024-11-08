// Importações
import { Request, Response } from "express";
import { validate } from "uuid";
import { ZodError } from "zod";

//Service
import { MessageService } from "../services/MessageService";
import { UserService } from "../services/UserService";

//Validações
import { createMessageSchema } from "../validators/messageValidator";

// Redis
import { redis } from "../connection/redisClient";

//Utils
import { handleZodError } from "../utils/errorHandler";

//Class
export class MessageController {

    private messageService: MessageService;
    private userService: UserService;

    constructor() {
        this.messageService = new MessageService();
        this.userService = new UserService();
    };

    //Método para listar todas as mensagens de um usuário
    async findAllMessagesForUser(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const receiverId = req.params.receiverId;

            //Valida que o id do paramento é valido            
            if (!validate(receiverId)) return res.status(400).json({ error: "Invalid ID format" });

            //Validando que o usuário existe
            const reciverExistWithID = await this.userService.getUserByID(receiverId);
            if (!reciverExistWithID) return res.status(404).json({ error: "Reciver with ID not found" });

            //Pesquisa menssagens
            const messages = await this.messageService.getMessageForUser(idUser, receiverId);

            return res.status(200).json({ allMessages: messages });

        } catch (error) {
            console.error("Error return message: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para listar as conversas recentes
    async findChatsRecents(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;

            //Validando que o usuário existe
            const allMessages = await this.messageService.getUsersWithMessagesRecent(idUser);

            return res.status(200).json({allMessages: allMessages});

        } catch (error) {
            console.error("Error return message: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para criar e enviar mensagens
    async createMessages(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const { content } = createMessageSchema.parse(req.body);
            const receiverId = req.params.receiverId;

            //Validando que o usuário existe
            const reciverExistWithID = await this.userService.getUserByID(receiverId);
            if (!reciverExistWithID) return res.status(404).json({ error: "Reciver with ID not found" });

            //Criando mensagem
            const message = await this.messageService.createMessageForUser({ content, receiverId, senderId: idUser });  
            if (!message.success) return res.status(message.status).json({error: message.message});

            return res.status(message.status).json({ message: "Create message", contentMessage: message.message });

        } catch (error) {
            // Verificar se o erro é de validação do Zod
            if (error instanceof ZodError) {
                return handleZodError(error, res); // Usando a função de tratamento de erros
            }
            console.error("Error return message: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    //Método para deletar mensagens
    async removeMessages(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User;
            const idMessage = req.params.idMessage;

            if (!validate(idMessage)) return res.status(400).json({error: "Invalida ID format"});

            //Valdiando que o usuário é o responsável pela mensagem
            const userIsCreatorTheMessage = await this.messageService.verifyUserCreatorMessage(idUser, idMessage);
            if (!userIsCreatorTheMessage.sucess) return res.status(userIsCreatorTheMessage.status).json({error: userIsCreatorTheMessage.message});

            //Deletando mensagem
            const removedMessage = await this.messageService.removeMessageForUser(idMessage);
            
            return res.status(200).json({message: removedMessage});

        } catch (error) {
            console.error("Error return message: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}