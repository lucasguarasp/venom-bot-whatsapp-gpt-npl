# Projeto baseado no venom, NPL e chat GPT4

Venom: https://github.com/orkestral/venom
NPL: https://www.npmjs.com/package/node-nlp

#### 1 - Clone projeto
#### 2 - npm install
#### 3 - npm i venom-bot@latest
#### 4 - npm install node-nlp
#### 5 - npm install axios - para chat gpt

#### Criar um arquivo app.js
##### -> inserir:

```javascript
 // Supports ES6 // import { create, Whatsapp } from 'venom-bot'; const venom = require('venom-bot');  venom   .create({     session: 'session-name', //name of session   })   .then((client) => start(client))   .catch((erro) => {     console.log(erro);   });  function start(client) {   client.onMessage((message) => {     if (message.body === 'Hi' && message.isGroupMsg === false) {       client         .sendText(message.from, 'Welcome Venom 🕷')         .then((result) => {           console.log('Result: ', result); //return object success         })         .catch((erro) => {           console.error('Error when sending: ', erro); //return object error         });     }   }); }
```

#### OBS
#### alterar src/routers/gpt.js 
#### inserir apiUrl do gpt, em seguida adicionar seu token em Authorization
#### para inserir lógicas referente ao whatsapp, fazer no arquivo app.js
#### para ver possíveis funções com bot venom, consultar redme: https://github.com/orkestral/venom/blob/master/README.md
#### para inserir intenções, perguntas e respostas, alterar o arquivo src/api/model/npl.js 


### Para rodar o projeto:
##### node app.js
