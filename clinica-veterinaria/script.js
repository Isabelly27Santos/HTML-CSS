/* =========================================================================
   QUATRO PATAS: script.js

   SUMÁRIO
   1. Função auxiliar (observar elementos ao aparecer na tela)
   2. Menu principal (dropdowns por clique)
   3. Hero (carrossel de banners)
   4. Avaliações do Google (carrossel automático infinito)
   5. Métricas (contadores animados)
   6. Barras de progresso
   7. Testemunhos (carrossel)
   8. Perguntas frequentes (acordeão)
   9. Formulário de contato
   10. Animação de revelar ao rolar
   11. Inicialização
   ========================================================================= */


/* =========================================================================
   1. FUNÇÃO AUXILIAR
   Roda a função "aoAparecer" uma única vez para cada elemento, quando ele
   entra na tela. "limite" é quanto do elemento precisa estar visível
   (1 = 100%, 0.25 = 25%).
   ========================================================================= */
function quandoAparecer(elementos, limite, aoAparecer) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;

            aoAparecer(entrada.target);
            observador.unobserve(entrada.target); // não precisa observar de novo
        });
    }, { threshold: limite });

    elementos.forEach((elemento) => observador.observe(elemento));
}


/* =========================================================================
   2. MENU PRINCIPAL
   Abre e fecha os submenus por clique (útil no celular, onde não há hover)
   e fecha tudo ao clicar fora do menu.
   ========================================================================= */
function iniciarMenu() {
    const linksComSubmenu = document.querySelectorAll(".dropdown > a, .linha > a");

    linksComSubmenu.forEach((link) => {
        link.addEventListener("click", (evento) => {
            const item = link.parentElement;
            const submenu = item.querySelector(":scope > .submenu, :scope > .submenu-interno");

            // Só intercepta o clique se o item tiver submenu
            if (!submenu) return;

            evento.preventDefault();

            const estavaAberto = item.classList.contains("aberto");

            // Fecha os outros itens do mesmo nível
            Array.from(item.parentElement.children).forEach((irmao) => {
                if (irmao !== item) irmao.classList.remove("aberto");
            });

            // Abre se estava fechado; fecha se estava aberto
            item.classList.toggle("aberto", !estavaAberto);
        });
    });

    // Fecha os menus ao clicar fora da navegação
    document.addEventListener("click", (evento) => {
        if (evento.target.closest(".menu-principal")) return;

        document.querySelectorAll(".menu-principal .aberto").forEach((item) => {
            item.classList.remove("aberto");
        });
    });
}


/* =========================================================================
   3. HERO: CARROSSEL DE BANNERS
   Navega pelas setas e pelas bolinhas, sem loop: a seta "anterior" some
   no primeiro banner e a "próximo" some no último.
   ========================================================================= */
function iniciarHero() {
    const faixa = document.querySelector(".slides-hero");
    const slides = document.querySelectorAll(".slide-hero");
    const setaAnterior = document.querySelector(".seta-hero.anterior");
    const setaProximo = document.querySelector(".seta-hero.proximo");
    const bolinhas = document.querySelectorAll(".bolinha");

    if (!faixa || !setaAnterior || !setaProximo) return;

    const ultimoIndice = slides.length - 1;
    let indice = 0;

    function atualizar() {
        // Move a faixa até o banner atual
        faixa.style.transform = `translateX(-${indice * 100}%)`;

        // Marca a bolinha do banner atual
        bolinhas.forEach((bolinha, i) => {
            const ativa = i === indice;
            bolinha.classList.toggle("ativa", ativa);

            if (ativa) {
                bolinha.setAttribute("aria-current", "true");
            } else {
                bolinha.removeAttribute("aria-current");
            }
        });

        // Mostra ou esconde as setas nas pontas
        setaAnterior.hidden = indice === 0;
        setaProximo.hidden = indice === ultimoIndice;
    }

    // Seta: volta um banner
    setaAnterior.addEventListener("click", () => {
        if (indice > 0) {
            indice--;
            atualizar();
        }
    });

    // Seta: avança um banner
    setaProximo.addEventListener("click", () => {
        if (indice < ultimoIndice) {
            indice++;
            atualizar();
        }
    });

    // Bolinha: vai direto para o banner escolhido
    bolinhas.forEach((bolinha, i) => {
        bolinha.addEventListener("click", () => {
            indice = i;
            atualizar();
        });
    });

    // Estado inicial
    atualizar();
}


/* =========================================================================
   4. AVALIAÇÕES DO GOOGLE: CARROSSEL INFINITO
   Avança um par a cada 10 segundos. Para parecer infinito, os grupos são
   duplicados no final; ao chegar na cópia do primeiro grupo, a faixa volta
   para o início sem animação (o usuário não percebe a troca).
   ========================================================================= */
