const botaoCadastrar = document.querySelector('.btn-submit');
const tabela = document.querySelector('#lista-tarefas');
let linhaEditando = null;

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('descricao').value = '';
    document.querySelectorAll('input[name="prioridade"]').forEach(function(opcao) {
        opcao.checked = false;
    });
    if (botaoCadastrar) {
        botaoCadastrar.textContent = 'Cadastrar tarefa';
    }
    linhaEditando = null;
}

function validarFormulario(nome, descricao, prioridade) {
    if (!nome.trim() || !descricao.trim() || !prioridade) {
        alert('Preencha todos os campos');
        return false;
    }
    return true;
}

function criarLinhaTarefa(nome, prioridade, descricao) {
    const novaLinha = document.createElement('tr');
    const novaCelula1 = document.createElement('td');
    const novaCelula2 = document.createElement('td');
    const novaCelula3 = document.createElement('td');
    const novaCelula4 = document.createElement('td');

    novaCelula1.textContent = nome;
    novaCelula2.textContent = prioridade;
    novaCelula3.textContent = descricao;
    novaCelula4.innerHTML = `
        <button class="btn-editar" type="button">Editar</button>
        <button class="btn-excluir" type="button">Excluir</button>
    `;

    novaLinha.appendChild(novaCelula1);
    novaLinha.appendChild(novaCelula2);
    novaLinha.appendChild(novaCelula3);
    novaLinha.appendChild(novaCelula4);

    return novaLinha;
}

function preencherFormulario(nome, prioridade, descricao) {
    document.getElementById('nome').value = nome;
    document.getElementById('descricao').value = descricao;
    document.querySelectorAll('input[name="prioridade"]').forEach(function(opcao) {
        opcao.checked = opcao.value === prioridade;
    });
    if (botaoCadastrar) {
        botaoCadastrar.textContent = 'Salvar alterações';
    }
}

function adicionarOuEditarTarefa(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const prioridadeInput = document.querySelector('input[name="prioridade"]:checked');
    const prioridade = prioridadeInput ? prioridadeInput.value : '';

    if (!validarFormulario(nome, descricao, prioridade)) {
        return;
    }

    if (linhaEditando) {
        linhaEditando.children[0].textContent = nome;
        linhaEditando.children[1].textContent = prioridade;
        linhaEditando.children[2].textContent = descricao;
        limparFormulario();
        return;
    }

    const novaLinha = criarLinhaTarefa(nome, prioridade, descricao);
    tabela.appendChild(novaLinha);
    limparFormulario();
}

function handleTabelaClick(event) {
    const botao = event.target;
    const linha = botao.closest('tr');
    if (!linha) {
        return;
    }

    if (botao.classList.contains('btn-excluir')) {
        linha.remove();
        if (linha === linhaEditando) {
            limparFormulario();
        }
        return;
    }

    if (botao.classList.contains('btn-editar')) {
        const nome = linha.children[0].textContent;
        const prioridade = linha.children[1].textContent;
        const descricao = linha.children[2].textContent;
        preencherFormulario(nome, prioridade, descricao);
        linhaEditando = linha;
    }
}

if (botaoCadastrar) {
    botaoCadastrar.addEventListener('click', adicionarOuEditarTarefa);
}

if (tabela) {
    tabela.addEventListener('click', handleTabelaClick);
}
