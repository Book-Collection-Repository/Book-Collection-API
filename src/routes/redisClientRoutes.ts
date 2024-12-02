//Importações
import { Router } from "express";

//Middlewares
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingCollectionExists } from "../middleware/checkingCollectionExists";
import { checkingUserExists } from "../middleware/checkingUserExists";

//Controllers
import { RedisClientController } from "../controllers/RedisClientControllers";

//Configurações
const redisRoutes = Router();
const redisController = new RedisClientController();

//Rotas

redisRoutes.get("/genres/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, redisController.getPreferredGenresForCollection.bind(redisController));
redisRoutes.get("/authors/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, redisController.getPreferredAuthorsForCollection.bind(redisController));
redisRoutes.get("/genres", authValidationToken, checkingUserExists, redisController.getPreferredAllGenres.bind(redisController));
redisRoutes.post("/genres", authValidationToken, checkingUserExists, redisController.postPreferredAllGenres.bind(redisController));

//Exportando
export { redisRoutes };