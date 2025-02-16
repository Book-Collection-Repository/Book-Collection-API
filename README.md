
# **API Principal - Book Collection**

Esta **API** faz parte do sistema **Book Collection**, um projeto web desenvolvido para o **Trabalho de Conclusão de Curso (TCC)**. O sistema **Book Collection** é uma rede social para leitores, permitindo a comunicação entre usuários, organização de leituras e descoberta de novas aventuras literárias. Esta **API** segue a arquitetura **REST** e o padrão **MVC**, além de se integrar com serviços externos para aprimorar suas funcionalidades.

## **Tecnologias utlizadas**
- **Node.js**

- **TypeScript** (tipagem estática para JavaScript)

- **Express.js** (Framework para APIs REST)

- **Prisma ORM** (Gerenciamento de banco de dados)

- **PostgreSQL** (Banco de dados relacional)

- **Redis** (Cache e gerenciamento de autenticação)

- **JWT** (Autenticação via Token)

- **Google Books API** (Consulta de livros)

- **Gemini AI** (Recursos de inteligência artificial para recomendações e análises)

- **Axios** (Requisições HTTP)

## **Arquitetura**

A API é estruturada seguindo o padrão **MVC (Model-View-Controller)**:

- **Routes:** Define os endpoints disponíveis para cada funcionalidade.

- **Controllers:** Processa as requisições, gerencia a lógica de negócios e coordena os serviços necessários.

- **Services:** Contém a lógica principal de interação com o banco de dados e manipulação dos dados.

- **Middlewares:** Responsáveis por validações e autenticações nas rotas.

- **Models:** Define as entidades e estrutura do banco de dados usando Prisma ORM.

## **Funcionalides Principais**
1. Gerenciamento de Usuários

- Cadastro e autenticação (JWT + Redis)

- Recuperação de senha

- Edição de perfil

2. Gerenciamento de Livros e Leituras

- Busca de livros via Google Books API

- Organização da estante virtual

- Avaliação e categorização de livros

3. Interação Social

- Publicação de notas na comunidade

- Seguir e ser seguido por outros usuários

4. Recomendações Inteligentes

- Sugestões de leituras usando Gemini AI

- Análises baseadas no histórico de leitura do usuário

### **Instalação**
1. Clone o repositório do Asclepius-Mobile:

```bash
https://github.com/Book-Collection-Repository/Book-Collection-API
cd Book-Collection-API
```
2. Instale as dependências:

```bash
npm install
ou
yarn
```

3. Configure as variáveis de ambiente no arquivo **.env**;

4. Inicie os Servidores (esta e API de Tempo Real):

5. Inicie o projeto: 

```bash
npm run dev
ou 
yarn dev
```

## **Metodologia de Desenvolvimento**
A API foi desenvolvida utilizando a metodologia **TDD (Test-Driven Development)** em conjunto com Jest para testes unitários e de integração.

## **Contribuição**
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## **Autor**
Este projeto foi desenvolvido como parte do TCC de [Douglas Silva](https://github.com/7-Dodi).

## **Demais repositórios**

- **Api de Tempo Real:** [Link do repositório](https://github.com/Book-Collection-Repository/Book-Collection-Chat-API) 
- **Frontend do Sistema:** [Link do repositório](https://github.com/Book-Collection-Repository/Book-Collection-Web-Frontend)

## **Lincença**
[MIT License](https://opensource.org/license/mit)