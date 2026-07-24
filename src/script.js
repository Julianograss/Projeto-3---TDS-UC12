const botaoCadastrar = document.querySelector(".btn-submit");
const tabela = document.querySelector("#lista-tarefas");
let linhaEditando = null;

function iniciarContagemRegressiva(dataAlvo, spanTimer, botao) {
  const intervalo = setInterval(() => {
    const agora = new Date();
    const diferenca = dataAlvo - agora;

    if (diferenca <= 0) {
      clearInterval(intervalo);
      spanTimer.textContent = "";
      botao.disabled = true;
      return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    let formato = "Faltam: ";

    if (dias > 0) {
      formato += `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    } else if (horas > 0) {
      formato += `${horas}h ${minutos}m ${segundos}s`;
    } else if (minutos > 0 && formato.contains(!`${minutos}m ${segundos}s`)) {
      formato += `${minutos}m ${segundos}s`;
    } else {
      formato += `${segundos}s`;
    }

    spanTimer.textContent = formato;
  }, 1000);
  return intervalo;
}

function verificarPrazos() {
  const agora = new Date();
  const linhas = tabela.querySelectorAll("tr");
  linhas.forEach((linha) => {
    if (linha.dataset.status === "Concluida") {
      return;
    }
    const data = linha.dataset.data;
    const hora = linha.dataset.hora;

    if (!data || !hora) return;
    const prazo = new Date(`${data}T${hora}`);
    if (agora > prazo) {
      atualizarStatusLinha(linha, "Incompleta");
    } else {
      atualizarStatusLinha(linha, "Pendente");
    }
  });
  linhas.forEach((linha) => {
    const elementos = linha.querySelectorAll("td");
    if (linha.dataset.status === "Concluida") {
      elementos.forEach((td) => (td.style.backgroundColor = "#63b360"));
    } else if (linha.dataset.status === "Incompleta") {
      elementos.forEach((td) => (td.style.backgroundColor = "#e5a0a0"));
    } else {
      elementos.forEach((td) => (td.style.backgroundColor = ""));
    }
  });
}
setInterval(verificarPrazos, 1000);
function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("data").value = "";
  document.getElementById("hora").value = "";
  document
    .querySelectorAll('input[name="prioridade"]')
    .forEach(function (opcao) {
      opcao.checked = false;
    });
  if (botaoCadastrar) {
    botaoCadastrar.textContent = "Cadastrar tarefa";
  }
  linhaEditando = null;
}
function validarFormulario(nome, prioridade, data, hora) {
  if (!nome.trim() || !prioridade || !data || !hora) {
    alert("Preencha todos os campos do formulário");
    return false;
  }
  return true;
}
function formatarPrazo(data, hora) {
  if (!data || !hora) {
    return "";
  }
  const partes = data.split("-");
  return `Prazo: ${partes[2]}/${partes[1]}/${partes[0]} ate ${hora}`;
}
function criarLinhaTarefa(
  nome,
  prioridade,
  descricao,
  data,
  hora,
  status = "Pendente",
) {
  const novaLinha = document.createElement("tr");
  novaLinha.dataset.descricao = descricao;
  novaLinha.dataset.data = data;
  novaLinha.dataset.hora = hora;
  novaLinha.dataset.status = status;

  const celulaNome = document.createElement("td");
  const celulaPrioridade = document.createElement("td");
  const celulaDescricao = document.createElement("td");
  const celulaStatus = document.createElement("td");
  const celulaDataHora = document.createElement("td");
  const celulaAcoes = document.createElement("td");

  celulaNome.textContent = nome;

  const cores = {
    baixa: "#81c784",
    media: "#ffd54f",
    alta: "#e57373",
  };
  celulaPrioridade.textContent = prioridade.toUpperCase();
  celulaPrioridade.style.color = cores[prioridade] || "transparent";
  celulaPrioridade.style.fontWeight = "bold";
  celulaPrioridade.style.borderRadius = "8px";
  celulaPrioridade.style.textAlign = "center";

  celulaDescricao.textContent = descricao;
  celulaStatus.textContent = status;
  celulaStatus.className = `status-cell status-${status.toLowerCase()}`;
  celulaDataHora.innerHTML = `
    ${formatarPrazo(data, hora)}<br>
    <br><span class="timer"></span>
    `;
  celulaAcoes.innerHTML = `
        <button class="btn-concluir" type="button">Concluir</button>
        <button class="btn-editar" type="button">Editar</button>
        <button class="btn-excluir" type="button">Excluir</button>
    `;
  const prazo = new Date(`${data}T${hora}`);
  const spanTimer = celulaDataHora.querySelector(".timer");
  const btnConcluir = celulaAcoes.querySelector(".btn-concluir");

  const intervalo = iniciarContagemRegressiva(prazo, spanTimer, btnConcluir);

  novaLinha.dataset.intervalo = intervalo;
  novaLinha.appendChild(celulaNome);
  novaLinha.appendChild(celulaPrioridade);
  novaLinha.appendChild(celulaDescricao);
  novaLinha.appendChild(celulaStatus);
  novaLinha.appendChild(celulaDataHora);
  novaLinha.appendChild(celulaAcoes);

  return novaLinha;
}
function preencherFormulario(nome, prioridade, descricao, data, hora) {
  document.getElementById("nome").value = nome;
  document.getElementById("descricao").value = descricao;
  document.getElementById("data").value = data;
  document.getElementById("hora").value = hora;
  document
    .querySelectorAll('input[name="prioridade"]')
    .forEach(function (opcao) {
      opcao.checked = opcao.value === prioridade;
    });
  if (botaoCadastrar) {
    botaoCadastrar.textContent = "Salvar alterações";
  }
}
function atualizarStatusLinha(linha, novoStatus) {
  linha.dataset.status = novoStatus;
  const celulaStatus = linha.children[3];
  celulaStatus.textContent = novoStatus;
  celulaStatus.className = "status-cell";
  if (novoStatus === "Pendente") {
    celulaStatus.classList.add("status-pendente");
  }
  if (novoStatus === "Concluida") {
    celulaStatus.classList.add("status-concluida");
  }
  if (novoStatus === "Incompleta") {
    celulaStatus.classList.add("status-incompleta");
  }
}
function adicionarOuEditarTarefa(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const prioridadeInput = document.querySelector(
    'input[name="prioridade"]:checked',
  );
  const prioridade = prioridadeInput ? prioridadeInput.value : "";

  if (!validarFormulario(nome, prioridade, data, hora)) {
    return;
  }

  const cores = {
    baixa: "#81c784",
    media: "#ffd54f",
    alta: "#e57373",
  };

  if (linhaEditando) {
    linhaEditando.children[0].textContent = nome;
    linhaEditando.children[1].textContent = prioridade;
    linhaEditando.children[1].style.color = cores[prioridade] || "transparent";
    linhaEditando.children[2].innerHTML = descricao;
    linhaEditando.dataset.descricao = descricao;
    linhaEditando.dataset.data = data;
    linhaEditando.dataset.hora = hora;
    limparFormulario();
    return;
  }
  const novaLinha = criarLinhaTarefa(nome, prioridade, descricao, data, hora);
  tabela.appendChild(novaLinha);
  verificarPrazos();
  limparFormulario();
}
function eventosBtns(event) {
  const botao = event.target;
  const linha = botao.closest("tr");
  if (!linha) {
    return;
  }
  if (botao.classList.contains("btn-excluir")) {
    linha.remove();
    if (linha === linhaEditando) {
      limparFormulario();
    }
    return;
  }
  if (botao.classList.contains("btn-editar")) {
    const nome = linha.children[0].textContent;
    const prioridade = linha.children[1].textContent;
    const descricao = linha.dataset.descricao || linha.children[2].textContent;
    const data = linha.dataset.data || "";
    const hora = linha.dataset.hora || "";
    preencherFormulario(nome, prioridade, descricao, data, hora);
    linhaEditando = linha;
    return;
  }
  if (botao.classList.contains("btn-concluir")) {
    atualizarStatusLinha(linha, "Concluida");

    clearInterval(Number(linha.dataset.intervalo));

    linha.querySelector(".timer").textContent = "";

    botao.disabled = true;

    return;
  }
}
if (botaoCadastrar) {
  botaoCadastrar.addEventListener("click", adicionarOuEditarTarefa);
}
if (tabela) {
  tabela.addEventListener("click", eventosBtns);
}
