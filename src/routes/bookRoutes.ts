//Importações
import { Router } from "express";

//Controllers
import { BookController } from "../controllers/BookController";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";

//Configurações
const bookRoutes = Router();
const bookController = new BookController();

//Routes
bookRoutes.get("/data/title/:title", bookController.getBooksInDataBaseForTitle.bind(bookController));
bookRoutes.get("/data/isbn/:isbn", bookController.getBooksInDataBaseForISBN.bind(bookController));
bookRoutes.get("/title/:title", bookController.getBooksInExternalApiForTitle.bind(bookController));
bookRoutes.get("/isbn/:isbn", bookController.getBooksInExternalApiForISBN.bind(bookController));
bookRoutes.get("/genre/:genre", bookController.getBooksInExternalApiForGenre.bind(bookController));
bookRoutes.get("/author/:author", bookController.getBooksInExternalApiForAuthor.bind(bookController));
bookRoutes.post("/:idBook", authValidationToken, bookController.addtingBookInDataBase.bind(bookController));
bookRoutes.delete("/:id", authValidationToken, bookController.removeBookInDataBase.bind(bookController));

//Expontando as rotas
export { bookRoutes };