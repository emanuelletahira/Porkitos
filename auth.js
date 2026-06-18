// ===== CONFIGURAÇÃO DO GOOGLE SHEETS =====
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRymbMvDEoA8nCYEKqYgEkINEI1PxEI4MfzJnm0HhkFp3BFZqm2xiOQ73og-HnAu1WIDxRt9zLHo2Yi/pub?output=csv';

// ===== CONFIGURAÇÃO DO GOOGLE APPS SCRIPT =====
// URL do Google Apps Script para salvar cadastros
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfmvsLomUd-SBJ9-IvhoLH1uj8aCtgWnCFfaduoTYJeHvIVLsqHaWBV5W4Q4AJDNKH/exec';

// ===== VARIÁVEIS GLOBAIS =====
let usuariosData = [];
let usuarioLogado = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Se está na página de login
    if (document.getElementById('loginForm')) {
        inicializarLogin();
    } else {
        // Se está em qualquer outra página, verificar autenticação
        verificarAutenticacao();
        adicionarBotaoLogout();
    }
});

// ===== PROTEÇÃO DE ROTAS =====
function verificarAutenticacao() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        // Redirecionar para login
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// ===== FUNÇÕES DE LOGIN =====
function inicializarLogin() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            fazerLogin();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            fazerCadastro();
        });
    }

    // Carregar dados dos usuários do Google Sheets
    carregarUsuarios();
}

function toggleForms(event) {
    event.preventDefault();
    
    const loginBox = document.getElementById('loginBox');
    const signupBox = document.getElementById('signupBox');

    loginBox.classList.toggle('active');
    signupBox.classList.toggle('active');

    // Limpar mensagens
    limparMensagens();
}

async function carregarUsuarios() {
    try {
        const response = await fetch(SHEET_URL);
        
        if (!response.ok) {
            console.error('Status:', response.status);
            throw new Error('Erro ao acessar Google Sheets');
        }

        const csv = await response.text();
        
        // Parsear CSV
        const linhas = csv.trim().split('\n');
        usuariosData = [];

        // Pular cabeçalho e processar dados
        for (let i = 1; i < linhas.length; i++) {
            const partes = linhas[i].split(',');
            
            if (partes.length >= 3) {
                const email = partes[0].trim().toLowerCase();
                const nome = partes[1].trim();
                const senha = partes[2].trim();
                
                if (email && nome && senha) {
                    usuariosData.push({
                        email: email,
                        nome: nome,
                        senha: senha,
                        dataCadastro: new Date().toLocaleDateString('pt-BR')
                    });
                }
            }
        }

        console.log(`✓ ${usuariosData.length} usuários carregados do Google Sheets`);
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
        mostrarMensagem('loginMessage', 
            'Erro ao conectar com Google Sheets. Verifique a configuração.', 
            'error'
        );
    }
}

function fazerLogin() {
    const email = document.getElementById('loginEmail').value.toLowerCase().trim();
    const senha = document.getElementById('loginPassword').value;

    // Validar campos
    if (!email || !senha) {
        mostrarMensagem('loginMessage', 'Por favor, preencha todos os campos.', 'error');
        return;
    }

    // Buscar usuário nos dados carregados
    const usuario = usuariosData.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        // Login bem-sucedido
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        mostrarMensagem('loginMessage', 'Login realizado com sucesso! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        mostrarMensagem('loginMessage', 'Email ou senha incorretos.', 'error');
        document.getElementById('loginPassword').value = '';
    }
}

