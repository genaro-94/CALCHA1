// =========================
// CALCHA - MOTOR BASE
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  let vistaActual = "home";
  let comercioActivo = null;
  let carrito = [];
  let tipoEntrega = null;
  let direccionEntrega = "";
  let rubroActivo = "todos";
  let menuRubrosAbierto = false;
  let comercios = [];

  fetch("comercios.json")
    .then(res => res.json())
    .then(data => {
      comercios = data;
      renderApp();
    });

  function renderApp() {
    if (vistaActual === "home") renderHome();
    if (vistaActual === "operacion") renderOperacion();
    if (vistaActual === "info") renderInfo();
  }

  // ------------------------
  // HOME
  // ------------------------
  function renderHome() {
    history.replaceState({ vista: "home" }, "", "#home");

    app.innerHTML = `
      <h1>
        <img src="images/Logo.png" style="width:32px;vertical-align:middle;margin-right:8px;">
        CALCHA
      </h1>
      <p>El mercado local en tu mano</p>
      <button id="btn-rubros">☰</button>
      ${
        menuRubrosAbierto
          ? `<div class="menu-rubros">
              <button data-rubro="todos">Todos</button>
              <button data-rubro="gastronomía">🍔 Gastronomía</button>
              <button data-rubro="artesanía">🏺 Artesanía</button>
              <button data-rubro="hotel">🏨 Hotelería</button>
              <button data-rubro="servicios">🛠️ Servicios</button>
              <hr>
              <button id="btn-info">ℹ️ ¿Qué es Calcha?</button>
            </div>`
          : ""
      }
      <div id="lista-comercios"></div>
    `;

    document.getElementById("btn-rubros").onclick = () => {
      menuRubrosAbierto = !menuRubrosAbierto;
      renderHome();
    };

    const btnInfo = document.getElementById("btn-info");
    if (btnInfo) {
      btnInfo.onclick = () => {
        vistaActual = "info";
        menuRubrosAbierto = false;
        renderApp();
      };
    }

    document.querySelectorAll("[data-rubro]").forEach(btn => {
      btn.onclick = () => {
        rubroActivo = btn.dataset.rubro;
        menuRubrosAbierto = false;
        renderHome();
      };
    });

    const contenedor = document.getElementById("lista-comercios");
    const filtrados =
      rubroActivo === "todos"
        ? comercios
        : comercios.filter(c => c.rubro === rubroActivo);

    filtrados.forEach(c => {
      const card = document.createElement("div");
      card.className = "card-comercio";
      card.innerHTML = `
        <img src="${c.imagen}">
        <h3>${c.nombre}</h3>
        <p>${c.descripcion}</p>
        <button>Ver</button>
      `;
      card.querySelector("button").onclick = () => {
        comercioActivo = c;
        carrito = [];
        tipoEntrega = null;
        vistaActual = "operacion";
        renderApp();
      };
      contenedor.appendChild(card);
    });
  }

  // ------------------------
  // OPERACIÓN
  // ------------------------
  function renderOperacion() {
    if (comercioActivo.tipoOperacion === "pedido") renderPedido();
    else renderHome();
  }

  // ------------------------
  // PEDIDO
  // ------------------------
  function renderPedido() {
    history.pushState({ vista: "pedido" }, "", "#pedido");

    let menuHTML = "";
    comercioActivo.menu.forEach((item, i) => {
      const enCarrito = carrito.find(p => p.nombre === item.nombre);
      menuHTML += `
        <div class="item-menu">
          <span>${item.nombre} - $${item.precio}</span>
          <button data-i="${i}">+</button>
          ${enCarrito ? `<strong>${enCarrito.cantidad}</strong>` : ""}
        </div>`;
    });

    app.innerHTML = `
      <button class="btn-volver">← Volver</button>
      <h2>${comercioActivo.nombre}</h2>
      <div class="menu">${menuHTML}</div>
    `;

    document.querySelector(".btn-volver").onclick = () => {
      vistaActual = "home";
      renderApp();
    };

    document.querySelectorAll(".item-menu button").forEach(b => {
      b.onclick = () => {
        const prod = comercioActivo.menu[b.dataset.i];
        const ex = carrito.find(p => p.nombre === prod.nombre);
        if (ex) ex.cantidad++;
        else carrito.push({ ...prod, cantidad: 1 });
        renderPedido();
      };
    });
  }

  // ------------------------
  // INFO
  // ------------------------
  function renderInfo() {
    app.innerHTML = `
      <button class="btn-volver">← Volver</button>
      <h2>¿Qué es Calcha?</h2>
      <p>Plataforma de comercios locales.</p>
    `;
    document.querySelector(".btn-volver").onclick = () => {
      vistaActual = "home";
      renderApp();
    };
  }
});
