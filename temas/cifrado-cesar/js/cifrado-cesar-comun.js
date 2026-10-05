/*
  Utilidades compartidas por las actividades del tema "Cifrado César":
  aritmética modular (Zn), cifrado/descifrado, orden de un elemento, un
  control deslizante de un solo valor, el reloj modular (SVG) y la tabla del
  alfabeto.
*/

/** Residuo no negativo de a módulo n (maneja correctamente valores negativos de a). */
function modulo(a, n) {
  return ((a % n) + n) % n;
}

/** Índice (0-based) de una letra en window.ALFABETO, o -1 si no pertenece. */
function letraAIndice(letra) {
  return window.ALFABETO.indexOf(letra.toUpperCase());
}

/** Letra correspondiente a un índice (0-based) de window.ALFABETO. */
function indiceALetra(indice) {
  return window.ALFABETO[indice];
}

/**
 * Cifra un texto con el cifrado César y desplazamiento k: cada letra del
 * alfabeto se reemplaza por la que está k posiciones adelante, módulo n.
 * Los caracteres que no pertenecen al alfabeto (espacios, puntuación, etc.)
 * se dejan sin cambio.
 */
function cifrarCesar(texto, k) {
  var n = window.ALFABETO.length;
  var kMod = modulo(k, n);
  var resultado = "";
  for (var i = 0; i < texto.length; i++) {
    var indice = letraAIndice(texto[i]);
    resultado += indice === -1 ? texto[i] : indiceALetra(modulo(indice + kMod, n));
  }
  return resultado;
}

/** Descifra un texto cifrado con cifrarCesar(texto, k): aplica el desplazamiento inverso. */
function descifrarCesar(textoCifrado, k) {
  return cifrarCesar(textoCifrado, -k);
}

/**
 * Desglose letra por letra del cifrado de `texto` con desplazamiento `k`,
 * para mostrar la congruencia aplicada a cada carácter.
 */
function generarPasosCifrado(texto, k) {
  var n = window.ALFABETO.length;
  var kMod = modulo(k, n);
  var pasos = [];
  for (var i = 0; i < texto.length; i++) {
    var caracter = texto[i].toUpperCase();
    var indiceOriginal = letraAIndice(caracter);
    if (indiceOriginal === -1) {
      pasos.push({
        caracter: texto[i],
        esAlfabeto: false,
        indiceOriginal: null,
        indiceResultado: null,
        caracterResultado: texto[i]
      });
      continue;
    }
    var indiceResultado = modulo(indiceOriginal + kMod, n);
    pasos.push({
      caracter: caracter,
      esAlfabeto: true,
      indiceOriginal: indiceOriginal,
      indiceResultado: indiceResultado,
      caracterResultado: indiceALetra(indiceResultado)
    });
  }
  return pasos;
}

function mcd(a, b) {
  while (b !== 0) {
    var resto = a % b;
    a = b;
    b = resto;
  }
  return a;
}

/** Orden del elemento k en (Zn,+): menor m>0 tal que m*k ≡ 0 (mod n), es decir n/mcd(k,n). */
function ordenElementoZn(k, n) {
  var kMod = modulo(k, n);
  if (kMod === 0) {
    return 1;
  }
  return n / mcd(kMod, n);
}

/**
 * Crea un control con un slider+número sincronizados para elegir un único
 * valor entero en [0, limite]. Análogo a crearControlNM (palomar-comun.js)
 * pero para un solo valor en vez de dos.
 *
 * @param {Object} opciones
 * @param {HTMLElement} opciones.contenedor
 * @param {string} opciones.idPrefijo
 * @param {string} [opciones.etiqueta]
 * @param {number} [opciones.limite] - por defecto window.ALFABETO.length - 1.
 * @param {number} [opciones.valorInicial]
 * @param {(valor:number) => void} opciones.onCambio
 * @returns {{obtenerValor: () => number, establecerValor: (valor:number) => void}}
 */
