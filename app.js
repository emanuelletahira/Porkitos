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

// ============================================================
// AVALIAÇÕES - Adicionar no FINAL do seu script.js existente
// ============================================================

const SUPABASE_URL_AV = 'https://ctmhvhwsqxdxffbhynzv.supabase.co';
const SUPABASE_KEY_AV = 'sb_publishable_boFyP6YzdRChyyshADtfew_TJk7y8Z7';
const HEADERS_AV = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY_AV,
  'Authorization': 'Bearer ' + SUPABASE_KEY_AV
};

// Só roda se estiver na página de avaliações
if (document.getElementById('star-picker')) {

  let estrelaSelecionada = 0;
  const botoesEstrela = document.querySelectorAll('#star-picker button');

  botoesEstrela.forEach(btn => {
    btn.addEventListener('mouseenter', () => iluminarEstrelas(+btn.dataset.val));
    btn.addEventListener('mouseleave', () => iluminarEstrelas(estrelaSelecionada));
    btn.addEventListener('click', () => {
      estrelaSelecionada = +btn.dataset.val;
      iluminarEstrelas(estrelaSelecionada);
    });
  });

  function iluminarEstrelas(n) {
    botoesEstrela.forEach(b => b.classList.toggle('ativo', +b.dataset.val <= n));
  }

  document.getElementById('btn-enviar').addEventListener('click', async () => {
    const nome       = document.getElementById('inp-nome').value.trim();
    const comentario = document.getElementById('inp-comentario').value.trim();
    const btn        = document.getElementById('btn-enviar');

    if (!estrelaSelecionada) { mostrarMsgAv('Escolha uma nota antes de enviar.', 'err'); return; }
    if (!nome)               { mostrarMsgAv('Coloque seu nome para enviar.', 'err'); return; }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const resp = await fetch(SUPABASE_URL_AV + '/rest/v1/avaliacoes', {
        method: 'POST',
        headers: { ...HEADERS_AV, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ nome, estrelas: estrelaSelecionada, comentario: comentario || null })
      });

      if (!resp.ok) throw new Error('Erro ' + resp.status);

      mostrarMsgAv('Avaliacao enviada! Obrigado, torcedor.', 'ok');
      document.getElementById('inp-nome').value = '';
      document.getElementById('inp-comentario').value = '';
      estrelaSelecionada = 0;
      iluminarEstrelas(0);
      await carregarAvaliacoes();

    } catch (e) {
      mostrarMsgAv('Nao foi possivel enviar. Tenta novamente.', 'err');
      console.error(e);
    }

    btn.disabled = false;
    btn.textContent = 'Enviar avaliacao';
  });

  function mostrarMsgAv(texto, tipo) {
    const el = document.getElementById('msg-feedback');
    el.textContent = texto;
    el.className = 'msg-feedback ' + tipo;
  }

  async function carregarAvaliacoes() {
    const lista = document.getElementById('lista');
    try {
      const resp = await fetch(
        SUPABASE_URL_AV + '/rest/v1/avaliacoes?select=*&order=criado_em.desc',
        { headers: HEADERS_AV }
      );
      const dados = await resp.json();
      atualizarResumoAv(dados);
      renderizarListaAv(lista, dados);
    } catch (e) {
      lista.innerHTML = '<div class="av-vazio">Nao foi possivel carregar as avaliacoes.</div>';
      console.error(e);
    }
  }

  function atualizarResumoAv(dados) {
    const total = dados.length;
    const media = total ? (dados.reduce((s, d) => s + d.estrelas, 0) / total) : 0;

    document.getElementById('media-numero').textContent = total ? media.toFixed(1) : '--';
    document.getElementById('media-total').textContent  = total
      ? total + (total === 1 ? ' avaliacao' : ' avaliacoes')
      : 'Nenhuma avaliacao ainda';

    const cheias = Math.round(media);
    document.getElementById('media-estrelas').textContent =
      '★'.repeat(cheias) + '☆'.repeat(5 - cheias);

    const contagem = [5,4,3,2,1].map(n => ({
      nota: n, qtd: dados.filter(d => d.estrelas === n).length
    }));

    document.getElementById('barras').innerHTML = contagem.map(({ nota, qtd }) => {
      const pct = total ? Math.round((qtd / total) * 100) : 0;
      return `<div class="av-barra-linha">
        <span class="av-label">${nota}</span>
        <div class="av-barra-track"><div class="av-barra-fill" style="width:${pct}%"></div></div>
        <span class="av-count">${qtd}</span>
      </div>`;
    }).join('');
  }

  function renderizarListaAv(container, dados) {
    if (!dados.length) {
      container.innerHTML = '<div class="av-vazio">Nenhuma avaliacao ainda. Seja o primeiro!</div>';
      return;
    }
    container.innerHTML = dados.map(d => {
      const inicial  = d.nome.charAt(0).toUpperCase();
      const estrelas = '★'.repeat(d.estrelas) + '☆'.repeat(5 - d.estrelas);
      const data     = new Date(d.criado_em).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const comentario = d.comentario
        ? `<p class="av-comentario">${escHtmlAv(d.comentario)}</p>` : '';
      return `<div class="av-card">
        <div class="av-topo">
          <div class="av-avatar">${inicial}</div>
          <div class="av-info">
            <div class="av-nome">${escHtmlAv(d.nome)}</div>
            <div class="av-data">${data}</div>
          </div>
          <div class="av-estrelas">${estrelas}</div>
        </div>
        ${comentario}
      </div>`;
    }).join('');
  }

  function escHtmlAv(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  carregarAvaliacoes();
}

