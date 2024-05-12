<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=brunodlm9%40gmail.com&token=A7401550F74A4E2D97F3F84B128572C6',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'<payment>
    <mode>default</mode>
    <method>boleto</method>
    <sender>
        <name>Daniel Medeiros</name>
        <email>danielmmf@gmail.com</email>
        <phone>
            <areaCode>11</areaCode>
            <number>994458797</number>
        </phone>
        <documents>
            <document>
                <type>CPF</type>
                <value>22111944785</value>
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
    <reference>R123456</reference>
    <shipping>
        <addressRequired>false</addressRequired>
    </shipping>
</payment>',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/xml'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
