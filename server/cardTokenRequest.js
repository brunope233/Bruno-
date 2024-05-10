const axios = require('axios');
const qs = require('qs');
const config = require('./config');

module.exports = function cardTokenRequest(sessionId, userData) {
    const data = qs.stringify({
        'sessionId': sessionId,
        'amount':100,
        'cardNumber': userData.cardNumber,
        'cardBrand': userData.cardBrand,
        'cardCvv': userData.cardCvv,
        'cardExpirationMonth': userData.cardExpirationMonth,
        'cardExpirationYear': userData.cardExpirationYear
    });

    console.log(data);
    console.log(userData);
    

    const requestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://df.uol.com.br/v2/cards',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    return new Promise((resolve, reject) => {
        axios.request(requestConfig)
            .then((response) => {
                //console.log(response);
                resolve(response.data.token);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
};
