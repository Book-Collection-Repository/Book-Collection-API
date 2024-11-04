//Importações
import { Router } from "express";
import { CollectionController } from "../controllers/CollectionController";
import { BookCollectionController } from "../controllers/BookCollectionController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";

//Configuração
const collectionRoutes = Router();
const collectionController = new CollectionController();
const bookCollectionController = new BookCollectionController();

//Rotas
collectionRoutes.get("/", authValidationToken, collectionController.getListCollectionsOfUser.bind(collectionController));
collectionRoutes.get("/:idCollection", collectionController.getListDataFromCollection.bind(collectionController));
collectionRoutes.post("/default", authValidationToken, collectionController.createDefaultCollections.bind(collectionController));
collectionRoutes.post("/custom", authValidationToken, collectionController.creteCustomCollections.bind(collectionController));
collectionRoutes.patch("/custom/:idCollection", authValidationToken, collectionController.updateCustomCollections.bind(collectionController));
collectionRoutes.delete("/custom/:idCollection", authValidationToken, collectionController.deleteCutomCollection.bind(collectionController));

collectionRoutes.get("/books/:idCollection", bookCollectionController.getListBooksInCollection.bind(bookCollectionController));
collectionRoutes.post("/:idCollection/book/:idBook", authValidationToken, bookCollectionController.postAdditingBooksInCollection.bind(bookCollectionController));
collectionRoutes.delete("/:idCollection/book/:idBook", authValidationToken, bookCollectionController.deleteRemovingBooksInCollection.bind(bookCollectionController))

//Exportando
export { collectionRoutes };