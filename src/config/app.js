import Tarefa from "../modelos/Tarefas.js"

const tarefas = [];

let excluindo = null;
let editando = false;
let edicao = null;
let darkmode = true;

const tbody = document.querySelector("tbody");

window.onload = () => {
    let btnDelModal = document.querySelector("#btnExcluirModal");
    let btnSaveModal = document.querySelector("#btnSalvar");
    let btnMarcar = document.querySelector("#btnMarcar");
    let btnExcluirTudo = document.querySelector("#btnExluirAll");
    let btnModoDark = document.querySelector("#btnModoDark");

    btnModoDark.addEventListener("click", () => {
        if (darkmode) {
            document.body.classList.add("dark");
            btnModoDark.children[0].children[0].className = "bi bi-brightness-high";
        } else {
            document.body.classList.add("ligth");
            btnModoDark.children[0].children[0].className = "bi bi-moon-stars-fill";
        }
        darkmode = !darkmode;
    });

    btnDelModal.addEventListener("click", () => {
        tarefas.splice(tarefas.indexOf(excluindo), 1);
        btnDelModal.parentElement.parentElement.querySelector("#btnClose").click();
        tbody.innerHTML = "";
        RenderizarTarefas();
    });

    btnSaveModal.addEventListener("click", () => {
        let novo = new Tarefa();
        let modal = document.querySelector("#novaTarefa");
        novo.titulo = modal.querySelector("#titulo").value;
        novo.descricao = modal.querySelector("#descricao").value;
        novo.data = new Date(modal.querySelector("#data").value);
        novo.nivel = modal.querySelector("#rangeNivel").value;
        novo.responsavel = modal.querySelector("#responsavel").value;
        novo.status = false;
        if (editando) {
            console.log(edicao);
            novo.id = tarefas[edicao].id;
            tarefas[edicao] = novo;
            editando = false;
            edicao = null;
        } else {
            novo.id = tarefas.length;
            tarefas.push(novo);
        }
        clearModal(modal);
        btnSaveModal.parentElement.parentElement.querySelector("#btnClose").click();
        tbody.innerHTML = "";
        RenderizarTarefas();
    });

    btnMarcar.addEventListener("click", () => {
        document.querySelectorAll(".select").forEach(element => {
            if (element.checked) {
                let tarefa = tarefas[element.id];
                tarefa.status = true;
            }
        });
        btnMarcar.parentElement.parentElement.querySelector("#btnClose").click();
        tbody.innerHTML = "";
        RenderizarTarefas();
    });

    btnExcluirTudo.addEventListener("click", () => {
        let lista = [];
        document.querySelectorAll(".select").forEach(element => {
            if (element.checked) {
                lista.push(tarefas[element.id]);
            }
        });
        lista.forEach(tarefa => { tarefas.splice(tarefas.indexOf(tarefa), 1); });
        btnExcluirTudo.parentElement.parentElement.querySelector("#btnClose").click();
        tbody.innerHTML = "";
        RenderizarTarefas();
    });

    RenderizarTarefas();
}

function clearModal(modal) {
    modal.querySelector("#titulo").value = null;
    modal.querySelector("#descricao").value = null;
    modal.querySelector("#data").value = null;
    modal.querySelector("#rangeNivel").value = null;
    modal.querySelector("#responsavel").value = null;
}

function RenderizarTarefas() {
    if (tarefas.length > 0) {
        tarefas.forEach(tarefa => {
            RenderizarTarefa(tarefa, tbody);
        });
    } else {
        tbody.innerHTML = "<tr><td colspan='6' class='text-center'>Nenhuma tarefa cadastrada</td></tr>";
    }
}

function RenderizarTarefa(tarefa, tbody) {
    let tarefaHtml = document.createElement("tr");
    let btns = document.createElement("td");
    btns.className = "btns";

    let select = document.createElement("input");
    select.type = "checkbox";
    select.id = tarefa.id;
    select.name = "select-" + tarefa.id;
    select.className = "select";
    select.addEventListener("change", () => {
        if (select.checked) tarefaHtml.classList.add("checked");
        else tarefaHtml.classList.remove("checked");
    })

    let btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "bi bi-pencil-square acao info";
    btnEditar.setAttribute("info", "Editar");
    btnEditar.setAttribute("data-bs-toggle", "modal");
    btnEditar.setAttribute("data-bs-target", "#novaTarefa");
    btnEditar.addEventListener("click", () => {
        editando = true;
        edicao = tarefa.id;
        let modal = document.querySelector("#novaTarefa");
        modal.querySelector(".modal-title").innerHTML = "Editar tarefa: " + tarefa.id;
        modal.querySelector("#titulo").value = tarefa.titulo;
        modal.querySelector("#descricao").value = tarefa.descricao;
        modal.querySelector("#data").value = tarefa.data.toISOString().substring(0, 10);
        modal.querySelector("#rangeNivel").value = tarefa.nivel;
        modal.querySelector("#responsavel").value = tarefa.responsavel;
    });

    let btnDeletar = document.createElement("button");
    btnDeletar.type = "button";
    btnDeletar.setAttribute("info", "Excluir");
    btnDeletar.className = "bi bi-trash3-fill acao red";
    btnDeletar.setAttribute("data-bs-toggle", "modal");
    btnDeletar.setAttribute("data-bs-target", "#excluir");
    btnDeletar.addEventListener("click", () => {
        excluindo = tarefa;
        let modal = document.querySelector("#excluir");
        modal.querySelector(".modal-title").innerHTML = "Excluir tarefa: " + tarefa.id;
        modal.querySelector(".modal-body").innerHTML = "Tem certeza que deseja excluir a tarefa: " + tarefa.titulo + "?";
    });

    btns.appendChild(select);
    btns.appendChild(btnEditar);
    btns.appendChild(btnDeletar);

    let titulo = document.createElement("td");
    titulo.textContent = tarefa.titulo;

    let nivel = document.createElement("td");
    nivel.textContent = tarefa.nivel;

    let statusTD = document.createElement("td");
    let status = document.createElement("select");
    status.className = "status-select";

    let op1 = document.createElement("option");
    op1.value = "0";
    op1.textContent = "Aberta";

    let op2 = document.createElement("option");
    op2.value = "1";
    op2.textContent = "Concluída";

    status.appendChild(op1);
    status.appendChild(op2);

    status.value = "0";

    if (tarefa.status) status.value = "1";
    status.addEventListener("change", () => {
        tarefa.AlternarStatus();
    });

    statusTD.appendChild(status);

    let data = document.createElement("td");
    data.textContent = formatDate(tarefa.data);
    let responsavel = document.createElement("td");
    responsavel.textContent = tarefa.responsavel;

    tarefaHtml.appendChild(btns);
    tarefaHtml.appendChild(titulo);
    tarefaHtml.appendChild(nivel);
    tarefaHtml.appendChild(statusTD);
    tarefaHtml.appendChild(data);
    tarefaHtml.appendChild(responsavel);
    tbody.appendChild(tarefaHtml);
}

function formatDate(date) {
    return [
        date.getDate().toString().padStart(2, '0'),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getFullYear(),
    ].join('/');
}