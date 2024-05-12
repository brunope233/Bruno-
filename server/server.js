const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const xml2js = require('xml2js');

const makePayment = require('./paymentRequest');
const makeSession = require('./sessionRequest');
const cardTokenRequest = require('./cardTokenRequest');

const makeSlip = require('./slipRequest');

const app = express();

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Middleware para permitir solicitações CORS
app.use(cors());

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Endpoint para processar o pagamento
app.post('/process-payment', async (req, res) => {
  const { itemData, paymentOptions, userData } = req.body;

  if (paymentOptions.paymentMethod === 'creditCard') {
    //console.log(userData);

    try {
      // Obter a sessão antes de fazer o pagamento
      const sessionData = await makeSession();
      console.log("Dados da sessao");
      console.log(sessionData);
      console.log("===============");

      const cardTokenData = await cardTokenRequest(sessionData, userData)
      console.log("Dados do Cartão");
      console.log(cardTokenData);
      console.log("===============");

      // Fazer o pagamento
      const paymentResponse = await makePayment(userData, sessionData, cardTokenData);
      const processXMLData = (xmlData) => {
        // Use o xml2js para analisar a resposta XML
        const parser = new xml2js.Parser({ explicitArray: false });
        
        // Analise a resposta XML e processe os dados após a conclusão
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Erro ao analisar XML:', err);
            } else {
                // Extraia os campos relevantes do resultado
                const code = result.transaction.code;
                const reference = result.transaction.reference;
    
                // Exiba os dados
                console.log('Dados da compra:');
                console.log('Código:', code);
                console.log('Referência:', reference);
    
                // Salve os dados no localStorage, se necessário
                const transactionList = JSON.parse(localStorage.getItem('transactions')) || [];
                transactionList.push({ code, reference });
                localStorage.setItem('transactions', JSON.stringify(transactionList));
            }
        });
    };
    

    if (typeof paymentResponse === 'string') {
      console.log(paymentResponse);
      processXMLData(paymentResponse);
  } else {
      console.error('A respostaXML não é uma string:', paymentResponse);
  }


      res.json(paymentResponse);
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      res.status(500).json({ success: false, error: 'Ocorreu um erro no processamento do pagamento.' });
    }
  }
});



app.post('/process-payment-pix', async (req, res) => {
  const { itemData, paymentOptions } = req.body;

  if (paymentOptions.paymentMethod === 'pix') {
    //console.log(userData);
    console.log("pagando com pix");
    const sessionData = await makeSession();
    console.log("Dados da sessao");
    console.log(sessionData);
    console.log("===============");

    const cardTokenData = await cardTokenRequest(sessionData, userData)
    console.log("Dados do Cartão");
    console.log(cardTokenData);
    console.log("===============");

    // Fazer o pagamento
    //const paymentResponse = await makePayment(userData, sessionData, cardTokenData);
  }
});


app.post('/process-payment-boleto', async (req, res) => {
  const { itemData, paymentOptions, userData } = req.body;
  console.log("pagando com boleto backend");

    //console.log(userData);
   // console.log("Dados da sessao");
    // const sessionData = await makeSession();
   
    // console.log(sessionData);
    // console.log("===============");

    // const cardTokenData = await cardTokenRequest(sessionData, userData)
    // console.log("Dados do Cartão");
    // console.log(cardTokenData);
    // console.log("===============");

    // Fazer o pagamento
    const paymentResponse = await makeSlip(userData);
    console.log("===============Fazer o Boleto");
    console.log(paymentResponse);
    res.json({ paymentLink: paymentResponse }); 
});

// Endpoint para receber notificações de pagamento do PagSeguro
app.post('/notification', (req, res) => {
  const notificationCode = req.body.notificationCode;

  // Verificar a autenticidade da notificação (exemplo de código)
  const isNotificationAuthentic = verifyNotificationAuthenticity(notificationCode);

  if (!isNotificationAuthentic) {
    console.log('Notificação inválida recebida.');
    res.status(400).end();
    return;
  }

  // Consultar a API do PagSeguro para obter os detalhes da transação
  axios.get(`https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}`, {
    params: {
      email: emailPagSeguro,
      token: tokenPagSeguro
    }
  })
    .then(response => {
      const transactionData = response.data;
      const transactionStatus = transactionData.status;

      // Atualizar o status do pagamento no banco de dados
      updatePaymentStatus(transactionData.reference, transactionStatus);

      // Verificar o status da transação e realizar ações adicionais, se necessário
      if (transactionStatus === '3') {
        // Pagamento aprovado
        console.log('Pagamento aprovado. Liberar acesso ao conteúdo.');
        // Lógica para liberar o acesso ao conteúdo para o usuário
        // ...
      } else if (transactionStatus === '7') {
        // Pagamento cancelado
        console.log('Pagamento cancelado. Revogar acesso ao conteúdo.');
        // Lógica para revogar o acesso ao conteúdo do usuário
        // ...
      }

      res.status(200).end();
    })
    .catch(error => {
      console.error('Erro ao consultar a API do PagSeguro para obter detalhes da transação:', error);
      res.status(500).end();
    });
});

// Função para verificar a autenticidade da notificação (exemplo de código)
function verifyNotificationAuthenticity(notificationCode) {
  // Lógica para verificar a autenticidade da notificação recebida do PagSeguro
  // Consulte a documentação do PagSeguro para obter mais informações sobre como fazer essa verificação
  // ...

  // Retorne true se a notificação for autêntica, ou false caso contrário
  return true;
}

// Função para atualizar o status do pagamento no banco de dados (exemplo de código)
function updatePaymentStatus(reference, status) {
  // Lógica para atualizar o status do pagamento no banco de dados com base na referência e no status recebidos
  // ...
}

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});