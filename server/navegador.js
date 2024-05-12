// WARNING: For POST requests, body is set to null by browsers.
var data = "<payment>\r\n    <mode>default</mode>\r\n    <method>boleto</method>\r\n    <sender>\r\n        <name>Daniel Medeiros</name>\r\n        <email>danielmmf@gmail.com</email>\r\n        <phone>\r\n            <areaCode>11</areaCode>\r\n            <number>994458797</number>\r\n        </phone>\r\n        <documents>\r\n            <document>\r\n                <type>CPF</type>\r\n                <value>22111944785</value>\r\n            </document>\r\n        </documents>\r\n    </sender>\r\n    <currency>BRL</currency>\r\n    <notificationURL>https://webhook.site/78c82ba0-64bc-4eca-9c6e-8b1f938323bd</notificationURL>\r\n    <items>\r\n        <item>\r\n            <id>1</id>\r\n            <description>Notebook Prata</description>\r\n            <quantity>1</quantity>\r\n            <amount>1.00</amount>\r\n        </item>\r\n    </items>\r\n    <extraAmount>0.00</extraAmount>\r\n    <reference>R123456</reference>\r\n    <shipping>\r\n        <addressRequired>false</addressRequired>\r\n    </shipping>\r\n</payment>";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=brunodlm9%40gmail.com&token=A7401550F74A4E2D97F3F84B128572C6");
xhr.setRequestHeader("Content-Type", "application/xml");

xhr.send(data);