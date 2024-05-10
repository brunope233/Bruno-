// paymentRequest.js
const axios = require('axios');
const createPaymentXML = require('./paymentXML');
const config = require('./config');

module.exports = function makePayment(userData , sessionData , cardTokenData) {
    const xmlData = createPaymentXML(userData , sessionData , cardTokenData);
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

    axios.request(options)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
};
