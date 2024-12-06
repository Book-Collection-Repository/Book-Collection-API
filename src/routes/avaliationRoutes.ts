//Importações
import { Router } from "express";

//Controller
import { AvaliationController } from "../controllers/AvaliationsController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingBookExists } from "../middleware/checkingBookExists";
import { checkingUserExists } from "../middleware/checkingUserExists";

//Configurações
const avaliationRoutes = Router();
const avaliationController = new AvaliationController();

//Routes
avaliationRoutes.get("/:idBook", checkingBookExists, avaliationController.getListAvaliationsOfBook.bind(avaliationController));
avaliationRoutes.get("/user/:idUser", avaliationController.getListAvaliationsOfUser.bind(avaliationController));
avaliationRoutes.get("/", authValidationToken, checkingUserExists, avaliationController.getListAvaliationsOfUserForToken.bind(avaliationController));
avaliationRoutes.get("/data/:idAvaliation", authValidationToken, checkingUserExists, avaliationController.getDataAvaliation.bind(avaliationController));
avaliationRoutes.post("/:idBook", authValidationToken, checkingUserExists, avaliationController.createAvaliationsOfBook.bind(avaliationController));
avaliationRoutes.patch("/:idAvaliation", authValidationToken, checkingUserExists, avaliationController.updatedAvaliationsOfBook.bind(avaliationController));
avaliationRoutes.delete("/:idAvaliation", authValidationToken, checkingUserExists, avaliationController.deleteAvaliationsOfBook.bind(avaliationController));

//Exportando
export {avaliationRoutes};