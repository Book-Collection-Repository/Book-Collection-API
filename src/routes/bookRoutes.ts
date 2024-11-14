//Importações
import { Router } from "express";

//Controllers
import { BookController } from "../controllers/BookController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";
import { checkingBookExists } from "../middleware/checkingBookExists";

//Configurações
const bookRoutes = Router();
const bookController = new BookController();

//Routes
bookRoutes.get("/list", bookController.getListBooksRandom.bind(bookController));
bookRoutes.get("/data/:idBook", checkingBookExists, bookController.getBookInDataBaseForId.bind(bookController));
bookRoutes.get("/data/title/:title", bookController.getBooksInDataBaseForTitle.bind(bookController));
bookRoutes.get("/data/isbn/:isbn", bookController.getBooksInDataBaseForISBN.bind(bookController));
bookRoutes.get("/external/:idBook", bookController.getBookInExternalApiForId.bind(bookController));
bookRoutes.get("/title/:title", bookController.getBooksInExternalApiForTitle.bind(bookController));
bookRoutes.get("/isbn/:isbn", bookController.getBooksInExternalApiForISBN.bind(bookController));
bookRoutes.get("/genre/:genre", bookController.getBooksInExternalApiForGenre.bind(bookController));
bookRoutes.get("/author/:author", bookController.getBooksInExternalApiForAuthor.bind(bookController));
bookRoutes.post("/:idBook", checkingBookExists, authValidationToken, checkingUserExists, bookController.addtingBookInDataBase.bind(bookController));
bookRoutes.delete("/:idBook", checkingBookExists, authValidationToken, checkingUserExists, bookController.removeBookInDataBase.bind(bookController));

//Expontando as rotas
export { bookRoutes };