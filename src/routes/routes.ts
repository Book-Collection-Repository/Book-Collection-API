//Importações
import { Router } from "express";

//Rotas
import { userRoutes } from "./userRoutes";
import { followRoutes } from "./followRoutes";
import { messageRoutes } from "./messageRoutes";
import { bookRoutes } from "./bookRoutes";
import { collectionRoutes } from "./collectionRoutes";

//Configurações
const routes = Router();

routes.use("/users", userRoutes);
routes.use("/follow", followRoutes);
routes.use("/message", messageRoutes);
routes.use("/book", bookRoutes);
routes.use("/collection", collectionRoutes);

export {routes};