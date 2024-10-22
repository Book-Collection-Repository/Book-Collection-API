//Importações
import express from "express";
import cors from "cors";

//Configurações
const app = express();
app.use(express.json());
app.use(cors());

export default app;