/* eslint-disable no-undef */
// Importe o módulo axios
const axios = require('axios');

// URL da API que você deseja chamar
const apiUrl = 'https://brq-openai.azurewebsites.net/brq/gpt4';
const headers = {
    Authorization: `Bearer TQeOwfzFy36IxK75VAnksp92Ze2lkNSKKD3c/8Y11oKpzKiZzuC1HYf25MLj+MyDLn6jhoxj43DnKJ4Q2aRW3AuJq6WgBzPyO3aQONlrvUozGALWwnQPhh+DCJq3DOmECHxxE5GejTLeHLTjuljLKHZF5DkyjjiAhJ+QA+NIAn+eBTKq5q1bjnd+pVWvxItYElMzyRPG5GELFiX1caQHkTSPY6Bh4h5SNg7b9WQjm1F4aKVBAoqN4zx2IulOPZgj+SKw0KSt+jm/qadFRpLqrWr3Xw7eLxqFzhdi8j1VyNRI+16MUbIfkIRdAsvCSke3q5pv9skBm7HOaJmunm2vfEdab/mrZSLyhTbHhmBpgU50Ec+Dj8/iM1Sa5I8hXBE1NiCWmaNog5bsxZfkfzl5G0BekdSWBPh2SmNIWDXJm79V7MuUJMMficGwbLLjo+4C3ctYMP793bT/4x6xaj7Lj1Lj1gR/pvvojf2NIEHlKmkNcEVWiIuJTw9E512WjoT8djgDqT1Z3F+L7oBB2haEaUnR/8DKUjxaoOS1QxTQdM/XAT06bT+KOIYrWklXZ1b9xTJZPvovH6vNjCBrZnpROZqc/vhvCBb8r8vxScP8AdtyKFXs7eenzEwTuW6waIlZnDiL9tcaNb35f0cHPEcstlZp9ypo3z0TRPvF2OHTbzjF6PLHKaQo8IDlrdzSEcTYXmYXHkVwnfXRiN37nqQw2Tbrf5D+5cE0plbjQ4liOiHpPSTIjtVhjrj08a7lZ8Yp7MHbjhbowy2RJBoXXAz5GQRXXWjV6QMWMhpwAAes`,
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