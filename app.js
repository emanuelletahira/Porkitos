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
        if (botao && audio) {
            botao.addEventListener("click", function() {
                if (!audio.paused) {
                    audio.pause();
                    botao.textContent = "▶";
                    botao.classList.remove("tocando");
                } else {
                    pararTodosOsAudios();
                    audio.play();
                    botao.textContent = "⏸";
                    botao.classList.add("tocando");
                }
            });
            audio.addEventListener("ended", function() {
                botao.textContent = "▶";
                botao.classList.remove("tocando");
            });
        }
    });

    function pararTodosOsAudios() {
        const todosAudios = document.querySelectorAll(".audio-torcida");
        const todosBotoes = document.querySelectorAll(".btn-player");
        todosAudios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        todosBotoes.forEach(botao => {
            botao.textContent = "▶";
            botao.classList.remove("tocando");
        });
    }
});

// 3. Sistema de Filtro Avançado
document.addEventListener("DOMContentLoaded", function() {
    const botoesFiltro = document.querySelectorAll(".btn-filtro");
    const cardsJogadores = document.querySelectorAll(".jogador-card");
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
    if (cardsJogadores.length > 0) aplicarFiltro("elenco");
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", function() {
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            this.classList.add("ativo");
            const alvo = this.getAttribute("data-alvo");
            aplicarFiltro(alvo);
        });
    });
});

// 4. Sistema de Expansão da História
document.addEventListener("DOMContentLoaded", function() {
    const btnMundial = document.getElementById("btn-mundial");
    const blocoHistoria = document.getElementById("historia-51");
    if (btnMundial && blocoHistoria) {
        btnMundial.addEventListener("click", function() {
            blocoHistoria.classList.toggle("aberto");
            const instrucao = btnMundial.querySelector(".clique-instrucao");
            if (blocoHistoria.classList.contains("aberto")) {
                instrucao.textContent = " Clique para fechar a história";
            } else {
                instrucao.textContent = " Clique para abrir a história do Mundial";
            }
        });
    }
    const cardsTrofeu = document.querySelectorAll(".trofeu-card.clicavel");
    const painelAnos = document.getElementById("painel-anos");
    const btnFechar = document.getElementById("btn-fechar-galeria");
    const abasFotos = document.querySelectorAll(".aba-fotos-campeonato");
    cardsTrofeu.forEach(card => {
        card.addEventListener("click", function() {
            const galeriaAlvo = this.getAttribute("data-galeria");
            const nomeCampeonato = this.querySelector("h3").textContent;
            abasFotos.forEach(aba => aba.style.display = "none");
            const abaAlvo = document.getElementById(`galeria-${galeriaAlvo}`);
            if (abaAlvo) {
                abaAlvo.style.display = "block";
                const tituloDinamico = document.getElementById("galeria-titulo-dinamico");
                if (tituloDinamico) tituloDinamico.textContent = `${nomeCampeonato} - Galeria de Imagens`;
                if (painelAnos) painelAnos.classList.add("aberto");
                setTimeout(() => {
                    if (painelAnos) painelAnos.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 250);
            }
        });
    });
    if (btnFechar && painelAnos) {
        btnFechar.addEventListener("click", function() {
            painelAnos.classList.remove("aberto");
        });
    }
});

// 5. SISTEMA DE LOGIN

const SUPABASE_URL = 'https://gzptrkipxlwaubpxufqh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wxOruwzbq-rKKR3_skDKAw_YZ_x7drF';
const loginModal = document.getElementById("loginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userNameDisplay = document.getElementById("userNameDisplay");
const overlay = document.getElementById("overlay");

function verificarLogin() {
    const usuario = JSON.parse(localStorage.getItem("porkitos_user"));
    if (usuario) {
        if (loginBtn) loginBtn.style.display = "none";
        if (userInfo) userInfo.style.display = "flex";
        if (userNameDisplay) userNameDisplay.textContent = `Olá, ${usuario.nome}`;
        return true;
    } else {
        if (loginBtn) loginBtn.style.display = "block";
        if (userInfo) userInfo.style.display = "none";
        return false;
    }
}

function fecharTudo() {
    if (loginModal) loginModal.classList.remove("active");
    const productModal = document.getElementById("productModal");
    if (productModal) productModal.classList.remove("active");
    const cartSidebar = document.getElementById("cartSidebar");
    if (cartSidebar) cartSidebar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        loginModal.classList.add("active");
        overlay.classList.add("active");
    });
}

// CORREÇÃO CRÍTICA: Impedir que cliques dentro do modal fechem ele
const loginContent = document.querySelector(".login-content");
if (loginContent) {
    loginContent.addEventListener("click", (e) => {
        e.stopPropagation(); // Impede o clique de chegar no overlay/modal pai
    });
}

