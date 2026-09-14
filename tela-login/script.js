function mostrarTela(id) {

    // Busca o tela ativa e remove o ativa (fica como display:none)
    document.querySelector('.tela.ativa').classList.remove('ativa');

    // Coloca como ativa o id da classe selecionada
    document.getElementById(id).classList.add('ativa');
}

const olhos = document.querySelectorAll('.eyes');

olhos.forEach(olho => {
    olho.addEventListener('click', () => {

        const botao = olho.parentElement;
        const senha = botao.previousElementSibling;

        if (senha.type === 'password') {
            senha.type = 'text';
            olho.className = 'eyes fa-regular fa-eye';
        } else {
            senha.type = 'password';
            olho.className = 'eyes fa-regular fa-eye-slash';
        }
    });
});