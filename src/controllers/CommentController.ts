//Importações
import { Request, Response } from "express";

//Services
import { CommentService } from "../services/CommentService";
import { GoogleGeminiService } from "../services/GoogleGeminiServices";

//Validator
import { createCommentSchema } from "../validators/commentValidator";

//Class
export class CommentController {
    private commentService: CommentService;
    private geminiService: GoogleGeminiService;

    constructor () {
        this.commentService = new CommentService();
        this.geminiService = new GoogleGeminiService();
    };

    //Método para criar um comentário
    async creteCommentForPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação 
            const data = createCommentSchema.parse(req.body); //Pegando o conteúdo da mensagem

            //Validando conteúdo do comnetário
            const verifyContentCommentary = await this.geminiService.verifyTextPublication(data.content);
            if (!verifyContentCommentary.sucess) return res.status(400).json({message: verifyContentCommentary.message, description: verifyContentCommentary.description});

            //Enviando os dados
            const createData = await this.commentService.createComment(idPublication, idUser, data.content);
            if (!createData.success) return res.status(404).json({message: createData.message});

            //Retornando os dados
            return res.status(201).json({message: createData.message, data: createData.data});
        } catch (error) {
            console.error("Error create comment for publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };

    //Método para remover um comentário
    async removeCommentForPublication(req: Request, res: Response): Promise<Response> {
        try {
            const idUser = req.id_User; //Pegando o id do usuário
            const idPublication = req.params.idPublication; //Pegando o id da publicação
            const idComment = req.params.idComment; //Pegando o id do comentário

            //Enviando os dados
            const removeData = await this.commentService.removeComment(idPublication, idUser, idComment);
            if (!removeData.success) return res.status(400).json({message: removeData.message});

            //Retornando os dados
            return res.status(200).json({message: removeData.message});

        } catch (error) {
            console.error("Error create comment for publication: ", error);
            return res.status(500).json({ error: "Internal Server Error" });
        };
    };
}