// Função para abrir e fechar a janelinha
    function alternarChat() {
        const chat = document.getElementById("porkitos-chat-container");
        if (chat.style.display === "none" || chat.style.display === "") {
            chat.style.display = "flex";
        } else {
            chat.style.display = "none";
        }
    }

    function verificarTecla(event) {
        if (event.key === "Enter") {
            fazerPergunta();
        }
    }

    function fazerPergunta() {
        const input = document.getElementById("campoPergunta");
        const pergunta = input.value.trim();
        
        if (!pergunta) return;

        const historico = document.getElementById("historico");
        historico.innerHTML += `<div class="mensagem usuario">${pergunta}</div>`;
        input.value = "";
        historico.scrollTop = historico.scrollHeight;

        const avatar = document.getElementById("avatarPersonagem");
        const status = document.getElementById("statusTexto");
        
        avatar.style.backgroundImage = "url('bonequinhopensando.png')"; 
        avatar.classList.add("pensando-animacao");
        status.innerText = "🤔 Pensando...";
        status.style.color = "#d4af37";

        // Banco de dados simulado da sua loja Porkitos
        const produtosPorkitos = JSON.parse(localStorage.getItem("produtosPorkitos")) || [
            { nome: "Camisa Oficial Porkitos 2026", preco: 299 },
            { nome: "Moletom Alviverde Porco", preco: 349 },
            { nome: "Boné Palestra Itália", preco: 89 },
            { nome: "Caneca Mágica Allianz Parque", preco: 49 }
        ];

        const textoFiltro = pergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let respostaIA = "";

        if (textoFiltro.includes("caro") || textoFiltro.includes("maior valor") || textoFiltro.includes("maior preco")) {
            let maisCaro = produtosPorkitos.reduce((max, p) => p.preco > max.preco ? p : max, produtosPorkitos[0]);
            respostaIA = `O item mais premium da nossa loja atualmente é o **${maisCaro.nome}**, saindo por R$ ${maisCaro.preco},00. Um manto sagrado! 🏆`;
        }
        else if (textoFiltro.includes("barato") || textoFiltro.includes("menor valor") || textoFiltro.includes("menor preco") || textoFiltro.includes("em conta")) {
            let maisBarato = produtosPorkitos.reduce((min, p) => p.preco < min.preco ? p : min, produtosPorkitos[0]);
            respostaIA = `O item mais em conta na nossa loja hoje é a **${maisBarato.nome}**, por apenas R$ ${maisBarato.preco},00! Dá pra garantir sem apertar o bolso. 🟩`;
        }
        else if (textoFiltro.includes("tem") || textoFiltro.includes("vende") || textoFiltro.includes("busca") || textoFiltro.includes("camisa") || textoFiltro.includes("moletom") || textoFiltro.includes("bone") || textoFiltro.includes("caneca")) {
            let achouProduto = null;
            for (let p of produtosPorkitos) {
                let nomeTratado = p.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (textoFiltro.includes(nomeTratado) || nomeTratado.includes(textoFiltro)) {
                    achouProduto = p;
                    break; 
                }
            }
            if (achouProduto) {
                respostaIA = `Com certeza, a Família Palmeiras merece! Nós temos o/a **${achouProduto.nome}** por R$ ${achouProduto.preco},00. Você pode garantir ela direto na nossa aba Loja! 🛍️`;
            } else {
                respostaIA = "Dá uma olhada geral na nossa aba 'Loja' no menu superior! Se não achar esse modelo específico, fique de olho porque o estoque atualiza direto! 🐷";
            }
        }
        else if (textoFiltro.includes("elenco") || textoFiltro.includes("jogador") || textoFiltro.includes("time") || textoFiltro.includes("escalacao")) {
            respostaIA = "O nosso **Esquadrão de 2026** está fortíssimo! Para ver a ficha técnica de todos os nossos guerreiros, clique na seção **Elenco 2026** no menu superior do site! 🏃‍♂️💨";
        }
        else if (textoFiltro.includes("titulo") || textoFiltro.includes("conquistas") || textoFiltro.includes("campeao") || textoFiltro.includes("libertadores")) {
            respostaIA = "Somos o Maior Campeão do Brasil! 🏆 Na nossa página de **Conquistas**, você pode relembrar nossa trajetória histórica cheia de taças pesadas. Vai lá conferir!";
        }
        else if (textoFiltro.includes("historia") || textoFiltro.includes("palestra") || textoFiltro.includes("fundacao")) {
            respostaIA = "Nossa história nasceu em 1914 como Palestra Itália e virou Palmeiras na Arrancada Heróica! 🟢 Você encontra tudo detalhado na aba **História** do menu.";
        }
        else if (textoFiltro.includes("oi") || textoFiltro.includes("ola") || textoFiltro.includes("bom dia") || textoFiltro.includes("boa tarde")) {
            respostaIA = "Salve, palmeirense! Tudo tranquilo? Sou o Porquito. Como posso te ajudar a navegar pelo nosso portal alviverde hoje? 🐷💚";
        } 
        else {
            respostaIA = "Baita pergunta! Como assistente virtual do Porkitos, posso te ajudar a ver os produtos da Loja (e quais estão mais baratos), ou te dar infos sobre o nosso Elenco 2026 e Conquistas! 🟩";
        }

        setTimeout(() => {
            historico.innerHTML += `<div class="mensagem atendente">${respostaIA}</div>`;
            historico.scrollTop = historico.scrollHeight;

            avatar.style.backgroundImage = "url('personagem.png')";
            avatar.classList.remove("pensando-animacao");
            status.innerText = "🟢 Online";
            status.style.color = "#006437";
        }, 1200); 
    }