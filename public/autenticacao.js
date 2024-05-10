// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOX6-6zHbqlTGZczdXx2oasiYQYEwySWk",
  authDomain: "programa-perda-de-peso.firebaseapp.com",
  databaseURL: "https://programa-perda-de-peso-default-rtdb.firebaseio.com",
  projectId: "programa-perda-de-peso",
  storageBucket: "programa-perda-de-peso.appspot.com",
  messagingSenderId: "1008797412928",
  appId: "1:1008797412928:web:623959c0219653bb5e39a5",
  measurementId: "G-9P8R6TGYQB"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Função para exibir o modal de login
function showLoginModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Login</h2>
      <form id="loginForm">
        <input type="email" placeholder="Email" id="loginEmail" required>
        <input type="password" placeholder="Senha" id="loginPassword" required>
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <a href="#" id="showRegisterModal">Registre-se</a></p>
    </div>
  `;

  // Adicionar evento de clique no botão de fechar
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });

  // Adicionar evento de clique fora do modal para fechá-lo
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  // Adicionar evento de envio do formulário de login
  const loginForm = modal.querySelector('#loginForm');
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        modal.remove();
      })
      .catch((error) => {
        handleAuthError(error);
      });
  });

  // Adicionar evento de clique no link de registro
  const showRegisterModal = modal.querySelector('#showRegisterModal');
  if (showRegisterModal) {
    showRegisterModal.addEventListener('click', () => {
      modal.remove();
      showRegisterModal();
    });
  }

  document.body.appendChild(modal);
}

// Função para exibir o modal de registro
function showRegisterModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Registro</h2>
      <form id="registerForm">
        <input type="email" placeholder="Email" id="registerEmail" required>
        <input type="password" placeholder="Senha" id="registerPassword" required>
        <button type="submit">Registrar</button>
      </form>
    </div>
  `;

  // Adicionar evento de clique no botão de fechar
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });

  // Adicionar evento de clique fora do modal para fechá-lo
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  // Adicionar evento de envio do formulário de registro
  const registerForm = modal.querySelector('#registerForm');
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = registerForm.registerEmail.value;
    const password = registerForm.registerPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        modal.remove();
        alert('Registro concluído com sucesso!');
      })
      .catch((error) => {
        handleAuthError(error);
      });
  });

  document.body.appendChild(modal);
}

// Função para lidar com erros de autenticação
function handleAuthError(error) {
  const errorMessage = error.message;
  alert(`Erro de autenticação: ${errorMessage}`);
}

// Função para fazer logout
function logoutUser() {
  firebase.auth().signOut()
    .then(() => {
      // Redirecionar para a página inicial ou exibir uma mensagem de sucesso
      window.location.href = 'index.html';
      alert('Você foi desconectado com sucesso!');
    })
    .catch((error) => {
      handleAuthError(error);
    });
}

// Função para verificar o status de autenticação do usuário
function checkAuthStatus(user) {
  if (user) {
    // Usuário está autenticado
    console.log('Usuário autenticado:', user.email);

    // Verificar se o usuário tem acesso pago ao curso
    // Exemplo: Verificar um atributo específico no objeto do usuário
    const userRef = firebase.database().ref('users/' + user.uid);
    userRef.once('value')
      .then((snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.acessoPago) {
          // Usuário tem acesso pago ao curso
          console.log('Usuário tem acesso pago ao curso');
          // Redirecionar para a página dos módulos do curso ou exibir o conteúdo
          window.location.href = 'modulos.html';
        } else {
          // Usuário não tem acesso pago ao curso
          console.log('Usuário não tem acesso pago ao curso');
          // Redirecionar para a página de pagamento ou exibir uma mensagem
          window.location.href = 'pagamento.html';
        }
      })
      .catch((error) => {
        console.error('Erro ao verificar acesso pago do usuário:', error);
      });
  } else {
    // Usuário não está autenticado
    console.log('Usuário não está autenticado');
    // Exibir opções de login/registro ou redirecionar para a página de login
    showLoginModal();
  }
}

// Esperar o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
  // Obter referências para os elementos de autenticação
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Adicionar ouvinte de eventos para o botão de login
  if (loginBtn) {
    loginBtn.addEventListener('click', showLoginModal);
  }

  // Adicionar ouvinte de eventos para o botão de logout (se existir)
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }

  // Verificar o estado de autenticação do usuário
  firebase.auth().onAuthStateChanged((user) => {
    checkAuthStatus(user);
  });
});