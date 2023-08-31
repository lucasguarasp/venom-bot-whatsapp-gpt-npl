/* eslint-disable no-undef */

const { NlpManager } = require('node-nlp');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const manager = new NlpManager({ languages: ['pt'] });
(async () => {

    const dataAtual = new Date();
    const dataFormatada = format(dataAtual, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    // Adicione documentos (perguntas) e intenções
    const perguntasBoasVindas = [
        'Oi',
        'Tudo bem',
        'Como Vai',
        'Hello',
        'Hi',
        'Fala aí'
    ];

    perguntasBoasVindas.forEach(pergunta => {
        manager.addDocument('pt', pergunta, 'boasVindas');
    });

    manager.addDocument('pt', 'Que dia é hoje?', 'data');
    manager.addDocument('pt', 'Data', 'data');
    manager.addDocument('pt', 'Que horas são?', 'horas');

    manager.addDocument('pt', 'Bolsonaro', 'bolsonaro');

    // Defina um objeto (ou mapa) de respostas para as intenções
    const respostasPorIntencao = {
        'boasVindas': [
            'Oi, tudo bem? Como posso te ajudar?',
            'Oi, como vai?'
        ],
        'data': [
            `Hoje é ${format(dataAtual, "dd'/'MM'/'yyyy", { locale: ptBR })}`,
            `${dataFormatada}`
        ],
        'horas': [
            `Agora é exatamente ${format(dataAtual, "HH'h' mm'min'", { locale: ptBR })}`,
            `${format(dataAtual, "HH'h' mm'min'", { locale: ptBR })}`
        ],
        'bolsonaro': [
            `fazuely`,
            `faz 1 L`
        ]
        // Adicione mais respostas para outras intenções
    };

    // Adicione respostas possíveis para todas as intenções
    Object.keys(respostasPorIntencao).forEach(intencao => {
        respostasPorIntencao[intencao].forEach(resposta => {
            manager.addAnswer('pt', intencao, resposta);
        });
    });

    // Treine o classificador e o modelo
    await manager.train();

    // Salva o modelo em um arquivo (opcional)
    await manager.save();
})();


// Processa pergunta
async function requestNpl(msg) {

    if (!msg) return;

    const response = await manager.process('pt', msg);
    console.log('Pergunta:', response.utterance);
    console.log('Intenção:', response.intent);
    console.log('Resposta:', response.answer);

    return response.answer;
}

module.exports = { requestNpl };