//Importações
import { Router } from "express";

//Controller
import { AvaliationController } from "../controllers/AvaliationsController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";

//Configurações
const avaliationRoutes = Router();
const avaliationController = new AvaliationController();

//Routes
avaliationRoutes.get("/:idBook", avaliationController.getListAvaliationsOfBook.bind(avaliationController));
avaliationRoutes.get("/data/:idAvaliation", authValidationToken, avaliationController.getDataAvaliation.bind(avaliationController));
avaliationRoutes.post("/:idBook", authValidationToken, avaliationController.createAvaliationsOfBook.bind(avaliationController));
avaliationRoutes.patch("/:idAvaliation", authValidationToken, avaliationController.updatedAvaliationsOfBook.bind(avaliationController));
avaliationRoutes.delete("/:idAvaliation", authValidationToken, avaliationController.deleteAvaliationsOfBook.bind(avaliationController));

//Exportando
export {avaliationRoutes};