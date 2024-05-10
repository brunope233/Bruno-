const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

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
app.post('/process-payment', (req, res) => {
  const { itemData, paymentOptions } = req.body;

  // Configuração do PagSeguro
  const emailPagSeguro = 'brunodlm9@gmail.com';
  const tokenPagSeguro = 'A7401550F74A4E2D97F3F84B128572C6';

  // Fazer a requisição para a API do PagSeguro usando o axios
  axios.post('https://sandbox.pagseguro.uol.com.br/checkout/v2/', {
    email: emailPagSeguro,
    token: tokenPagSeguro,
    currency: 'BRL',
    itemId1: itemData.itemId,
    itemDescription1: itemData.itemDescription,
    itemAmount1: itemData.itemAmount,
    itemQuantity1: itemData.itemQuantity,
    paymentMethod: paymentOptions.paymentMethod,
    receiverEmail: paymentOptions.receiverEmail
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
    .then(response => {
      const { data } = response;
      console.log('Resposta da API do PagSeguro:', data);

      let paymentDetails = {
        success: false,
        paymentMethod: paymentOptions.paymentMethod
      };

      // Verificar o método de pagamento selecionado
      if (paymentOptions.paymentMethod === 'creditCard') {
        // Processar pagamento com cartão de crédito
        const creditCardData = {
          // Dados do cartão de crédito
          // ...
        };
        // Lógica para processar o pagamento com cartão de crédito
        // ...
        paymentDetails.success = true;
      } else if (paymentOptions.paymentMethod === 'pix') {
        // Extrair o código Pix da resposta da API do PagSeguro
        const pixCode = data.code;
        console.log('Código Pix:', pixCode);
        paymentDetails.success = true;
        paymentDetails.pixCode = pixCode;
      } else if (paymentOptions.paymentMethod === 'boleto') {
        // Extrair a URL do boleto da resposta da API do PagSeguro
        const boletoUrl = data.paymentLink;
        console.log('URL do Boleto:', boletoUrl);
        paymentDetails.success = true;
        paymentDetails.boletoUrl = boletoUrl;
      }

      // Enviar os detalhes do pagamento de volta para o cliente
      res.json(paymentDetails);
    })
    .catch(error => {
      console.error('Erro na requisição para a API do PagSeguro:', error);
      res.status(500).json({ success: false, error: 'Ocorreu um erro no processamento do pagamento.' });
    });
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