function crearControlK(opciones) {
  var contenedor = opciones.contenedor;
  var prefijo = opciones.idPrefijo;
  var etiquetaTexto = opciones.etiqueta || "Desplazamiento (k)";
  var limite = typeof opciones.limite === "number" ? opciones.limite : window.ALFABETO.length - 1;
  var valor = typeof opciones.valorInicial === "number" ? opciones.valorInicial : 0;
  var onCambio = opciones.onCambio || function () {};

  contenedor.innerHTML = "";
  var campo = document.createElement("div");
  campo.className = "campo";

  var idCampo = prefijo + "-valor";
  var etiqueta = document.createElement("label");
  etiqueta.setAttribute("for", idCampo + "-rango");
  etiqueta.textContent = etiquetaTexto;

  var fila = document.createElement("div");
  fila.className = "fila-rango";

  var rango = document.createElement("input");
  rango.type = "range";
  rango.id = idCampo + "-rango";
  rango.min = "0";
  rango.max = String(limite);
  rango.value = String(valor);

  var numero = document.createElement("input");
  numero.type = "number";
  numero.id = idCampo + "-numero";
  numero.min = "0";
  numero.max = String(limite);
  numero.value = String(valor);
  numero.setAttribute("aria-label", etiquetaTexto + " (valor exacto)");

  function sincronizar(valorNuevo) {
    valor = Math.max(0, Math.min(limite, parseInt(valorNuevo, 10) || 0));
    rango.value = String(valor);
    numero.value = String(valor);
    onCambio(valor);
  }

  rango.addEventListener("input", function () {
    sincronizar(rango.value);
  });
  numero.addEventListener("input", function () {
    sincronizar(numero.value);
  });

  fila.appendChild(rango);
  fila.appendChild(numero);
  campo.appendChild(etiqueta);
  campo.appendChild(fila);
  contenedor.appendChild(campo);

  return {
    obtenerValor: function () {
      return valor;
    },
    establecerValor: function (valorNuevo) {
      sincronizar(valorNuevo);
    }
  };
}

/**
 * Dibuja un reloj modular: un SVG con n puntos distribuidos en círculo
 * (uno por símbolo de `etiquetas`), y expone `actualizar({origen, destino})`
 * para resaltar dos puntos y la flecha que va de uno al otro.
 *
 * @param {HTMLElement} contenedor
 * @param {Object} [opciones]
 * @param {string[]} [opciones.etiquetas] - por defecto window.ALFABETO.
 * @param {string} [opciones.idPrefijo]
 * @returns {{actualizar: (valores:{origen:number, destino:number}) => void}}
 */
