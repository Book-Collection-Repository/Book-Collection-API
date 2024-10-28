//Importações
import { Router } from "express";

//Rotas
import { userRoutes } from "./userRoutes";

//Configurações
const routes = Router();

routes.use("/users", userRoutes);

export {routes};