// 1. Efeito de opacidade do menu ao rolar a página
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    } else {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
});

// 2. Controle inteligente do Player de Áudio dos Cantos da Torcida
document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll(".canto-card");

    cards.forEach(card => {
        const botao = card.querySelector(".btn-player");
        const audio = card.querySelector(".audio-torcida");

        botao.addEventListener("click", function() {
            // Se o áudio atual já está tocando, ele pausa
            if (!audio.paused) {
                audio.pause();
                botao.textContent = "▶";
                botao.classList.remove("tocando");
            } else {
                // Para todas as outras músicas antes de iniciar a nova
                pararTodosOsAudios();

                // Dá o play na música do card clicado
                audio.play();
                botao.textContent = "⏸";
                botao.classList.add("tocando");
            }
        });

        // Quando a música acabar sozinha, o botão volta ao normal
        audio.addEventListener("ended", function() {
            botao.textContent = "▶";
            botao.classList.remove("tocando");
        });
    });

    // Função auxiliar para silenciar outros cards
    function pararTodosOsAudios() {
        const todosAudios = document.querySelectorAll(".audio-torcida");
        const todosBotoes = document.querySelectorAll(".btn-player");

        todosAudios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0; // Reseta a música para o início
        });

        todosBotoes.forEach(botao => {
            botao.textContent = "▶";
            botao.classList.remove("tocando");
        });
    }
});

// 3. Sistema de Filtro Interativo do Elenco
document.addEventListener("DOMContentLoaded", function() {
    const botoesFiltro = document.querySelectorAll(".btn-filtro");
    const cardsJogadores = document.querySelectorAll(".jogador-card");

    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", function() {
            // Remove a classe 'ativo' de todos os botões e coloca no clicado
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            this.classList.add("ativo");

            const alvo = this.getAttribute("data-alvo");

            cardsJogadores.forEach(card => {
                const categoria = card.getAttribute("data-categoria");

                // Se for 'todos' ou bater com a categoria, exibe. Se não, esconde.
                if (alvo === "todos" || categoria === alvo) {
                    card.style.display = "block";
                    // Pequeno truque de animação de entrada
                    card.style.opacity = "0";
                    setTimeout(() => { card.style.opacity = "1"; }, 50);
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});