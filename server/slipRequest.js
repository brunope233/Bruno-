// slipRequest.js
const axios = require('axios');
const createSlipXML = require('./slipXML');
const config = require('./config');

module.exports = function makeSlip(userData) {
    const xmlData = createSlipXML(userData );
    const apiUrl = `${config.apiUrl}/transactions?email=${config.email}&token=${config.token}`;
    const headers = {
        'Content-Type': 'application/xml'
    };
    const options = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl,
        headers: headers,
        data: xmlData
    };

    console.log("vamos tentar criar um boleto")
    return new Promise((resolve, reject) => {
        axios.request(options)
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
};
