//Importações
import { Router } from "express";
import { CollectionController } from "../controllers/CollectionController";
import { BookCollectionController } from "../controllers/BookCollectionController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";
import { checkingBookExists } from "../middleware/checkingBookExists";
import { checkingCollectionExists } from "../middleware/checkingCollectionExists";

//Configuração
const collectionRoutes = Router();
const collectionController = new CollectionController();
const bookCollectionController = new BookCollectionController();

//Rotas
collectionRoutes.get("/", authValidationToken, checkingUserExists, collectionController.getListCollectionsOfUser.bind(collectionController));
collectionRoutes.get("/user/:idUser", collectionController.getListCollectionsOfUserForID.bind(collectionController));
collectionRoutes.get("/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, collectionController.getListDataFromCollection.bind(collectionController));
collectionRoutes.post("/default", authValidationToken, checkingUserExists, collectionController.createDefaultCollections.bind(collectionController));
collectionRoutes.post("/custom", authValidationToken, checkingUserExists, collectionController.creteCustomCollections.bind(collectionController));
collectionRoutes.patch("/custom/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, collectionController.updateCustomCollections.bind(collectionController));
collectionRoutes.delete("/custom/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, collectionController.deleteCutomCollection.bind(collectionController));

collectionRoutes.get("/books/:idCollection", checkingCollectionExists, bookCollectionController.getListBooksInCollection.bind(bookCollectionController));
collectionRoutes.post("/:idCollection/book/:idBook", checkingCollectionExists, authValidationToken, checkingUserExists, bookCollectionController.postAdditingBooksInCollection.bind(bookCollectionController));
collectionRoutes.delete("/:idCollection/book/:idBook", checkingCollectionExists, checkingBookExists, authValidationToken, checkingUserExists, bookCollectionController.deleteRemovingBooksInCollection.bind(bookCollectionController))

//Exportando
export { collectionRoutes };