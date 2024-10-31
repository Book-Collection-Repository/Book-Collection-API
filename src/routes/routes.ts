//Importações
import { Router } from "express";

//Rotas
import { userRoutes } from "./userRoutes";
import { followRoutes } from "./followRoutes";
import { messageRoutes } from "./messageRoutes";

//Configurações
const routes = Router();

routes.use("/users", userRoutes);
routes.use("/follow", followRoutes);
routes.use("/message", messageRoutes);

export {routes};