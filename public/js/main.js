
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

function atualizarCidades() {
    var estado = document.getElementById("uf").value;
    var cidade = document.querySelector("#cidade");
    var cidades = cidade.children;

    if (estado.length > 0) {
        cidade.disabled = false;
        cidade.firstElementChild.selected = true;

        for (let i = 0; i < cidades.length; i++) {
            !cidades[i].classList.contains(estado) ? cidades[i].classList.add("hide") : cidades[i].classList.remove("hide");
        }
    }
    else {
        cidade.disabled = true;
    }
}