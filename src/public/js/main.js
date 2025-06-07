document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
  
    // Abrir modais
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'block';
    });
  
    registerBtn.addEventListener('click', () => {
      registerModal.style.display = 'block';
    });
  
    // Fechar modais
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
      });
    });
  
    // Fechar ao clicar fora do modal
    window.addEventListener('click', (event) => {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
      if (event.target === registerModal) {
        registerModal.style.display = 'none';
      }
    });
  
    // Formulário de Login
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Login bem-sucedido - redirecionar ou atualizar UI
          window.location.href = '/dashboard';
        } else {
          alert(data.message || 'Erro no login');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
      }
    });
  
    // Formulário de Cadastro
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
      };
  
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
  
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Cadastro realizado com sucesso! Faça login.');
          registerModal.style.display = 'none';
        } else {
          alert(data.message || 'Erro no cadastro');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
      }
    });
  
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
      });
    }
  });