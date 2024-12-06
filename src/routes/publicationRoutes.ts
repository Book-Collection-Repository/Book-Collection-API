//Importações
import { Router } from "express";

//Services
import { PublicationController } from "../controllers/PublicationController";
import { CommentController } from "../controllers/CommentController";
import { LikeController } from "../controllers/LikeController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";
import { checkingPublicationExists } from "../middleware/checkingPublicationExists";

//Configurações
const publicationRoutes = Router();
const publicationController = new PublicationController();
const commentController = new CommentController();
const likeController = new LikeController();

//Routes
publicationRoutes.get("/", publicationController.getFindAllLatestPublications.bind(publicationController));
publicationRoutes.get("/user", authValidationToken, checkingUserExists, publicationController.getFindAllPublicationsOfUserForToken.bind(publicationController));
publicationRoutes.get("/list/:idUser", publicationController.getFindAllPublicationsOfUser.bind(publicationController));
publicationRoutes.get("/:idPublication", checkingPublicationExists, publicationController.getFindDataPublication.bind(publicationController));
publicationRoutes.post("/", authValidationToken, checkingUserExists, publicationController.createPublication.bind(publicationController));
publicationRoutes.patch("/:idPublication", checkingPublicationExists, authValidationToken, checkingUserExists, publicationController.updatePublication.bind(publicationController));
publicationRoutes.delete("/:idPublication", checkingPublicationExists, authValidationToken, checkingUserExists, publicationController.removePublication.bind(publicationController));

//Comentários
publicationRoutes.post("/comment/:idPublication", checkingPublicationExists, authValidationToken, checkingUserExists, commentController.creteCommentForPublication.bind(commentController));
publicationRoutes.delete("/:idPublication/comment/:idComment/", checkingPublicationExists, authValidationToken, checkingUserExists, commentController.removeCommentForPublication.bind(commentController));

//Likes
publicationRoutes.post("/like/:idPublication", checkingPublicationExists, authValidationToken, checkingUserExists, likeController.setLikeForPublication.bind(likeController));
publicationRoutes.delete("/deslike/:idPublication", checkingPublicationExists, authValidationToken, checkingUserExists, likeController.setDeslikeForPublication.bind(likeController));

//Exportando
export { publicationRoutes };