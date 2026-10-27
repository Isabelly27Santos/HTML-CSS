    /* Indicador de resolução (remover em produção) */
    const indicador = document.querySelector("#dimensoes-janela");

    function atualizarDimensoes() {
        indicador.textContent = `${window.innerWidth} × ${window.innerHeight} px`;
    }

    window.addEventListener("resize", atualizarDimensoes);
    atualizarDimensoes();

    /* Menu mobile */
    const botaoMenu = document.querySelector(".botao-menu");
    const menu = document.querySelector("#menu-principal");
    const telaMobile = window.matchMedia("(max-width: 1023.98px)");

    function alternarMenu(abrir) {
        menu.classList.toggle("aberto", abrir);
        botaoMenu.setAttribute("aria-expanded", abrir);
        botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
        botaoMenu.querySelector("i").className = abrir ? "fa-solid fa-xmark" : "fa-solid fa-bars";

        if (!abrir) {
            menu.querySelectorAll(".aberto").forEach((item) => item.classList.remove("aberto"));
        }
    }

    botaoMenu.addEventListener("click", () => {
        alternarMenu(!menu.classList.contains("aberto"));
    });

    menu.querySelectorAll(".dropdown > a, .linha > a").forEach((link) => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault();
            if (telaMobile.matches) link.parentElement.classList.toggle("aberto");
        });
    });

    menu.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
        link.addEventListener("click", () => alternarMenu(false));
    });

    telaMobile.addEventListener("change", (evento) => {
        if (!evento.matches) alternarMenu(false);
    });
