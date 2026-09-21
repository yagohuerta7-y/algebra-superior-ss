/*
  Utilidades compartidas por todo el sitio: alternar tema claro/oscuro,
  renderizar las tarjetas de temas en el índice, y helpers de accesibilidad
  reutilizados por las actividades de cada tema.
*/

var CLAVE_TEMA = "ss-tema";

function leerTemaGuardado() {
  try {
    return window.localStorage.getItem(CLAVE_TEMA);
  } catch (error) {
    // localStorage puede estar restringido bajo file:// en algunos navegadores.
    return null;
  }
}

function guardarTema(valor) {
  try {
    window.localStorage.setItem(CLAVE_TEMA, valor);
  } catch (error) {
    // Si no se puede persistir, el toggle sigue funcionando solo en memoria
    // durante la sesión actual (ver aplicarTema/estadoTemaEnMemoria).
  }
}

var estadoTemaEnMemoria = null;

function aplicarTema(valor) {
  estadoTemaEnMemoria = valor;
  document.documentElement.setAttribute("data-tema", valor);
  var boton = document.getElementById("boton-tema");
  if (boton) {
    var esOscuro = valor === "oscuro";
    boton.setAttribute("aria-pressed", esOscuro ? "true" : "false");
    var etiqueta = boton.querySelector(".etiqueta-tema");
    if (etiqueta) {
      etiqueta.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
    }
  }
}

function temaPreferidoDelSistema() {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "oscuro";
  }
  return "claro";
}

function initToggleTema() {
  var guardado = leerTemaGuardado();
  var inicial = guardado || estadoTemaEnMemoria || temaPreferidoDelSistema();
  aplicarTema(inicial);

  var boton = document.getElementById("boton-tema");
  if (!boton || boton.dataset.inicializado === "true") {
    return;
  }
  boton.dataset.inicializado = "true";
  boton.addEventListener("click", function () {
    var actual = document.documentElement.getAttribute("data-tema");
    var siguiente = actual === "oscuro" ? "claro" : "oscuro";
    aplicarTema(siguiente);
    guardarTema(siguiente);
  });
}

function crearTarjetaTema(tema) {
  var disponible = tema.estado === "disponible";
  var tarjeta = document.createElement(disponible ? "a" : "div");
  tarjeta.className = "tarjeta-tema";

  if (disponible) {
    tarjeta.href = tema.ruta;
  } else {
    tarjeta.setAttribute("aria-disabled", "true");
  }

  var titulo = document.createElement("h2");
  titulo.textContent = tema.titulo;

  var insignia = document.createElement("span");
  insignia.className = "insignia " + (disponible ? "insignia-disponible" : "insignia-proximamente");
  insignia.textContent = disponible ? "Disponible" : "Próximamente";

  var descripcion = document.createElement("p");
  descripcion.textContent = tema.descripcionCorta;

  tarjeta.appendChild(insignia);
  tarjeta.appendChild(titulo);
  tarjeta.appendChild(descripcion);
  return tarjeta;
}

function renderTarjetasTemas() {
  var contenedor = document.getElementById("lista-temas");
  if (!contenedor || !window.TEMAS) {
    return;
  }
  var temasOrdenados = window.TEMAS.slice().sort(function (a, b) {
    return a.orden - b.orden;
  });
  temasOrdenados.forEach(function (tema) {
    var item = document.createElement("li");
    item.appendChild(crearTarjetaTema(tema));
    contenedor.appendChild(item);
  });
}

/* --- Helpers de accesibilidad y validación reutilizados por las actividades --- */

function normalizarTexto(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Fuerza a un lector de pantalla a anunciar `mensaje` incluso si es idéntico
 * al contenido anterior de la región aria-live: se vacía primero y se
 * fuerza un reflow antes de escribir el nuevo texto.
 */
function anunciar(elemento, mensaje) {
  if (!elemento) {
    return;
  }
  elemento.textContent = "";
  void elemento.offsetWidth;
  elemento.textContent = mensaje;
}

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();
  renderTarjetasTemas();
});
