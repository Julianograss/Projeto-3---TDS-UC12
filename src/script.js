const botaoCadastrar = document.querySelector('.btn-submit');
const tabela = document.querySelector('#lista-tarefas');
let linhaEditando = null;

function atualizarRelogio() {
    const tasks = document.querySelectorAll('.task-item:not(.completed)');
    const agora = new Date();
    const dia = String(agora.getDay()).padStart(2, '0');
    const mes = String(agora.getMonth()).padStart(2, '0');
    const ano = String(agora.getFullYear()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    const segundo = String(agora.getSeconds()).padStart(2, '0');

      tasks.forEach(task => {
        const datetimeStr = task.dataset.datetime;
        if (!datetimeStr) return;
        
        const taskDate = new Date(datetimeStr);
        const diffMs = taskDate - now;
        const diffHours = diffMs / (1000 * 60 * 60);

        task.classList.remove('urgency-safe', 'urgency-warning', 'urgency-critical', 'urgency-overdue', 'is-due-now');

        if (diffHours <= 0) {
            task.classList.add('urgency-overdue'); 
            task.classList.add('is-due-now');     
        } else if (diffHours <= 2) {
            task.classList.add('urgency-critical'); 
        } else if (diffHours <= 24) {
            task.classList.add('urgency-warning'); 
        } else {
            task.classList.add('urgency-safe'); 
        }
    });
}
let dataAtual = setInterval(atualizarRelogio, 1000);

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('data').value = '';
    document.getElementById('hora').value = '';
    document.querySelectorAll('input[name="prioridade"]').forEach(function(opcao) {
        opcao.checked = false;
    });
    if (botaoCadastrar) {
        botaoCadastrar.textContent = 'Cadastrar tarefa';
    }
    linhaEditando = null;
}
function validarFormulario(nome, descricao, prioridade, data, hora) {
    if (!nome.trim() || !descricao.trim() || !prioridade || !data || !hora) {
        alert('Preencha todos os campos do formulário');
        return false;
    }
    return true;
}
function formatarPrazo(data, hora) {
    if (!data || !hora) {
        return '';
    }
    const partes = data.split('-');
    return `Prazo: ${partes[2]}/${partes[1]}/${partes[0]} ate ${hora}`;
}
function criarLinhaTarefa(nome, prioridade, descricao, data, hora, status = 'Pendente') {
    const novaLinha = document.createElement('tr');
    novaLinha.dataset.descricao = descricao;
    novaLinha.dataset.data = data;
    novaLinha.dataset.hora = hora;
    novaLinha.dataset.status = status;

    const celulaNome = document.createElement('td');
    const celulaPrioridade = document.createElement('td');
    const celulaDescricao = document.createElement('td');
    const celulaStatus = document.createElement('td');
    const celulaDataHora = document.createElement('td');
    const celulaAcoes = document.createElement('td');

    celulaNome.textContent = nome;
    
    const cores = {
        baixa: '#81c784',
        media: '#ffd54f',
        alta: '#e57373'
    };
    celulaPrioridade.textContent = prioridade;
    celulaPrioridade.style.color = cores[prioridade] || 'transparent';
    celulaPrioridade.style.fontWeight = 'bold';
    celulaPrioridade.style.borderRadius = '8px';
    celulaPrioridade.style.textAlign = 'center';
    
    celulaDescricao.textContent = descricao;
    celulaStatus.textContent = status;
    celulaStatus.className = `status-cell status-${status.toLowerCase()}`;
    celulaDataHora.textContent = formatarPrazo(data, hora);
    celulaAcoes.innerHTML = `
        <button class="btn-concluir" type="button">Concluir</button>
        <button class="btn-editar" type="button">Editar</button>
        <button class="btn-excluir" type="button">Excluir</button>
    `;

    novaLinha.appendChild(celulaNome);
    novaLinha.appendChild(celulaPrioridade);
    novaLinha.appendChild(celulaDescricao);
    novaLinha.appendChild(celulaStatus);
    novaLinha.appendChild(celulaDataHora);
    novaLinha.appendChild(celulaAcoes);

    return novaLinha;
}
function preencherFormulario(nome, prioridade, descricao, data, hora) {
    document.getElementById('nome').value = nome;
    document.getElementById('descricao').value = descricao;
    document.getElementById('data').value = data;
    document.getElementById('hora').value = hora;
    document.querySelectorAll('input[name="prioridade"]').forEach(function(opcao) {
        opcao.checked = opcao.value === prioridade;
    });
    if (botaoCadastrar) {
        botaoCadastrar.textContent = 'Salvar alterações';
    }
}
function atualizarStatusLinha(linha, novoStatus) {
    linha.dataset.status = novoStatus;
    const celulaStatus = linha.children[3];
    celulaStatus.textContent = novoStatus;
    celulaStatus.className = `status-cell status-${novoStatus.toLowerCase()}`;
    if (celulaDataHora === dataAtual || novoStatus < dataAtual){
        celulaStatus.className = `status-cell status-incompleta`;
    }
}
function adicionarOuEditarTarefa(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const prioridadeInput = document.querySelector('input[name="prioridade"]:checked');
    const prioridade = prioridadeInput ? prioridadeInput.value : '';

    if (!validarFormulario(nome, descricao, prioridade, data, hora)) {
        return;
    }

    const cores = {
        baixa: '#81c784',
        media: '#ffd54f',
        alta: '#e57373'
    };

    if (linhaEditando) {
        linhaEditando.children[0].textContent = nome;
        linhaEditando.children[1].textContent = prioridade;
        linhaEditando.children[1].style.color = cores[prioridade] || 'transparent';
        linhaEditando.children[2].innerHTML = descricao;
        linhaEditando.dataset.descricao = descricao;
        linhaEditando.dataset.data = data;
        linhaEditando.dataset.hora = hora;
        limparFormulario();
        return;
    }
    const novaLinha = criarLinhaTarefa(nome, prioridade, descricao, data, hora);
    tabela.appendChild(novaLinha);
    limparFormulario();
}
function eventosBtns(event) {
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
        const descricao = linha.dataset.descricao || linha.children[2].textContent;
        const data = linha.dataset.data || '';
        const hora = linha.dataset.hora || '';
        preencherFormulario(nome, prioridade, descricao, data, hora);
        linhaEditando = linha;
        return;
    }
    if (botao.classList.contains('btn-concluir')) {
        atualizarStatusLinha(linha, 'Concluída');
        return;
    }
}
if (botaoCadastrar) {
    botaoCadastrar.addEventListener('click', adicionarOuEditarTarefa);
}
if (tabela) {
    tabela.addEventListener('click', eventosBtns);
}
