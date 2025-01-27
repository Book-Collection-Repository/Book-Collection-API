//Importações
import { Router } from "express";

//Controllers
import { FollowController } from "../controllers/FollowController";

//Middlewares
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";

//Configurações
const followRoutes = Router();
const followController = new FollowController();

//Routes
followRoutes.get("/list/followers/:idUser", followController.getListFollowers.bind(followController));
followRoutes.get("/list/followed/:idUser", followController.getListFollowing.bind(followController));
followRoutes.post("/create/:idFriend", authValidationToken, checkingUserExists, followController.createFollowUsers.bind(followController));
followRoutes.delete("/delete/:idFriend", authValidationToken, checkingUserExists, followController.removeFollowUsers.bind(followController));

//Exportando rotas de follow
export { followRoutes };