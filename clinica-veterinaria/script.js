
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
            const duracao = 2000;
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


//controla abertura e fechamento das perguntas
const perguntas = document.querySelectorAll(".item-duvida h2");

perguntas.forEach((pergunta) => {
    pergunta.addEventListener("click", () => {
        const resposta = pergunta.nextElementSibling;

        pergunta.classList.toggle("ativo");
        resposta.classList.toggle("aberto");
    });
});


//mostra mensagem de sucesso ao enviar pelo formulário
const formulario = document.querySelector(".formulario");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();

    alert(`Obrigada pelo contato, ${nome}! 🐾
Sua mensagem foi enviada com sucesso. Em breve, retornaremos.`);
});


//revela gradualmente os elementos do site

const elementos = document.querySelectorAll(".revelar");

const observador3 = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add("ativo");
        }
    });
}, {
    threshold: 0.25
});

elementos.forEach((elemento) => {
    observador3.observe(elemento);
});