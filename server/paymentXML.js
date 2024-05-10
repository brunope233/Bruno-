// paymentXML.js
module.exports = function createPaymentXML(userData , sessionData , cardTokenData) {
    const { name, email, areaCode, phoneNumber, cpf, birthDate, cardHolderName, cardCPF } = userData;

    const xmlData = `
        <payment>
            <mode>default</mode>
            <method>creditCard</method>
            <sender>
                <name>${name}</name>
                <email>${email}</email>
                <phone>
                    <areaCode>${areaCode}</areaCode>
                    <number>${phoneNumber}</number>
                </phone>
                <documents>
                    <document>
                        <type>CPF</type>
                        <value>${cpf}</value>
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
            <extraAmount>0.00</extraAmount>
            <reference>R123478</reference>
            <shipping>
                <addressRequired>false</addressRequired>
            </shipping>
            <creditCard>
                <token>${cardTokenData}</token>
                <installment>
                    <noInterestInstallmentQuantity>3</noInterestInstallmentQuantity>
                     <quantity>1</quantity>
                    <value>1.00</value>
                </installment>
                <holder>
                    <name>${cardHolderName}</name>
                    <documents>
                        <document>
                            <type>CPF</type>
                            <value>${cardCPF}</value>
                        </document>
                    </documents>
                    <birthDate>${birthDate}</birthDate>
                    <phone>
                        <areaCode>${areaCode}</areaCode>
                        <number>${phoneNumber}</number>
                    </phone>
                </holder>
                <billingAddress>
                    <street>Av. Brigadeiro Faria Lima</street>
                    <number>1384</number>
                    <complement>1 andar</complement>
                    <district>Jardim Paulistano</district>
                    <city>Sao Paulo</city>
                    <state>SP</state>
                    <country>BRA</country>
                    <postalCode>01452002</postalCode>
                </billingAddress>
            </creditCard>
        </payment>
    `;

    return xmlData;
};
