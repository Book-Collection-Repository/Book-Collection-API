//Importações
import {Router} from 'express';
import multer from 'multer';
import uploadConfigImage from '../config/multer';

//Controllers
import { UserController } from '../controllers/UserController';

//Middleware
import { authValidationToken } from '../middleware/authValidationToken';
import { validationUploadImageUser } from '../middleware/validationUploadImageUser';

//Configurações
const userRoutes = Router();
const userController = new UserController();
const upload = multer(uploadConfigImage); 

//Routes
userRoutes.get("/", userController.findAllUsers.bind(userController));
userRoutes.post("/", userController.createUser.bind(userController));
userRoutes.post("/authenticate", userController.authenticateUser.bind(userController));
userRoutes.patch("/update/password", userController.updatePassword.bind(userController));
userRoutes.get("/:id", authValidationToken, userController.searchUserForId.bind(userController));
userRoutes.get("/profile/:profileName", authValidationToken, userController.searchUserForProfileName.bind(userController));
userRoutes.get("/authenticate/validator", authValidationToken, userController.authenticateUserIsValid.bind(userController));
userRoutes.patch("/update", authValidationToken, userController.updateProfile.bind(userController));
userRoutes.delete("/delete", authValidationToken, userController.deleteProfile.bind(userController));

userRoutes.patch("/upload", authValidationToken, validationUploadImageUser, upload.single("image"), userController.updateProfilePhoto.bind(userController));

//Expondo rotas de usuário
export { userRoutes };