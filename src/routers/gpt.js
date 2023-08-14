/* eslint-disable no-undef */
// Importe o módulo axios
const axios = require('axios');

// URL da API que você deseja chamar
const apiUrl = 'https://SUA URL AQUI';
const headers = {
    Authorization: `Bearer SEU TOKEN AQUI`,
};
const body = {
    "prompt": "",
    "max_tokens": 2000,
    "temperature": 0.9
};

// Função para fazer a chamada REST usando async/await
async function requestGpt(msg) {
    console.log('Chamando GPT4: ', msg);

    body.prompt = msg;

    try {
        // Faz a chamada REST usando axios
        const response = await axios.post(apiUrl, body, { headers });

        // O conteúdo da resposta da API estará em response.data
        // console.log('Dados da API:', response.data);
        return response.data.answer;
    } catch (error) {
        console.error('Erro ao chamar a API:', error.message);
    }
}

module.exports = { requestGpt };