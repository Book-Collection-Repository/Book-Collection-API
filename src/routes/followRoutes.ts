//Importações
import { Router } from "express";

//Controllers
import { FollowController } from "../controllers/FollowController";

//Middlewares
import { authValidationToken } from "../middleware/authValidationToken";

//Configurações
const followRoutes = Router();
const followController = new FollowController();

//Routes
followRoutes.get("/list/followers", authValidationToken, followController.getListFollowers.bind(followController));
followRoutes.get("/list/followed", authValidationToken, followController.getListFollowing.bind(followController));
followRoutes.post("/create/:idFriend", authValidationToken, followController.createFollowUsers.bind(followController));
followRoutes.delete("/delete/:idFriend", authValidationToken, followController.removeFollowUsers.bind(followController));

//Exportando rotas de follow
export { followRoutes };