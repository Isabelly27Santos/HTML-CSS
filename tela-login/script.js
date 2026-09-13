function mostrarTela(id) {

    // Busca o tela ativa e remove o ativa (fica como display:none)
    document.querySelector('.tela.ativa').classList.remove('ativa');

    // Coloca como ativa o id da classe selecionada
    document.getElementById(id).classList.add('ativa');
}