function iniciarAvaliacoes() {
    const INTERVALO = 10000; // 10 segundos
    const TRANSICAO = "transform 0.8s ease-in-out";

    const faixa = document.querySelector(".lista-avaliacoes");
    const gruposOriginais = Array.from(
        document.querySelectorAll(".lista-avaliacoes > .grupo-avaliacoes")
    );

    // Não roda se não houver carrossel, se houver só 1 grupo ou se já tiver iniciado
    if (!faixa || gruposOriginais.length <= 1 || faixa.dataset.inicializado) return;

    faixa.dataset.inicializado = "true";

    // Duplica os grupos (cópias escondidas dos leitores de tela)
    gruposOriginais.forEach((grupo) => {
        const copia = grupo.cloneNode(true);
        copia.setAttribute("aria-hidden", "true");
        faixa.appendChild(copia);
    });

    let indice = 0;
    let animando = false;

    function avancar() {
        if (animando) return;

        animando = true;
        indice++;

        // Mede a largura de um grupo na hora (acompanha mudanças de tamanho)
        const larguraGrupo = gruposOriginais[0].getBoundingClientRect().width;

        faixa.style.transition = TRANSICAO;
        faixa.style.transform = `translateX(-${indice * larguraGrupo}px)`;
    }

    // Ao terminar cada deslize
    faixa.addEventListener("transitionend", (evento) => {
        if (evento.propertyName !== "transform") return;

        // Chegou na cópia do 1º grupo: volta ao início sem animação
        if (indice === gruposOriginais.length) {
            faixa.style.transition = "none";
            indice = 0;
            faixa.style.transform = "translateX(0px)";

            // Força o navegador a aplicar a posição antes da próxima animação
            faixa.getBoundingClientRect();
        }

        animando = false;
    });

    setInterval(avancar, INTERVALO);
}


/* =========================================================================
   5. MÉTRICAS: CONTADORES ANIMADOS
   Conta de 0 até o valor de "data-valor" em 2 segundos, quando o número
   aparece inteiro na tela. "data-sufixo" (ex.: "+") é colocado no final.
   ========================================================================= */
function iniciarContadores() {
    const DURACAO = 2000; // 2 segundos
    const contadores = document.querySelectorAll(".contador");

    quandoAparecer(contadores, 1, (contador) => {
        const valorFinal = Number(contador.dataset.valor);
        const sufixo = contador.dataset.sufixo || "";
        const inicio = performance.now();

        function animar(tempoAtual) {
            // Progresso de 0 a 1 (nunca passa de 1)
            const progresso = Math.min((tempoAtual - inicio) / DURACAO, 1);
            const valorAtual = Math.floor(progresso * valorFinal);

            // Formata no padrão brasileiro (ex.: 100.000)
            contador.textContent = valorAtual.toLocaleString("pt-BR") + sufixo;

            // Continua até chegar em 100%
            if (progresso < 1) requestAnimationFrame(animar);
        }

        requestAnimationFrame(animar);
    });
}


/* =========================================================================
   6. BARRAS DE PROGRESSO
   Preenche a barra até o valor de "data-porcentagem" quando ela aparece
   inteira na tela. A animação em si vem da "transition" no CSS.
   ========================================================================= */
function iniciarBarras() {
    const barras = document.querySelectorAll(".progresso");

    quandoAparecer(barras, 1, (barra) => {
        barra.style.width = `${barra.dataset.porcentagem}%`;
    });
}


/* =========================================================================
   7. TESTEMUNHOS: CARROSSEL
   Navega pelas setas, com loop: depois do último vem o primeiro, e
   vice-versa.
   ========================================================================= */
function iniciarTestemunhos() {
    const trilho = document.querySelector(".trilho-testemunhos");
    const slides = document.querySelectorAll(".slide-testemunho");
    const setaAnterior = document.querySelector(".seta-esquerda");
    const setaProximo = document.querySelector(".seta-direita");

    if (!trilho || !setaAnterior || !setaProximo) return;

    let indice = 0;

    function mostrar() {
        trilho.style.transform = `translateX(-${indice * 100}%)`;
    }

    // Próximo (volta ao primeiro depois do último)
    setaProximo.addEventListener("click", () => {
        indice++;
        if (indice >= slides.length) indice = 0;
        mostrar();
    });

    // Anterior (vai ao último antes do primeiro)
    setaAnterior.addEventListener("click", () => {
        indice--;
        if (indice < 0) indice = slides.length - 1;
        mostrar();
    });
}


/* =========================================================================
   8. PERGUNTAS FREQUENTES: ACORDEÃO
   Clicar na pergunta abre ou fecha a resposta logo abaixo dela.
   Cada pergunta funciona sozinha (dá para deixar várias abertas).
   ========================================================================= */
function iniciarFaq() {
    const perguntas = document.querySelectorAll(".item-duvida h2");

    perguntas.forEach((pergunta) => {
        pergunta.addEventListener("click", () => {
            const resposta = pergunta.nextElementSibling;

            pergunta.classList.toggle("ativo");  // gira a seta e muda a cor
            resposta.classList.toggle("aberto"); // mostra/esconde a resposta
        });
    });
}


/* =========================================================================
   9. FORMULÁRIO DE CONTATO
   Impede o recarregamento da página e mostra uma mensagem de sucesso.
   (Os campos "required" já são validados pelo navegador antes disso.)
   ========================================================================= */
function iniciarFormulario() {
    const formulario = document.querySelector(".formulario");

    if (!formulario) return;

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nome = document.querySelector("#nome").value.trim();

        alert(`Obrigada pelo contato, ${nome}! 🐾
Sua mensagem foi enviada com sucesso. Em breve, retornaremos.`);
    });
}


/* =========================================================================
   10. ANIMAÇÃO DE REVELAR AO ROLAR
   Coloca a classe "ativo" nos elementos ".revelar" quando 25% deles
   aparece na tela. O efeito de surgir vem do CSS.
   ========================================================================= */
function iniciarRevelar() {
    const elementos = document.querySelectorAll(".revelar");

    quandoAparecer(elementos, 0.25, (elemento) => {
        elemento.classList.add("ativo");
    });
}


/* =========================================================================
   11. INICIALIZAÇÃO
   ========================================================================= */
iniciarMenu();
iniciarHero();
iniciarAvaliacoes();
iniciarContadores();
iniciarBarras();
iniciarTestemunhos();
iniciarFaq();
iniciarFormulario();
iniciarRevelar();