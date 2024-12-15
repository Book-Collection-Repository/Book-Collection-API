//Importações
import { Router } from "express";

//Middlewares
import { authValidationToken } from "../middleware/authValidationToken";
import { checkingUserExists } from "../middleware/checkingUserExists";
import { checkingBookExists } from "../middleware/checkingBookExists";
import { checkingDiaryExists } from "../middleware/checkingDiaryExists";

//Services
import { ReadingDiaryController } from "../controllers/ReadingDiaryController";
import { ReadingDiaryRecordController } from "../controllers/ReadingDiaryRecordController";

//Configurações
const diaryRoutes = Router();
const diaryController = new ReadingDiaryController();
const recordController = new ReadingDiaryRecordController();

//Routes
diaryRoutes.get("/", authValidationToken, checkingUserExists, diaryController.getListReadingDiariesOfUser.bind(diaryController));
diaryRoutes.get("/:idUser", diaryController.getListReadingDiariesForID.bind(diaryController));
diaryRoutes.get("/:idDiary", checkingDiaryExists, diaryController.getListDataReadingDiary.bind(diaryController));
diaryRoutes.post("/:idBook", authValidationToken, checkingUserExists, checkingBookExists, diaryController.createReadingDiaryOfBook.bind(diaryController));
diaryRoutes.delete("/:idDiary", checkingDiaryExists, authValidationToken, checkingUserExists, diaryController.removeReadingDiaryOfBook.bind(diaryController));

diaryRoutes.get("/record/:idDiary", checkingDiaryExists, recordController.getListRecordOfReadingDiary.bind(recordController));
diaryRoutes.get("/record/:idRecord", recordController.getDataRecordOfReadingDiary.bind(recordController));
diaryRoutes.post("/record/:idDiary", checkingDiaryExists, authValidationToken, checkingUserExists, recordController.createDataRecordOfReadingDiary.bind(recordController));
diaryRoutes.put("/record/:idRecord", authValidationToken, checkingUserExists, recordController.updateDataRecordOfReadingDiary.bind(recordController));
diaryRoutes.delete("/record/:idRecord", authValidationToken, checkingUserExists, recordController.deleteDataRecordOfReadingDiary.bind(recordController));

//Exportando
export { diaryRoutes };