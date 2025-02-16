//Importações
import { Router } from "express";

//Middleware
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";
import { checkingCollectionExists } from "../middleware/checkingCollectionExists";
import { checkingDiaryExists } from "../middleware/checkingDiaryExists";

//Controller
import { CacheClientController } from "../controllers/cacheClient/CacheClientController";

//Configurações
const cacheRoutes = Router();
const cacheControllers = new CacheClientController();

//Routes

cacheRoutes.get("/data/user", authValidationToken, checkingUserExists, cacheControllers.getUserData.bind(cacheControllers));
cacheRoutes.get("/allAvaliations", authValidationToken, checkingUserExists, cacheControllers.getListAllAvaliations.bind(cacheControllers));
cacheRoutes.get("/allCollections", authValidationToken, checkingUserExists, cacheControllers.getListAllCollections.bind(cacheControllers));
cacheRoutes.get("/collection/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, cacheControllers.getListDataCollection.bind(cacheControllers));
cacheRoutes.get("/allFollowers", authValidationToken, checkingUserExists, cacheControllers.getListAllFollowers.bind(cacheControllers));
cacheRoutes.get("/allFolloweds", authValidationToken, checkingUserExists, cacheControllers.getListAllFolloweds.bind(cacheControllers));
cacheRoutes.get("/allPublications", authValidationToken, checkingUserExists, cacheControllers.getListAllpublications.bind(cacheControllers));
cacheRoutes.get("/diaries", authValidationToken, checkingUserExists, cacheControllers.getListAllDiaries.bind(cacheControllers));
cacheRoutes.get("/diary/:idDiary", checkingDiaryExists, authValidationToken, checkingUserExists, cacheControllers.getListDataDiary.bind(cacheControllers));
cacheRoutes.get("/allReccomendations", authValidationToken, checkingUserExists, cacheControllers.getListBooksReccomedations.bind(cacheControllers));
cacheRoutes.get("/prefferences/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, cacheControllers.getListPrefferencesForCollecton.bind(cacheControllers));
cacheRoutes.get("/reccomendations/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, cacheControllers.getListReccomendationsForCollecton.bind(cacheControllers));
cacheRoutes.get("/searchBooks", authValidationToken, checkingUserExists, cacheControllers.getListSearchBooks.bind(cacheControllers));

cacheRoutes.post("/data/user", authValidationToken, checkingUserExists, cacheControllers.saveUserData.bind(cacheControllers));
cacheRoutes.post("/allAvaliations", authValidationToken, checkingUserExists, cacheControllers.saveAllAvaliations.bind(cacheControllers));
cacheRoutes.post("/allPublications", authValidationToken, checkingUserExists, cacheControllers.saveAllAvaliations.bind(cacheControllers));
cacheRoutes.post("/allCollections", authValidationToken, checkingUserExists, cacheControllers.saveAllCollections.bind(cacheControllers));
cacheRoutes.post("/allFollowers", authValidationToken, checkingUserExists, cacheControllers.salvedListAllFollowers.bind(cacheControllers));
cacheRoutes.post("/allFolloweds", authValidationToken, checkingUserExists, cacheControllers.salvedListAllFolloweds.bind(cacheControllers));
cacheRoutes.post("/diaries", authValidationToken, checkingUserExists, cacheControllers.salvedListAllDiaries.bind(cacheControllers));
cacheRoutes.post("/allReccomendations", authValidationToken, checkingUserExists, cacheControllers.saveBookRecommendations.bind(cacheControllers))
cacheRoutes.post("/prefferences/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, cacheControllers.saveBookPrefferencesForCollection.bind(cacheControllers));
cacheRoutes.post("/reccomendations/:idCollection", checkingCollectionExists, authValidationToken, checkingUserExists, cacheControllers.saveBookRecomendationsForCollection.bind(cacheControllers));
cacheRoutes.post("/searchBooks", authValidationToken, checkingUserExists, cacheControllers.saveSearchBooks.bind(cacheControllers))

//Exportando
export { cacheRoutes };