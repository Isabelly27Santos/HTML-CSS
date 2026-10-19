
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


//aumenta números do card de métricas

const contadores = document.querySelectorAll(".contador");

const observador2 = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            const contador = entrada.target;
            const valorFinal = Number(contador.dataset.valor);
            const duracao = 3000;
            const inicio = performance.now();

            function animar(tempoAtual) {
                const progresso = Math.min(
                    (tempoAtual - inicio) / duracao,
                    1
                );

                const valorAtual = Math.floor(progresso * valorFinal);
                contador.textContent = valorAtual.toLocaleString('pt-BR')  +
    (contador.dataset.sufixo || '');

                if (progresso < 1) {
                    requestAnimationFrame(animar);
                } else {
                    contador.textContent = valorAtual.toLocaleString('pt-BR')  +
    (contador.dataset.sufixo || '');
                }
            }

            requestAnimationFrame(animar);
            observador2.unobserve(contador);
        }
    });
}, {
    threshold: 1
});

contadores.forEach((contador) => {
    observador2.observe(contador);
});