
function getTarefas() {
  const dados = localStorage.getItem("tarefas");
  return dados ? JSON.parse(dados) : [];
}
function salvaTarefas(tarefas) {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function mostraLista() {
  document.getElementById("pagina-lista").style.display = "block";
  document.getElementById("pagina-cadastro").style.display = "none";
  const tarefas = getTarefas();
  const tabelaDiv = document.getElementById("tabelaTarefas");
  
  if (tarefas.length === 0) {
    tabelaDiv.innerHTML = '<h3>Nenhuma tarefa cadastrada</h3>';
    return;
  }

  let html = `<table>
    <thead>
      <tr>
        <th>Prioridade</th>
        <th>Descrição</th>
        <th>Local</th>
        <th>Recursos</th>
        <th>Data Limite</th>
        <th>Matrícula</th>
      </tr>
    </thead>
    <tbody>`;
  tarefas.forEach(t => {
    html += `<tr>
      <td class="${t.prioridade === 'Urgente' ? 'urgente' : ''}">${t.prioridade}</td>
      <td>${t.descricao}</td>
      <td>${t.local}</td>
      <td>
        <ul>${t.recursosNecessarios.map(r => `<li>${r}</li>`).join("")}</ul>
      </td>
      <td>${t.dataLimite.replace('T', ' ')}</td>
      <td>${t.matricula}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  tabelaDiv.innerHTML = html;
}

document.getElementById("btnNovaTarefa").onclick = function() {
  document.getElementById("pagina-lista").style.display = "none";
  document.getElementById("pagina-cadastro").style.display = "block";
  limpaFormulario();
};

document.getElementById("btnVoltarLista").onclick = mostraLista;

let recursos = [];
const listaRecursos = document.getElementById("listaRecursos");
document.getElementById("btnAddRecurso").onclick = function() {
  const valor = document.getElementById("recursoInput").value.trim();
  if (valor) {
    recursos.push(valor);
    atualizaRecursos();
    document.getElementById("recursoInput").value = "";
  }
};
function atualizaRecursos() {
  listaRecursos.innerHTML = "";
  recursos.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = r;
    listaRecursos.appendChild(li);
  });
}

function limpaFormulario() {
  recursos = [];
  document.getElementById("formTarefa").reset();
  listaRecursos.innerHTML = "";
  document.getElementById("mensagemErro").textContent = "";
}

document.getElementById("formTarefa").onsubmit = function(e) {
  e.preventDefault();
  const f = e.target;
  const prioridade = f.prioridade.value;
  const descricao = f.descricao.value.trim();
  const local = f.local.value.trim();
  const dataLimite = f.dataLimite.value;
  const matricula = f.matricula.value.trim();
  let erro = "";

  if (!["Baixa", "Normal", "Urgente"].includes(prioridade)) erro += "Prioridade inválida. ";
  if (!descricao) erro += "Descrição obrigatória. ";
  if (!local) erro += "Local obrigatório. ";
  if (!dataLimite) erro += "Data limite obrigatória. ";
  if (!matricula || isNaN(Number(matricula))) erro += "Matrícula obrigatória e numérica. ";
  
  if (erro) {
    document.getElementById("mensagemErro").textContent = erro;
    return false;
  } else {
    document.getElementById("mensagemErro").textContent = "";
  }

  const tarefas = getTarefas();
  tarefas.push({
    prioridade,
    descricao,
    local,
    recursosNecessarios: recursos.slice(),
    dataLimite,
    matricula: Number(matricula)
  });
  salvaTarefas(tarefas);
  mostraLista();
};

mostraLista();