async function fazerCadastro() {
    const nome = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.toLowerCase().trim();
    const senha = document.getElementById('signupPassword').value;
    const senhaConfirm = document.getElementById('signupPasswordConfirm').value;

    // Validações
    if (!nome || !email || !senha || !senhaConfirm) {
        mostrarMensagem('signupMessage', 'Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem('signupMessage', 'A senha deve ter no mínimo 6 caracteres.', 'error');
        return;
    }

    if (senha !== senhaConfirm) {
        mostrarMensagem('signupMessage', 'As senhas não correspondem.', 'error');
        return;
    }

    if (!validarEmail(email)) {
        mostrarMensagem('signupMessage', 'Email inválido.', 'error');
        return;
    }

    // Verificar se email já existe
    if (usuariosData.some(u => u.email === email)) {
        mostrarMensagem('signupMessage', 'Este email já está cadastrado.', 'error');
        return;
    }

    // Criar novo usuário
    const novoUsuario = {
        email: email,
        nome: nome,
        senha: senha,
        dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    // Salvar no Google Sheets via Google Apps Script
    try {
        mostrarMensagem('signupMessage', 'Cadastrando usuário...', 'success');
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(novoUsuario)
        });

        const responseText = await response.text();
        console.log('Resposta do servidor:', responseText);
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('Erro ao parsear JSON:', e);
            result = { success: false, error: 'Resposta inválida do servidor' };
        }

        if (result.success) {
            // Adicionar aos dados locais também
            usuariosData.push(novoUsuario);
            
            mostrarMensagem('signupMessage', 
                'Cadastro realizado com sucesso! Você será redirecionado para login...', 
                'success'
            );

            setTimeout(() => {
                // Limpar formulário
                document.getElementById('signupForm').reset();
                toggleForms(new Event('click'));
                document.getElementById('loginEmail').value = email;
                mostrarMensagem('loginMessage', 'Cadastro concluído! Faça login com sua senha.', 'success');
            }, 1500);
        } else {
            mostrarMensagem('signupMessage', result.error || 'Erro ao cadastrar usuário.', 'error');
        }
    } catch (erro) {
        console.error('Erro ao salvar cadastro:', erro);
        mostrarMensagem('signupMessage', 
            'Erro ao conectar com o servidor. Tente novamente.', 
            'error'
        );
    }
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarMensagem(elementId, mensagem, tipo) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.textContent = mensagem;
        messageDiv.className = `form-message show ${tipo}`;
        
        // Auto-remover mensagem de sucesso após 5 segundos
        if (tipo === 'success') {
            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 5000);
        }
    }
}

function limparMensagens() {
    const messages = document.querySelectorAll('.form-message');
    messages.forEach(msg => msg.classList.remove('show'));
}

// ===== FUNÇÕES PARA PÁGINAS PROTEGIDAS =====
function adicionarBotaoLogout() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado) {
        // Criar elemento de logout se não existir
        let logoutContainer = document.getElementById('logoutContainer');
        
        if (!logoutContainer) {
            logoutContainer = document.createElement('div');
            logoutContainer.id = 'logoutContainer';
            logoutContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 12px;
                background: white;
                padding: 10px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            `;
            
            logoutContainer.innerHTML = `
                <span style="color: #6b7280; font-size: 14px;">
                    Olá, <strong>${usuarioLogado.nome}</strong>
                </span>
                <button id="logoutBtn" style="
                    padding: 6px 12px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.3s;
                ">
                    Sair
                </button>
            `;
            
            document.body.appendChild(logoutContainer);
            
            document.getElementById('logoutBtn').addEventListener('click', fazerLogout);
            
            // Adicionar estilos hover
            document.getElementById('logoutBtn').addEventListener('mouseover', function() {
                this.style.background = '#dc2626';
                this.style.transform = 'translateY(-1px)';
            });
            
            document.getElementById('logoutBtn').addEventListener('mouseout', function() {
                this.style.background = '#ef4444';
                this.style.transform = 'translateY(0)';
            });
        }
    }
}

function fazerLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    }
}

// ===== PROTEÇÃO CONTRA ACESSO DIRETO =====
// Se tentar acessar uma página protegida sem estar logado, será redirecionado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('loginForm') && !document.getElementById('signupForm')) {
            verificarAutenticacao();
        }
    });
} else {
    if (!document.getElementById('loginForm') && !document.getElementById('signupForm')) {
        verificarAutenticacao();
    }
}
