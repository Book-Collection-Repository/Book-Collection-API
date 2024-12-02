//Importações
import { Router } from "express";

//Rotas
import { userRoutes } from "./userRoutes";
import { followRoutes } from "./followRoutes";
import { messageRoutes } from "./messageRoutes";
import { bookRoutes } from "./bookRoutes";
import { collectionRoutes } from "./collectionRoutes";
import { avaliationRoutes } from "./avaliationRoutes";
import { diaryRoutes } from "./readingDiaryRoutes";
import { publicationRoutes } from "./publicationRoutes";
import { redisRoutes } from "./redisClientRoutes";

//Configurações
const routes = Router();

routes.use("/users", userRoutes);
routes.use("/follow", followRoutes);
routes.use("/message", messageRoutes);
routes.use("/book", bookRoutes);
routes.use("/collection", collectionRoutes);
routes.use("/avaliation", avaliationRoutes);
routes.use("/diary", diaryRoutes);
routes.use("/publication", publicationRoutes);
routes.use("/redis", redisRoutes);

export {routes};