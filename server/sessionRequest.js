const axios = require('axios');
const config = require('./config');
const xml2js = require('xml2js');

module.exports = function makeSession() {
    const apiUrl = `${config.apiUrl}sessions?email=${config.email}&token=${config.token}`;
    
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
    console.log("vai criar sessao com " + apiUrl);
    // Retorne uma promessa para obter os dados da sessão
    return new Promise((resolve, reject) => {
        
        axios.request(options)
            .then((response) => {
                // Converter o XML para JSON
                console.log("Retorno da sessao");
                console.log(response);
                xml2js.parseString(response.data, (err, result) => {
                    if (err) {
                        console.log("reject");
                        reject(err);
                    } else {
                        // Extrair o ID da sessão do JSON
                        console.log("extraindo a sessao");
                        const sessionId = result.session.id[0];
                        resolve(sessionId);
                    }
                });
            })
            .catch((error) => {
                console.log("erro");
                console.log(error);
                reject(error);
            });
    });
};