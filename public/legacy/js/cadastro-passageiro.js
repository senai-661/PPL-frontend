// ===== VALIDAÇÕES E MANIPULAÇÃO DO FORMULÁRIO =====

// Toggle de visibilidade da senha
function toggleSenha() {
    const campo = document.getElementById('senha');
    const tipo = campo.type === 'password' ? 'text' : 'password';
    campo.type = tipo;
}

function toggleConfirmaSenha() {
    const campo = document.getElementById('confirmaSenha');
    const tipo = campo.type === 'password' ? 'text' : 'password';
    campo.type = tipo;
}

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Validação de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validação de senha forte
function validarSenha(senha) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
}

// Validação de telefone
function validarTelefone(telefone) {
    const regex = /^(\(\d{2}\)\s?)?9?\d{4}-?\d{4}$/;
    return regex.test(telefone);
}

// Máscara para CPF
document.getElementById('cpf')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    e.target.value = value;
});

// Máscara para Telefone
document.getElementById('telefone')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    e.target.value = value;
});

// Máscara para CEP
document.getElementById('cep')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
});

// Buscar CEP (simulado)
function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP inválido! Deve conter 8 dígitos.');
        return;
    }

    // Simulação de busca de CEP
    // Em um projeto real, isso faria uma chamada a uma API
    console.log('Buscando CEP:', cep);
    
    // Exemplo de resposta simulada
    document.getElementById('rua').value = 'Rua Exemplo';
    document.getElementById('bairro').value = 'Bairro Exemplo';
    document.getElementById('cidade').value = 'São Paulo';
    document.getElementById('estado').value = 'SP';
    
    alert('CEP encontrado! Preencha os dados restantes.');
}

// Validação do formulário ao enviar
document.getElementById('formCadastro')?.addEventListener('submit', function (e) {
    e.preventDefault();
    
    let isValido = true;

    // Validar Nome
    const nome = document.getElementById('nome').value.trim();
    if (nome.length < 3) {
        document.getElementById('erroNome').textContent = 'Nome deve ter pelo menos 3 caracteres';
        isValido = false;
    } else {
        document.getElementById('erroNome').textContent = '';
    }

    // Validar Email
    const email = document.getElementById('email').value.trim();
    if (!validarEmail(email)) {
        document.getElementById('erroEmail').textContent = 'Email inválido';
        isValido = false;
    } else {
        document.getElementById('erroEmail').textContent = '';
    }

    // Validar Telefone
    const telefone = document.getElementById('telefone').value;
    if (!validarTelefone(telefone)) {
        document.getElementById('erroTelefone').textContent = 'Telefone inválido';
        isValido = false;
    } else {
        document.getElementById('erroTelefone').textContent = '';
    }

    // Validar CPF
    const cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
        document.getElementById('erroCpf').textContent = 'CPF inválido';
        isValido = false;
    } else {
        document.getElementById('erroCpf').textContent = '';
    }

    // Validar Data de Nascimento
    const nascimento = document.getElementById('nascimento').value;
    if (!nascimento) {
        document.getElementById('erroNascimento').textContent = 'Data de nascimento obrigatória';
        isValido = false;
    } else {
        const dataNascimento = new Date(nascimento);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNascimento.getFullYear();
        
        if (idade < 18) {
            document.getElementById('erroNascimento').textContent = 'Você deve ter pelo menos 18 anos';
            isValido = false;
        } else {
            document.getElementById('erroNascimento').textContent = '';
        }
    }

    // Validar CEP
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) {
        document.getElementById('erroCep').textContent = 'CEP inválido';
        isValido = false;
    } else {
        document.getElementById('erroCep').textContent = '';
    }

    // Validar Senha
    const senha = document.getElementById('senha').value;
    if (!validarSenha(senha)) {
        document.getElementById('erroSenha').textContent = 'Senha fraca. Use maiúsculas, números e símbolos.';
        isValido = false;
    } else {
        document.getElementById('erroSenha').textContent = '';
    }

    // Validar Confirmação de Senha
    const confirmaSenha = document.getElementById('confirmaSenha').value;
    if (senha !== confirmaSenha) {
        document.getElementById('erroConfirmaSenha').textContent = 'As senhas não conferem';
        isValido = false;
    } else {
        document.getElementById('erroConfirmaSenha').textContent = '';
    }

    // Validar Termos
    const termos = document.getElementById('termos').checked;
    if (!termos) {
        document.getElementById('erroTermos').textContent = 'Você deve aceitar os termos';
        isValido = false;
    } else {
        document.getElementById('erroTermos').textContent = '';
    }

    if (isValido) {
        // Aqui você faria a chamada para o servidor para registrar o usuário
        console.log('Formulário válido! Enviando dados...');
        alert('Cadastro realizado com sucesso!');
        // this.reset();
    }
});

// Remover mensagem de erro ao digitar
document.querySelectorAll('.form-control, .form-select').forEach(elemento => {
    elemento.addEventListener('input', function () {
        const errorId = 'erro' + this.id.charAt(0).toUpperCase() + this.id.slice(1);
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});
