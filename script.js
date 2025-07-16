document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-anuncio");
  const cardsContainer = document.querySelector(".cards");
  const campoPesquisa = document.getElementById("campo-pesquisa");
  const icon = document.getElementById("icon-tema");

  // Modo escuro ativo?
  if (localStorage.getItem("modo-escuro") === "true") {
    document.body.classList.add("dark-mode");
  }

  // Atualiza o ícone do modo escuro
  if (icon) {
    if (document.body.classList.contains("dark-mode")) {
      icon.className = "fa-regular fa-sun";
      icon.style.color = "#f4f6f8";
    } else {
      icon.className = "fa-regular fa-moon";
      icon.style.color = "#2C3E50";
    }
  }

  // Formulário de anúncio
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const titulo = document.getElementById("titulo").value;
      const descricao = document.getElementById("descricao").value;
      const categoria = document.getElementById("categoria").value;
      const bairro = document.getElementById("bairro").value;
      const contato = document.getElementById("contato").value;
      const imagemInput = document.getElementById("imagem");
      const tempo = document.getElementById("tempo").value;
      const tipo = document.getElementById("tipo").value;

      // Se uma imagem foi enviada, ler como base64
      if (imagemInput.files && imagemInput.files[0]) {
        const reader = new FileReader(); // é uma ferramenta do JS para ler arquivos no navegador.
        reader.onload = function (e) {
          const imagem = e.target.result;
          salvarAnuncio(
            titulo,
            descricao,
            categoria,
            bairro,
            contato,
            imagem,
            tempo,
            tipo
          );
        };
        reader.readAsDataURL(imagemInput.files[0]); // transforma a imagem em um texto gigante em base64, que pode ser usado direto no src da <img>.
      } else {
        const imagem = ""; // Se não tiver imagem, continua
        salvarAnuncio(
          titulo,
          descricao,
          categoria,
          bairro,
          contato,
          imagem,
          tempo,
          tipo
        );
      }
    });
  }

  // Renderizar cards na página inicial
  if (cardsContainer) {
    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

    if (anuncios.length === 0) {
      cardsContainer.innerHTML = "<p>Nenhum item anunciado ainda.</p>";
    } else {
      cardsContainer.innerHTML = "";
      anuncios.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="${item.imagem}" alt="${item.titulo}" />
          <h3>${item.titulo}</h3>
          <p>${item.descricao}</p>
          <p><strong>Tipo:</strong> ${
            item.tipo === "troca" ? "Troca" : "Doação"
          }</p>
          <p><strong>Tempo de uso:</strong> ${item.tempo}</p>
          <span><strong>Bairro:</strong> ${item.bairro}</span><br />
          <a href="https://wa.me/55${item.contato.replace(
            /\D/g,
            ""
          )}" target="_blank">
            Entrar em contato
          </a><br />
          <button onclick="copiarDadosAnuncio(this)">Copiar anúncio</button>
        `;

        cardsContainer.appendChild(card);
      });
    }
  }

  // Filtro de pesquisa
  if (campoPesquisa) {
    campoPesquisa.addEventListener("input", () => {
      const termo = campoPesquisa.value.toLowerCase();
      const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        const titulo = card.querySelector("h3").textContent.toLowerCase();
        const descricao = card.querySelector("p").textContent.toLowerCase();
        const bairro = card.querySelector("span").textContent.toLowerCase();

        const corresponde =
          titulo.includes(termo) ||
          descricao.includes(termo) ||
          bairro.includes(termo);

        card.style.display = corresponde ? "block" : "none";
      });
    });
  }
});

// 🔁 Funções utilitárias

function salvarAnuncio(
  titulo,
  descricao,
  categoria,
  bairro,
  contato,
  imagem,
  tempo,
  tipo
) {
  const novoItem = {
    titulo,
    descricao,
    categoria,
    bairro,
    contato,
    imagem,
    tempo,
    tipo,
  };

  const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
  anuncios.push(novoItem);
  localStorage.setItem("anuncios", JSON.stringify(anuncios));

  alert("Anúncio cadastrado com sucesso!");
  window.location.href = "index.html";
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("modo-escuro", isDark);

  const icon = document.getElementById("icon-tema");
  if (icon) {
    icon.className = isDark ? "fa-regular fa-sun" : "fa-regular fa-moon";
    icon.style.color = isDark ? "#f4f6f8" : "#2C3E50";
  }
}

function copiarDadosAnuncio(botao) {
  const card = botao.closest(".card");
  const titulo = card.querySelector("h3").textContent;
  const descricao = card.querySelector("p").textContent;
  const bairro = card.querySelector("span").textContent;

  const texto = `📦 ${titulo}\n📍 ${bairro}\n📝 ${descricao}\n#ConectaItu`;
  navigator.clipboard.writeText(texto);

  const textoOriginal = botao.textContent;
  botao.textContent = "Copiado!";
  botao.disabled = true;

  setTimeout(() => {
    botao.textContent = textoOriginal;
    botao.disabled = false;
  }, 1500);
}
