
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


//faz a transição do carrossel em testemunhos

const trilho = document.querySelector(".trilho-testemunhos");
const slides = document.querySelectorAll(".slide-testemunho");
const anterior = document.querySelector(".seta-esquerda");
const proximo = document.querySelector(".seta-direita");

let indiceAtual = 0;

function mostrarTestemunho() {
    trilho.style.transform = `translateX(-${indiceAtual * 100}%)`;
}

proximo.addEventListener("click", () => {
    indiceAtual++;

    if (indiceAtual >= slides.length) {
        indiceAtual = 0;
    }

    mostrarTestemunho();
});

anterior.addEventListener("click", () => {
    indiceAtual--;

    if (indiceAtual < 0) {
        indiceAtual = slides.length - 1;
    }

    mostrarTestemunho();
});



/* Abre e fecha os menus por clique */
document.querySelectorAll(".dropdown > a, .linha > a").forEach((link) => {
    link.addEventListener("click", (evento) => {
        const item = link.parentElement;

        // Intercepta apenas links que possuem submenu
        const submenu = item.querySelector(":scope > .submenu, :scope > .submenu-interno");

        if (!submenu) return;

        evento.preventDefault();

        const estavaAberto = item.classList.contains("aberto");

        // Fecha outros itens do mesmo nível
        const irmaos = Array.from(item.parentElement.children);

        irmaos.forEach((irmao) => {
            if (irmao !== item) {
                irmao.classList.remove("aberto");
            }
        });

        item.classList.toggle("aberto", !estavaAberto);
    });
});

/* Fecha os menus quando clicar fora da navegação */
document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".menu-principal")) {
        document.querySelectorAll(".menu-principal .aberto").forEach((item) => {
            item.classList.remove("aberto");
        });
    }
});



//faz loop infinito com as avaliações do maps

const carrossel = document.querySelector(".lista-avaliacoes");

const gruposOriginais = Array.from(
    document.querySelectorAll(
        ".lista-avaliacoes > .grupo-avaliacoes"
    )
);

if (
    carrossel &&
    gruposOriginais.length > 1 &&
    !carrossel.dataset.inicializado
) {
    carrossel.dataset.inicializado = "true";

    // Cria cópias dos grupos para permitir o loop infinito
    gruposOriginais.forEach((grupo) => {
        const copia = grupo.cloneNode(true);
        copia.setAttribute("aria-hidden", "true");
        carrossel.appendChild(copia);
    });

    let indiceAtual = 0;
    let animando = false;

    function proximoPar() {
        if (animando) return;

        animando = true;
        indiceAtual++;

        // Mede a largura de um grupo
        const larguraGrupo =
            gruposOriginais[0].getBoundingClientRect().width;

        carrossel.style.transition = "transform 0.8s ease-in-out";

        carrossel.style.transform =
            `translateX(-${indiceAtual * larguraGrupo}px)`;
    }

    carrossel.addEventListener("transitionend", (evento) => {
        if (evento.propertyName !== "transform") return;

        // Ao chegar à cópia do primeiro grupo, volta ao início
        if (indiceAtual === gruposOriginais.length) {
            carrossel.style.transition = "none";

            indiceAtual = 0;
            carrossel.style.transform = "translateX(0px)";

            // Aplica o reposicionamento sem animação
            carrossel.getBoundingClientRect();
        }

        animando = false;
    });

    // Avança a cada 10 segundos
    setInterval(proximoPar, 10000);
}