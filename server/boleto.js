const { exec } = require('child_process');

// Comando curl
const curlCommand = `curl -X POST "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=brunodlm9%40gmail.com&token=A7401550F74A4E2D97F3F84B128572C6" \
  -H "Content-Type: application/xml" \
  -d '<payment>\
    <mode>default</mode>\
    <method>boleto</method>\
    <sender>\
        <name>Daniel Medeiros</name>\
        <email>danielmmf@gmail.com</email>\
        <phone>\
            <areaCode>11</areaCode>\
            <number>994458797</number>\
        </phone>\
        <documents>\
            <document>\
                <type>CPF</type>\
                <value>22111944785</value>\
            </document>\
        </documents>\
    </sender>\
    <currency>BRL</currency>\
    <notificationURL>https://webhook.site/78c82ba0-64bc-4eca-9c6e-8b1f938323bd</notificationURL>\
    <items>\
        <item>\
            <id>1</id>\
            <description>Notebook Prata</description>\
            <quantity>1</quantity>\
            <amount>1.00</amount>\
        </item>\
    </items>\
    <extraAmount>0.00</extraAmount>\
    <reference>R123456</reference>\
    <shipping>\
        <addressRequired>false</addressRequired>\
    </shipping>\
</payment>'`;

// Executar o comando curl
exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o comando: ${error}`);
    return;
  }

  // Exibir a resposta
  console.log('Resposta do servidor:', stdout);
});
