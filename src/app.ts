//Importações
import express from "express";
import cors from "cors";
import path from "path";

//Routes
import { routes } from "./routes/routes";

//Configurações
const app = express();
app.use(express.json());
app.use(cors());

//Configurando rotas
app.use(routes);

//Configurando rota para upload de arquivo
app.use("/images", express.static(path.join(__dirname, "..", "uploads")));

export default app;