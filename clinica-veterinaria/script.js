
//Efeito de barra preenchida nas métricas
const barras = document.querySelectorAll(".progresso"); 

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            const barra = entrada.target;
            const porcentagem = barra.dataset.porcentagem;

            barra.style.width = `${porcentagem}%`;

            observador.unobserve(barra);  
        }
    });
}, {
    threshold: 1  //ativa efeito quando 100% da barra está visível na tela
});

barras.forEach((barra) => {
    observador.observe(barra);
});