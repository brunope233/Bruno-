// Função para iniciar o processo de pagamento
function iniciarPagamento() {
  // Obter informações do produto ou serviço
  const produtoDescricao = 'Curso Online: Perda de Peso Após a Menopausa';
  const produtoValor = 99.99; // Valor em reais

  // Criar objeto de dados do item
  const itemData = {
    itemId: '0001',
    itemDescription: produtoDescricao,
    itemAmount: produtoValor.toFixed(2),
    itemQuantity: 1
  };

  // Configurar opções de pagamento
  const paymentOptions = {
    paymentMode: 'default',
    paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
    receiverEmail: 'brunodlm9@gmail.com'
  };

  // Fazer uma chamada para o endpoint do servidor
  fetch('http://localhost:3000/process-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      itemData: itemData,
      paymentOptions: paymentOptions
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta do servidor:', data);

      if (data.success) {
        // Pagamento processado com sucesso
        if (data.paymentMethod === 'pix') {
          document.getElementById('pix-code').value = data.pixCode;
          document.getElementById('payment-instructions').textContent = 'Escaneie o código QR ou copie o código Pix abaixo para efetuar o pagamento:';
        } else if (data.paymentMethod === 'boleto') {
          document.getElementById('boleto-url').value = data.boletoUrl;
          document.getElementById('payment-instructions').textContent = 'Clique no link abaixo para visualizar e imprimir o boleto:';
        }

        // Exibir mensagem de sucesso e orientações de pagamento
        const paymentStatus = document.getElementById('payment-status');
        if (paymentStatus) {
          paymentStatus.textContent = 'Pagamento processado com sucesso!';
        }

        const paymentDetails = document.getElementById('payment-details');
        if (paymentDetails) {
          paymentDetails.style.display = 'block';
        }

        // Limpar campos do formulário de pagamento
        document.getElementById('card-number').value = '';
        document.getElementById('card-expiry').value = '';
        document.getElementById('card-cvv').value = '';
      } else {
        // Ocorreu um erro no processamento do pagamento
        exibirMensagemDeErro('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente mais tarde.');
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
      exibirMensagemDeErro('Ocorreu um erro na requisição. Por favor, tente novamente mais tarde.');
    });
}

// Função para conceder acesso ao curso após o pagamento bem-sucedido
function concederAcessoAoCurso() {
  // Verificar se o usuário está autenticado
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // Usuário autenticado, conceder acesso ao curso
      user.acessoPago = true;
      // Adicionar outras ações necessárias, como atualizar a interface do usuário, exibir os módulos do curso, etc.
      console.log('Acesso ao curso concedido');
    } else {
      // Usuário não autenticado, redirecionar para a página de login
      window.location.href = '/login.html';
    }
  });
}

// Função para exibir mensagem de erro
function exibirMensagemDeErro(erro) {
  const paymentStatus = document.getElementById('payment-status');
  if (paymentStatus) {
    paymentStatus.textContent = erro;
  }

  const paymentDetails = document.getElementById('payment-details');
  if (paymentDetails) {
    paymentDetails.style.display = 'none';
  }
}

// Função para copiar o código Pix
function copyPixCode() {
  const pixCode = document.getElementById('pix-code');
  pixCode.select();
  pixCode.setSelectionRange(0, 99999); // Para dispositivos móveis
  document.execCommand('copy');
  alert('Código Pix copiado para a área de transferência!');
}

// Função para copiar a URL do boleto
function copyBoletoUrl() {
  const boletoUrl = document.getElementById('boleto-url');
  boletoUrl.select();
  boletoUrl.setSelectionRange(0, 99999); // Para dispositivos móveis
  document.execCommand('copy');
  alert('URL do boleto copiada para a área de transferência!');
}

// Esperar o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar ouvinte de eventos para o botão de pagamento
  const btnPagar = document.getElementById('btnPagar');
  if (btnPagar) {
    btnPagar.addEventListener('click', iniciarPagamento);
  }

  // Adicionar ouvinte de eventos para os campos de seleção de método de pagamento
  const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
      const paymentFormContainer = document.getElementById('payment-form-container');
      if (paymentFormContainer) {
        paymentFormContainer.innerHTML = '';

        // Exibir o formulário de pagamento correto com base no método selecionado
        if (selectedPaymentMethod === 'creditCard') {
          paymentFormContainer.innerHTML = `
            <h3>Pagamento com Cartão de Crédito</h3>
            <div class="form-group">
              <label for="card-number">Número do Cartão</label>
              <input type="text" class="form-control" id="card-number" placeholder="0000 0000 0000 0000" required>
            </div>
            <div class="form-group">
              <label for="card-expiry">Data de Validade</label>
              <input type="text" class="form-control" id="card-expiry" placeholder="MM/AA" required>
            </div>
            <div class="form-group">
              <label for="card-cvv">CVV</label>
              <input type="text" class="form-control" id="card-cvv" placeholder="CVV" required>
            </div>
          `;
        } else if (selectedPaymentMethod === 'pix') {
          paymentFormContainer.innerHTML = `
            <h3>Pagamento com Pix</h3>
            <p>Ao confirmar o pagamento, você receberá o código Pix para efetuar o pagamento.</p>
          `;
        } else if (selectedPaymentMethod === 'boleto') {
          paymentFormContainer.innerHTML = `
            <h3>Pagamento com Boleto Bancário</h3>
            <p>Ao confirmar o pagamento, você receberá o link para impressão do boleto.</p>
          `;
        }
      }
    });
  });
});