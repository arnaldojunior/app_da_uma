
/* FUNÇÕES */
function menuOn() {
    document.querySelector(".container").classList.add("menu-on");
    const body = document.body;
    //body.style.overflowY = 'hidden';
}
function menuOff() {
    document.querySelector(".container").classList.remove("menu-on");
    const body = document.body;
    //body.style.overflowY = '';
}
function messageOn() {
    document.querySelector(".container").classList.add("message-on");
    document.querySelector(".message-container").style.display = 'flex';
}
function messageOff() {
    document.querySelector(".container").classList.remove("message-on");
    document.querySelector(".message-container").style.display = 'none';
}

/**
 * Atualiza o select de cidades com base no estado selecionado.
 */
function atualizarCidades() {
    var estado = document.getElementById("uf").value;
    var cidade = document.querySelector("#cidade");
    var cidades = cidade.children;

    // verifica se algum estado foi selecionado
    if (estado.length > 0) {
        cidade.disabled = false; // habilita o select de cidade
        cidade.firstElementChild.selected = true;

        for (let i = 0; i < cidades.length; i++) {
            // esconde as cidades que não são do estado selecionado
            !cidades[i].classList.contains(estado) ? cidades[i].classList.add("hide") : cidades[i].classList.remove("hide");
        }
    }
    else {
        cidade.disabled = true;
    }
}