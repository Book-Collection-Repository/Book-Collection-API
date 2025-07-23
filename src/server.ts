//Importando App
import app from "./app";

//Porta da aplicação
const port = process.env.PORT_API || 5000;

//Inicialização
app.listen(port, () => {
    console.log(`Server is running in port: ${port}`);
});