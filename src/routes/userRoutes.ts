//Importações
import {Router} from 'express';
import multer from 'multer';
import uploadConfigImage from '../config/multer';

//Controllers
import { UserController } from '../controllers/UserController';

//Middleware
import { authValidationToken } from '../middleware/authValidationToken';
import { checkingUserExists } from '../middleware/checkingUserExists';
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
userRoutes.get("/:id", authValidationToken, checkingUserExists, userController.searchUserForId.bind(userController));
userRoutes.get("/profile/:profileName", authValidationToken, checkingUserExists, userController.searchUserForProfileName.bind(userController));
userRoutes.get("/authenticate/validator", authValidationToken, checkingUserExists, userController.authenticateUserIsValid.bind(userController));
userRoutes.patch("/update", authValidationToken, checkingUserExists, userController.updateProfile.bind(userController));
userRoutes.delete("/delete", authValidationToken, checkingUserExists, userController.deleteProfile.bind(userController));

userRoutes.patch("/upload", authValidationToken, validationUploadImageUser, upload.single("image"), userController.updateProfilePhoto.bind(userController));

//Expondo rotas de usuário
export { userRoutes };