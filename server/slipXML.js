const axios = require('axios');
const config = require('./config');

module.exports = function makeBoletoPayment(userData) {
    const data = `
        <payment>
            <mode>default</mode>
            <method>boleto</method>
            <sender>
                <name>${userData.name}</name>
                <email>${userData.email}</email>
                <phone>
                    <areaCode>${userData.areaCode}</areaCode>
                    <number>${userData.phoneNumber}</number>
                </phone>
                <documents>
                    <document>
                        <type>CPF</type>
                        <value>${userData.cpf}</value>
                    </document>
                </documents>
            </sender>
            <currency>BRL</currency>
            <notificationURL>https://webhook.site/78c82ba0-64bc-4eca-9c6e-8b1f938323bd</notificationURL>
            <items>
            <item>
                <id>1</id>
                <description>Notebook Prata</description>
                <quantity>1</quantity>
                <amount>1.00</amount>
            </item>
        </items>
            <extraAmount>${userData.extraAmount}</extraAmount>
            <reference>${userData.reference}</reference>
            <shipping>
                <addressRequired>false</addressRequired>
            </shipping>
        </payment>
    `;

    const requestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${config.apiUrl}/transactions?email=${config.email}&token=${config.token}`,
        headers: {
            'Content-Type': 'application/xml'
        },
        data: data
    };

    return new Promise((resolve, reject) => {
        axios.request(requestConfig)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