function crearRelojModular(contenedor, opciones) {
  opciones = opciones || {};
  var etiquetas = opciones.etiquetas || window.ALFABETO;
  var n = etiquetas.length;
  var idPrefijo = opciones.idPrefijo || "reloj";
  var tamano = 300;
  var centro = tamano / 2;
  var radioPuntos = centro - 36;
  var radioEtiquetas = centro - 14;
  var ns = "http://www.w3.org/2000/svg";

  function posicion(indice, radio) {
    var angulo = -Math.PI / 2 + (2 * Math.PI * indice) / n;
    return { x: centro + radio * Math.cos(angulo), y: centro + radio * Math.sin(angulo) };
  }

  contenedor.innerHTML = "";
  var svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 " + tamano + " " + tamano);
  svg.classList.add("reloj-modular-svg");

  var defs = document.createElementNS(ns, "defs");
  var marcador = document.createElementNS(ns, "marker");
  marcador.setAttribute("id", idPrefijo + "-punta");
  marcador.setAttribute("viewBox", "0 0 10 10");
  marcador.setAttribute("refX", "8");
  marcador.setAttribute("refY", "5");
  marcador.setAttribute("markerWidth", "6");
  marcador.setAttribute("markerHeight", "6");
  marcador.setAttribute("orient", "auto-start-reverse");
  var puntaFlecha = document.createElementNS(ns, "path");
  puntaFlecha.setAttribute("d", "M0,0 L10,5 L0,10 z");
  puntaFlecha.setAttribute("class", "punta-flecha-reloj");
  marcador.appendChild(puntaFlecha);
  defs.appendChild(marcador);
  svg.appendChild(defs);

  var circuloBase = document.createElementNS(ns, "circle");
  circuloBase.setAttribute("cx", String(centro));
  circuloBase.setAttribute("cy", String(centro));
  circuloBase.setAttribute("r", String(radioPuntos));
  circuloBase.setAttribute("class", "circulo-base-reloj");
  svg.appendChild(circuloBase);

  var lineaDesplazamiento = document.createElementNS(ns, "line");
  lineaDesplazamiento.setAttribute("class", "arco-desplazamiento");
  lineaDesplazamiento.setAttribute("marker-end", "url(#" + idPrefijo + "-punta)");
  svg.appendChild(lineaDesplazamiento);

  var puntos = [];
  for (var i = 0; i < n; i++) {
    var posicionPunto = posicion(i, radioPuntos);
    var circulo = document.createElementNS(ns, "circle");
    circulo.setAttribute("cx", String(posicionPunto.x));
    circulo.setAttribute("cy", String(posicionPunto.y));
    circulo.setAttribute("r", "7");
    circulo.setAttribute("class", "punto-reloj");
    svg.appendChild(circulo);
    puntos.push({ circulo: circulo, pos: posicionPunto });

    var posicionEtiqueta = posicion(i, radioEtiquetas);
    var texto = document.createElementNS(ns, "text");
    texto.setAttribute("x", String(posicionEtiqueta.x));
    texto.setAttribute("y", String(posicionEtiqueta.y));
    texto.setAttribute("class", "etiqueta-reloj");
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("dominant-baseline", "middle");
    texto.textContent = etiquetas[i];
    svg.appendChild(texto);
  }

  contenedor.appendChild(svg);

  function actualizar(valores) {
    var origen = valores.origen;
    var destino = valores.destino;

    puntos.forEach(function (punto, indice) {
      var clases = ["punto-reloj"];
      if (indice === origen) {
        clases.push("origen");
      }
      if (indice === destino) {
        clases.push("destino");
      }
      punto.circulo.setAttribute("class", clases.join(" "));
    });

    var origenPos = puntos[origen].pos;
    if (origen === destino) {
      lineaDesplazamiento.style.opacity = "0";
      return;
    }

    var destinoPos = puntos[destino].pos;
    var dx = destinoPos.x - origenPos.x;
    var dy = destinoPos.y - origenPos.y;
    var distancia = Math.sqrt(dx * dx + dy * dy) || 1;
    var factor = Math.max(0, (distancia - 12) / distancia);

    lineaDesplazamiento.style.opacity = "1";
    lineaDesplazamiento.setAttribute("x1", String(origenPos.x));
    lineaDesplazamiento.setAttribute("y1", String(origenPos.y));
    lineaDesplazamiento.setAttribute("x2", String(origenPos.x + dx * factor));
    lineaDesplazamiento.setAttribute("y2", String(origenPos.y + dy * factor));
  }

  return { actualizar: actualizar };
}

/** Renderiza una rejilla de celdas letra/índice para window.ALFABETO. */
function renderTablaAlfabeto(contenedor) {
  contenedor.innerHTML = "";
  window.ALFABETO.forEach(function (letra, indice) {
    var celda = document.createElement("div");
    celda.className = "celda-alfabeto";

    var spanLetra = document.createElement("span");
    spanLetra.className = "letra-alfabeto";
    spanLetra.textContent = letra;

    var spanIndice = document.createElement("span");
    spanIndice.className = "indice-alfabeto";
    spanIndice.textContent = String(indice);

    celda.appendChild(spanLetra);
    celda.appendChild(spanIndice);
    contenedor.appendChild(celda);
  });
}

function katexRender(formula, elemento, display) {
  if (!elemento || typeof katex === "undefined") {
    return;
  }
  katex.render(formula, elemento, { throwOnError: false, displayMode: !!display });
}

var KATEX_DELIMITADORES = [
  { left: "$$", right: "$$", display: true },
  { left: "$", right: "$", display: false },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true }
];

function renderMathEnElemento(elemento) {
  if (elemento && window.renderMathInElement) {
    window.renderMathInElement(elemento, { delimiters: KATEX_DELIMITADORES, throwOnError: false });
  }
}

function enteroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}
