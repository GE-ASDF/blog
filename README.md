# Blog em Node.js

Este é um projeto básico de um blog desenvolvido em Node.js. O objetivo deste projeto é fornecer uma estrutura inicial para a criação de um blog simples, onde os usuários podem visualizar e criar postagens.

## Funcionalidades

- Visualizar postagens existentes
- Criar uma nova postagem
- Editar postagens existentes
- Excluir postagens

## Tecnologias utilizadas

- Node.js (versão 18.16.0)
- Express.js (framework web)
- Banco de dados MariaDB (versão 10.4.24)
- EJS (template engine)
- Bootstrap (framework de CSS)

## Pré-requisitos

Antes de executar o projeto, verifique se você tem as seguintes dependências instaladas:

- Node.js (versão 18.16.0)
- MariaDB (versão 10.4.24)

## Instalação

1. Clone este repositório em sua máquina local.
2. Navegue até o diretório do projeto: `cd blog`.
3. Execute o comando `npm install` para instalar as dependências do projeto.
4. Configure as variáveis de ambiente no arquivo `.env` (consulte o arquivo `.env.example` para obter mais detalhes).
5. Inicie o servidor com o comando `npm start`.
6. Abra o navegador e acesse `http://localhost:PORTA_CONFIGURADA_NO_.ENV` para visualizar o blog.

## Estrutura do projeto

- `src/app.js` - Arquivo principal que configura o servidor Express.js e define as rotas.
- `index.js` - Arquivo de inicialização do servidor.
- `controllers/` - Pasta contendo os controladores das rotas.
- `public/` - Pasta contendo arquivos estáticos, como folhas de estilo CSS e scripts JavaScript.
- `views/` - Pasta contendo os arquivos EJS para renderização das páginas.
- `core/` - Pasta contendo a configuração de conexão ao banco de dados.
- `models/` - Pasta que contém os models para manipulação do banco de dados.

## Contribuição

Contribuições são sempre bem-vindas! Se você encontrar algum problema ou tiver sugestões de melhorias, fique à vontade para abrir uma nova issue ou enviar um pull request.