if (closeLoginModal) closeLoginModal.addEventListener("click", fecharTudo);
if (overlay) overlay.addEventListener("click", fecharTudo);

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("loginName").value;
        const email = document.getElementById("loginEmail").value;
        localStorage.setItem("porkitos_user", JSON.stringify({ nome, email }));
        alert(`Seja bem vindo(a) ${nome}, que bom saber que faz parte do time agora!`);
        fecharTudo();
        verificarLogin();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("porkitos_user");
        verificarLogin();
    });
}

document.addEventListener("DOMContentLoaded", verificarLogin);

// 6. LOJA E CARRINHO
let produtoAtual = "modelo1";
let corAtual = "preta";
let carrinho = [];

const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");
const cartButton = document.getElementById("cartButton");

function atualizarImagemModal() {
    const modalImage = document.getElementById("modalImage");
    if (modalImage) modalImage.src = `camisetas/${produtoAtual}-${corAtual}.png`;
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("productModal");
    const closeModal = document.getElementById("closeModal");
    const viewButtons = document.querySelectorAll(".btn-view");
    
    // Impedir fechamento ao clicar dentro do modal de produto
    const modalContent = modal ? modal.querySelector(".modal-content") : null;
    if (modalContent) {
        modalContent.addEventListener("click", (e) => e.stopPropagation());
    }

    viewButtons.forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".card");
            const image = card.querySelector("img").src;
            const title = card.querySelector("h3").textContent;
            const price = card.querySelector(".preco").textContent;
            const description = card.querySelector(".card-description").textContent;
            const mImage = document.getElementById("modalImage");
            const mTitle = document.getElementById("modalTitle");
            const mPrice = document.getElementById("modalPrice");
            const mDesc = document.getElementById("modalDescription");
            const mSel = document.getElementById("modeloSelecionado");

            if (mImage) mImage.src = image;
            if (mTitle) mTitle.textContent = title;
            if (mPrice) mPrice.textContent = price;
            if (mDesc) mDesc.textContent = description;

            if (card.dataset.modelo) {
                produtoAtual = card.dataset.modelo;
                if (mSel) mSel.textContent = produtoAtual.replace("modelo", "Modelo ");
                atualizarImagemModal();
            }
            if (modal) modal.classList.add("active");
            if (overlay) overlay.classList.add("active");
        });
    });

    if (closeModal) closeModal.addEventListener("click", fecharTudo);
});

if (cartButton) cartButton.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
});
if (closeCart) closeCart.addEventListener("click", fecharTudo);

function atualizarCarrinho() {
    if (!cartItems || !cartTotal) return;
    if (carrinho.length === 0) {
        cartItems.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.</div>`;
        cartTotal.textContent = "R$ 0,00";
        return;
    }
    let total = 0;
    cartItems.innerHTML = "";
    carrinho.forEach((item, index) => {
        total += item.preco;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-image"><img src="${item.imagem}"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.nome}</div>
                    <div>Cor: ${item.cor} | Tam: ${item.tamanho}</div>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
                </div>
                <button class="cart-item-remove" onclick="removerItem(${index})">🗑</button>
            </div>`;
    });
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

window.removerItem = (index) => {
    carrinho.splice(index, 1);
    atualizarCarrinho();
};

function adicionarAoCarrinho() {
    if (!localStorage.getItem("porkitos_user")) {
        alert("Faça login para prosseguir com sua compra");
        loginModal.classList.add("active");
        overlay.classList.add("active");
        return;
    }
    const mTitle = document.getElementById("modalTitle");
    const mImage = document.getElementById("modalImage");
    const mPrice = document.getElementById("modalPrice");
    if (!mTitle || !mImage || !mPrice) return;

    const nome = mTitle.textContent;
    const imagem = mImage.src;
    const preco = Number(mPrice.textContent.replace("R$", "").replace(",", ".").trim());
    const corSel = document.querySelector(".color-option.selected");
    const tamSel = document.querySelector(".size-option.selected");
    const cor = corSel ? corSel.textContent.trim() : "Preta";
    const tamanho = tamSel ? tamSel.textContent.trim() : "M";

    carrinho.push({ nome, imagem, preco, cor, tamanho });
    atualizarCarrinho();
    fecharTudo();
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
}

document.querySelectorAll(".btn-add-cart").forEach(botao => {
    botao.addEventListener("click", adicionarAoCarrinho);
});

document.addEventListener("click", (e) => {
    document.querySelectorAll(".color-option").forEach(botao => {

    botao.addEventListener("click", () => {

        document.querySelectorAll(".color-option").forEach(btn => {
            btn.classList.remove("selected");
        });

        botao.classList.add("selected");

        corAtual = botao.dataset.color;

        atualizarImagemModal();

    });

});

document.querySelectorAll(".size-option").forEach(botao => {

    botao.addEventListener("click", () => {

        document.querySelectorAll(".size-option").forEach(btn => {
            btn.classList.remove("selected");
        });

        botao.classList.add("selected");

    });

});
});
