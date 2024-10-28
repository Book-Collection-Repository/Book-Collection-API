//Importações
import { Router } from "express";

//Rotas
import { userRoutes } from "./userRoutes";
import { followRoutes } from "./followRoutes";

//Configurações
const routes = Router();

routes.use("/users", userRoutes);
routes.use("/follow", followRoutes);

export {routes};