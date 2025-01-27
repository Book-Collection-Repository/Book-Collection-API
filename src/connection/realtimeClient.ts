//Importações
import axios from "axios";

//Configuração de api de Tempo Real
export const portRealTime = "http://localhost:4000"; 

//Configurando o axios
export const ApiRealTime = axios.create({
    baseURL: portRealTime,
});