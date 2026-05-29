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

// 3. Sistema de Filtro Avançado (Elenco, Comissão, Saúde)
document.addEventListener("DOMContentLoaded", function() {
    const botoesFiltro = document.querySelectorAll(".btn-filtro");
    const cardsJogadores = document.querySelectorAll(".jogador-card");

    // Função para aplicar o filtro ativo
    function aplicarFiltro(alvo) {
        cardsJogadores.forEach(card => {
            const categoria = card.getAttribute("data-categoria");

            if (categoria === alvo) {
                card.style.display = "block";
                card.style.opacity = "0";
                setTimeout(() => { card.style.opacity = "1"; }, 30);
            } else {
                card.style.display = "none";
            }
        });
    }

    // Executa o filtro inicial baseado no botão ativo original ('elenco')
    aplicarFiltro("elenco");

    // Gerencia o clique nos botões
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", function() {
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            this.classList.add("ativo");

            const alvo = this.getAttribute("data-alvo");
            aplicarFiltro(alvo);
        });
    });
});

// Função para filtrar os troféus da sala de conquistas
// Sistema de Expansão da História de 1951
document.addEventListener("DOMContentLoaded", function() {
    const btnMundial = document.getElementById("btn-mundial");
    const blocoHistoria = document.getElementById("historia-51");

    if (btnMundial && blocoHistoria) {
        btnMundial.addEventListener("click", function() {
            blocoHistoria.classList.toggle("aberto");
            
            // Altera o texto da dica para melhorar a experiência
            const instrucao = btnMundial.querySelector(".clique-instrucao");
            if (blocoHistoria.classList.contains("aberto")) {
                instrucao.textContent = "✨ Clique para fechar a história";
            } else {
                instrucao.textContent = "✨ Clique para abrir a história da Copa Rio";
            }
        });
    }
});