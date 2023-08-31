/* eslint-disable no-undef */
const fs = require('fs');
const mime = require('mime-types');

/* eslint-disable no-undef */
// Supports ES6
const venom = require('venom-bot');

const { requestGpt } = require('./src/routers/gpt');
const { requestNpl } = require('./src/api/model/npl');


// venom
//     .create({
//         session: 'bot-venom-gpt' //name of session
//     })
//     .then((client) => start(client))
//     .catch((erro) => {
//         console.log(erro);
//     });

venom
    .create({
        session: 'lucas' //name of session
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

async function start(client) {
    client.onStateChange(async (state) => {
        console.log('State changed: ', state);
        // force whatsapp take over
        if ('CONFLICT'.includes(state)) client.useHere();
        // detect disconnect on whatsapp
        if ('UNPAIRED'.includes(state)) console.log('logout');
    });

    client.onMessage(async (message) => {
        let frase = message.body?.toLowerCase();
        console.log('From---------------------');
        console.log('Mensagem de: ' + message.from);
        console.log('Mensagem: ' + message.body);
        console.log('------------------------');

        if (message.from === 'status@broadcast') {
            console.log('Status descartado');
            return;
        }

        let responseNpl = await requestNpl(frase);

        if (responseNpl && !message.isGroupMsg) {
            client
                .sendText(message.from, responseNpl)
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        } else if (message) {
            let reposnse = '';

            if (message.from === '120363045923360191@g.us') {
                // Send audio file MP3
                await client.sendVoice(message.from, './audio.mp3').then((result) => {
                    console.log('Result: ', result); //return object success
                }).catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
            } else if (message.isGroupMsg) {
                console.log('Menssagem de grupo rejeitada: ');
            } else {
                // await client
                //     .sendText(message.from, 'Aguarde, estou consultando...')
                //     .then((result) => {
                //         console.log('Result: ', result); //return object success
                //     })
                //     .catch((erro) => {
                //         console.error('Error when sending: ', erro); //return object error
                //     });

                // consulta no chat gpt
                await requestGpt(message.body).then((result) => {
                    reposnse = result;
                });
            }

            // Envia resposta para o cliente do chat gpt
            await client
                .sendText(message.from, reposnse)
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        } else {
            console.log('------------------------');
            console.log('Mensagem ignorada para: ' + message.to);
            console.log('Mensagem: ' + message.body);
            console.log('------------------------');
        }
    });
}
