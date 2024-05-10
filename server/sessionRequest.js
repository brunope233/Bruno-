const axios = require('axios');
const config = require('./config');
const xml2js = require('xml2js');

module.exports = function makeSession() {
    //const apiUrl = `https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=${config.email}&token=${config.token}`;
    const apiUrl = `${config.apiUrl}sessions?email=${config.email}&token=${config.token}`;
    console.log("vai criar sessao com " + apiUrl);
    const headers = {
        'Content-Type': 'application/xml'
    };
    const data = `email=${config.email}&token=${config.token}`;

    const options = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl,
        headers: headers,
        data: data
    };

    // Retorne uma promessa para obter os dados da sessão
    return new Promise((resolve, reject) => {
        axios.request(options)
            .then((response) => {
                // Converter o XML para JSON
                xml2js.parseString(response.data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Extrair o ID da sessão do JSON
                        const sessionId = result.session.id[0];
                        resolve(sessionId);
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
};