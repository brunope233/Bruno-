const { exec } = require('child_process');
const xml2js = require('xml2js');

module.exports = function makeSlip(userData) {
    //console.log("boleto");
    let data = '<payment>\r\n    <mode>default</mode>\r\n    <method>boleto</method>\r\n    <sender>\r\n        <name>Daniel Medeiros</name>\r\n        <email>danielmmf@gmail.com</email>\r\n        <phone>\r\n            <areaCode>11</areaCode>\r\n            <number>994458797</number>\r\n        </phone>\r\n        <documents>\r\n            <document>\r\n                <type>CPF</type>\r\n                <value>22111944785</value>\r\n            </document>\r\n        </documents>\r\n    </sender>\r\n    <currency>BRL</currency>\r\n    <notificationURL>https://webhook.site/78c82ba0-64bc-4eca-9c6e-8b1f938323bd</notificationURL>\r\n    <items>\r\n        <item>\r\n            <id>1</id>\r\n            <description>Notebook Prata</description>\r\n            <quantity>1</quantity>\r\n            <amount>1.00</amount>\r\n        </item>\r\n    </items>\r\n    <extraAmount>0.00</extraAmount>\r\n    <reference>R123456</reference>\r\n    <shipping>\r\n        <addressRequired>false</addressRequired>\r\n    </shipping>\r\n</payment>';

    let curlCommand = `curl -X POST "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=brunodlm9@gmail.com&token=A7401550F74A4E2D97F3F84B128572C6" \
      -H "Content-Type: application/xml" \
      -d '${data}'`;

    console.log("Comando curl:", curlCommand); // Log do comando curl

    return new Promise((resolve, reject) => {
        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar o comando: ${error}`);
                console.error(`stderr: ${stderr}`);
                reject(error);
                return;
            }
            console.log("Resposta do comando curl:", stdout);
            
            // Parse XML response
            xml2js.parseString(stdout, (err, result) => {
                if (err) {
                    console.error(`Erro ao fazer parse do XML: ${err}`);
                    reject(err);
                    return;
                }
                
                // Verifique se o objeto result tem a estrutura correta
                if (result && result.transaction && result.transaction.paymentLink) {
                    // Extrair o link do boleto
                    const paymentLink = result.transaction.paymentLink[0];
                    console.log("paymentLink:", paymentLink);
                    resolve(paymentLink);
                } else {
                    console.error("Estrutura do objeto result não é conforme o esperado");
                    reject("Estrutura do objeto result não é conforme o esperado");
                }
            });
        });
    });
};
