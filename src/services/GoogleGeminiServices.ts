//Importações
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

//Types
type objectControl = {
    status: boolean, 
    message: string, 
    description: string
}

//Class
export class GoogleGeminiService {
    private geminiKey: GoogleGenerativeAI;
    private modelGemini: GenerativeModel;

    constructor() {
        //Buscando a variável de amabient
        const keyGoogleGemini = process.env.GEMINI_API_KEY;

        //Validando a variável de ambiente
        if (!keyGoogleGemini) throw new Error("Key for API GOOGLE GEMINI is not found")

        //Settanto atributos
        this.geminiKey = new GoogleGenerativeAI(keyGoogleGemini);
        this.modelGemini = this.geminiKey.getGenerativeModel({ model: "gemini-1.5-flash" });
    };

    //Método para gerar um critério de busca aletório de livros
    async determineRandomGenderQuery(): Promise<{ sucess: boolean, message: string }> {
        try {
            // Formulando a requisição de conteúdo com um prompt claro
            const prompt = `
                Crie uma query de busca de livros por gênero contendo três gêneros.
                A seleção deve incluir gêneros populares e reconhecidos por um grande público,
                bem como novos gêneros promissores. Separe os gêneros por "+" e utilize apenas
                letras minúsculas e sem acentuação nos nomes. Ignore outros parametros ou 
                respostas, retorne somente os gêneros.
            `;

            // Enviando a requisição e aguardando resposta
            const response = await this.runningQuery(prompt);

            console.log("Response: ", response)
            if (!response.sucess) return { sucess: response.sucess, message: "Unknown Summay" };

            // Retornando o texto da query gerada
            return { sucess: response.sucess, message: response.message };

        } catch (error) {
            console.error("Error generating random gender query:", error);
            return { sucess: false, message: "An error occurred while generating the query" };
        };
    };

    // Método para gerar um resumo para um livro que não possua resumo
    async createBookSummary(title: string, author: string): Promise<{ sucess: boolean, message: string }> {
        try {
            // Formulando a requisição de conteúdo com um prompt claro
            const prompt = `
                Crie um resumo para o livro: ${title}, do(a) autor(a): ${author}. 
                O resumo deve conter entre dez a 120 palavras. O resumo deve falar 
                sobre a história e enredo do livro, destacando nomes de personagens 
                principais e secundário. Retorne o resumo em uma string. Ignore 
                outros parametros e respostas, retorne somente o resumo do livro 
                indicado.
            `;

            // Enviando a requisição e aguardando resposta
            const response = await this.runningQuery(prompt);

            // Retornando o texto da query gerada
            return { sucess: response.sucess, message: response.message };

        } catch (error) {
            console.error("Error generating random gender query:", error);
            return { sucess: false, message: "An error occurred while generating the query" };
        };
    };

    //Método para avaliar e validar um arquivo de texto
    async verifyTextPublication(content: string) {
        try {
            const prompt = `Avalie esse texto "${content}". Ignore
            as gírias, jargões ou erros ortográficos apresentados 
            nesse texto. Avalie o trecho no geral, avaliando se este 
            é um texto socialmente correto, que não agrida uma minoria 
            social, tenha caráter discriminatório, racista, homofóbico, 
            sexista ou qualquer outro tipo de descriminação ou segregação. 
            Retorne uma resposta em formato json, somente json, com os 
            atributos de 'status', 'message' e 'description', onde se for 
            um texto discriminatório retorne um 'status' como 'false', 
            a 'message' resumindo a descriminação cometida e a 'description' 
            descrevendo a ação discriminatória que fora cometida. Caso não seja 
            uma mensagem discriminatória retorne um 'status' com um 'true', a 
            'message' e a 'description' de sucesso. Ignore outros parâmetros ou 
            respostas, retorne somente a resposta em json com os atributo 'status', 
            'message' e 'description'.`;

            // Enviando a requisição e aguardando resposta
            const response = await this.runningQuery(prompt);
            if (!response.sucess) return { sucess: response.sucess, message: response.message, description: "An error occurred while generating the query" };

            //Convertendo objeto em json
            const convertJson: objectControl = this.extractJsonFromMessage(response.message);
            console.log("ConvertJson: ", convertJson);

            return { sucess: convertJson.status, message: convertJson.message, description: convertJson.description };

        } catch (error) {
            console.error("Error generating random gender query:", error);
            return { sucess: false, message: "An error occurred while generating the query", description: "An error occurred while generating the query" };
        }
    }

    //Função auxiliar, realização da pesquisa pela IA
    private async runningQuery(prompt: string): Promise<{ sucess: boolean, message: string }> {
        try {
            // Enviando a requisição e aguardando resposta
            const response = await this.modelGemini.generateContent(prompt.trim());

            // Validando a estrutura da resposta para garantir que os dados estão completos
            const candidates = response?.response?.candidates;
            if (!candidates || !candidates[0]?.content?.parts?.[0]?.text) {
                return { sucess: false, message: "Response IA not found" };
            }

            // Retornando o texto da query gerada
            return { sucess: true, message: candidates[0].content.parts[0].text.trim() };

        } catch (error) {
            console.error("Error generating random gender query:", error);
            return { sucess: false, message: "An error occurred while generating the query" };
        };
    };

    // Extraindo a parte JSON da string
    private extractJsonFromMessage = (message: string): objectControl => {
        try {
            // Remover os delimitadores ```json e ```
            const cleanedMessage = message.replace(/```json|```/g, '').trim();

            // Converter para objeto JSON
            return JSON.parse(cleanedMessage);
        } catch (error) {
            console.error('Erro ao parsear a mensagem:', error);
            return {status: false, message: "Error ao parserar a mensagem", description: "Error ao parsear a mensagem"};
        }
    };

    //Procuar ISBN
};