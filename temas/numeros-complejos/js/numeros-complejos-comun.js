/*
  Utilidades compartidas por las actividades del tema "Números complejos":
  aritmética de complejos, formato LaTeX, y un plano complejo SVG con
  puntos arrastrables (ratón, tacto y teclado).

  Un número complejo se representa como un objeto { re, im }.
*/

/* ---------- Aritmética ---------- */

function complejo(re, im) {
  return { re: re, im: im };
}

function sumaComplejos(z, w) {
  return complejo(z.re + w.re, z.im + w.im);
}

function multiplicarComplejos(z, w) {
  return complejo(z.re * w.re - z.im * w.im, z.re * w.im + z.im * w.re);
}

function moduloComplejo(z) {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

/** Argumento en radianes, en [0, 2π). */
function argumentoComplejo(z) {
  var a = Math.atan2(z.im, z.re);
  return a < 0 ? a + 2 * Math.PI : a;
}

function aGrados(rad) {
  return (rad * 180) / Math.PI;
}

/** Número complejo con módulo r y argumento theta (radianes). */
function desdePolar(r, theta) {
  return complejo(r * Math.cos(theta), r * Math.sin(theta));
}

/** Redondea a `d` decimales y evita el "-0". */
function redondear(x, d) {
  var f = Math.pow(10, d === undefined ? 2 : d);
  var r = Math.round(x * f) / f;
  return r === 0 ? 0 : r;
}

/** Texto LaTeX de un número real redondeado a 2 decimales. */
function num(x) {
  return String(redondear(x, 2));
}

/** Texto LaTeX de a + bi. */
function formatoComplejo(z) {
  var a = redondear(z.re, 2);
  var b = redondear(z.im, 2);
  if (b === 0) {
    return String(a);
  }
  var parteIm = (Math.abs(b) === 1 ? "" : String(Math.abs(b))) + "i";
  if (a === 0) {
    return (b < 0 ? "-" : "") + parteIm;
  }
  return a + (b < 0 ? " - " : " + ") + parteIm;
}

/* ---------- KaTeX ---------- */

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

function prefiereMenosMovimiento() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/* ---------- Plano complejo SVG ---------- */

var NS_SVG = "http://www.w3.org/2000/svg";
var TAM_PLANO = 480;

function elementoSvg(nombre, atributos) {
  var e = document.createElementNS(NS_SVG, nombre);
  for (var k in atributos) {
    if (Object.prototype.hasOwnProperty.call(atributos, k)) {
      e.setAttribute(k, atributos[k]);
    }
  }
  return e;
}

/**
 * Crea un plano complejo dentro de `contenedor`.
 * opciones: { rango (por defecto 4), etiqueta (aria-label), circuloUnitario (bool) }
 * Devuelve un objeto con conversiones de coordenadas y primitivas de dibujo.
 * Lo dibujado con las primitivas va a la capa dinámica, que `limpiar()` vacía.
 */
function crearPlano(contenedor, opciones) {
  opciones = opciones || {};
  var rango = opciones.rango || 4;
  var escala = TAM_PLANO / (2 * rango);

  var svg = elementoSvg("svg", {
    viewBox: "0 0 " + TAM_PLANO + " " + TAM_PLANO,
    "class": "plano-svg",
    role: "group",
    "aria-label": opciones.etiqueta || "Plano complejo"
  });
  var capaFondo = elementoSvg("g", {});
  var capaDinamica = elementoSvg("g", {});
  var capaPuntos = elementoSvg("g", {});
  svg.appendChild(capaFondo);
  svg.appendChild(capaDinamica);
  svg.appendChild(capaPuntos);
  contenedor.appendChild(svg);

  var plano = {
    svg: svg,
    rango: rango,
    px: function (re) { return TAM_PLANO / 2 + re * escala; },
    py: function (im) { return TAM_PLANO / 2 - im * escala; },
    escala: escala
  };

  function linea(capa, x1, y1, x2, y2, clase) {
    capa.appendChild(elementoSvg("line", { x1: x1, y1: y1, x2: x2, y2: y2, "class": clase }));
  }

  /* Fondo: cuadrícula, ejes, marcas y círculo unitario. */
  var i;
  for (i = -Math.floor(rango); i <= Math.floor(rango); i++) {
    if (i !== 0) {
      linea(capaFondo, plano.px(i), 0, plano.px(i), TAM_PLANO, "pc-grilla");
      linea(capaFondo, 0, plano.py(i), TAM_PLANO, plano.py(i), "pc-grilla");
      var tx = elementoSvg("text", { x: plano.px(i), y: plano.py(0) + 14, "class": "pc-marca", "text-anchor": "middle" });
      tx.textContent = i;
      capaFondo.appendChild(tx);
      var ty = elementoSvg("text", { x: plano.px(0) - 6, y: plano.py(i) + 4, "class": "pc-marca", "text-anchor": "end" });
      ty.textContent = i + "i";
      capaFondo.appendChild(ty);
    }
  }
  linea(capaFondo, 0, plano.py(0), TAM_PLANO, plano.py(0), "pc-eje");
  linea(capaFondo, plano.px(0), 0, plano.px(0), TAM_PLANO, "pc-eje");
  if (opciones.circuloUnitario) {
    capaFondo.appendChild(elementoSvg("circle", {
      cx: plano.px(0), cy: plano.py(0), r: escala, "class": "pc-circulo-unidad"
    }));
  }

  plano.limpiar = function () {
    while (capaDinamica.firstChild) {
      capaDinamica.removeChild(capaDinamica.firstChild);
    }
  };

  plano.segmento = function (a, b, clase) {
    linea(capaDinamica, plano.px(a.re), plano.py(a.im), plano.px(b.re), plano.py(b.im), "pc-linea " + (clase || ""));
  };

  /** Flecha de a hacia b (la punta se calcula en píxeles). */
  plano.flecha = function (a, b, clase) {
    var x1 = plano.px(a.re), y1 = plano.py(a.im);
    var x2 = plano.px(b.re), y2 = plano.py(b.im);
    var dx = x2 - x1, dy = y2 - y1;
    var largo = Math.sqrt(dx * dx + dy * dy);
    if (largo < 1) {
      return;
    }
    var ux = dx / largo, uy = dy / largo;
    var cola = Math.min(11, largo);
    var bx = x2 - ux * cola, by = y2 - uy * cola;
    linea(capaDinamica, x1, y1, bx, by, "pc-linea " + (clase || ""));
    capaDinamica.appendChild(elementoSvg("polygon", {
      points: x2 + "," + y2 + " " + (bx - uy * 5) + "," + (by + ux * 5) + " " + (bx + uy * 5) + "," + (by - ux * 5),
      "class": "pc-relleno " + (clase || "")
    }));
  };

  plano.polilinea = function (puntos, clase, cerrar, relleno) {
    var pts = puntos.map(function (p) { return plano.px(p.re) + "," + plano.py(p.im); }).join(" ");
    capaDinamica.appendChild(elementoSvg(cerrar ? "polygon" : "polyline", {
      points: pts,
      "class": "pc-linea " + (relleno ? "pc-casa " : "") + (clase || "")
    }));
  };

  /** Arco centrado en el origen de radio r (unidades del plano), de a0 a a1 (rad, antihorario). */
  plano.arco = function (r, a0, a1, clase) {
    while (a1 < a0) {
      a1 += 2 * Math.PI;
    }
    var pasos = Math.max(2, Math.ceil((a1 - a0) / 0.1));
    var pts = [];
    for (var k = 0; k <= pasos; k++) {
      pts.push(desdePolar(r, a0 + ((a1 - a0) * k) / pasos));
    }
    var pts2 = pts.map(function (p) { return plano.px(p.re) + "," + plano.py(p.im); }).join(" ");
    capaDinamica.appendChild(elementoSvg("polyline", { points: pts2, "class": "pc-linea pc-arco " + (clase || "") }));
  };

  plano.punto = function (z, clase, radio) {
    capaDinamica.appendChild(elementoSvg("circle", {
      cx: plano.px(z.re), cy: plano.py(z.im), r: radio || 5, "class": "pc-relleno " + (clase || "")
    }));
  };

  plano.texto = function (z, cadena, clase, dx, dy) {
    var t = elementoSvg("text", {
      x: plano.px(z.re) + (dx || 0), y: plano.py(z.im) + (dy || 0), "class": "pc-texto " + (clase || "")
    });
    t.textContent = cadena;
    capaDinamica.appendChild(t);
  };

  /** Convierte un evento de puntero a coordenadas complejas. */
  plano.aComplejo = function (evento) {
    var caja = svg.getBoundingClientRect();
    var x = ((evento.clientX - caja.left) / caja.width) * TAM_PLANO;
    var y = ((evento.clientY - caja.top) / caja.height) * TAM_PLANO;
    return complejo((x - TAM_PLANO / 2) / escala, (TAM_PLANO / 2 - y) / escala);
  };

  /**
   * Añade un punto arrastrable (ratón, tacto o flechas del teclado).
   * opciones: { z, clase, nombre, maxMod, onCambio(z) }
   * Devuelve { obtener(), establecer(z) }.
   */
  plano.puntoArrastrable = function (op) {
    var z = complejo(op.z.re, op.z.im);
    var maxMod = op.maxMod || rango - 0.3;
    var grupo = elementoSvg("g", {
      "class": "pc-punto " + (op.clase || ""),
      tabindex: "0",
      role: "application"
    });
    grupo.appendChild(elementoSvg("circle", { r: 22, "class": "pc-zona" }));
    grupo.appendChild(elementoSvg("circle", { r: 8, "class": "pc-relleno pc-nucleo" }));
    var etiqueta = elementoSvg("text", { "class": "pc-texto " + (op.clase || "") });
    etiqueta.textContent = op.nombre || "";
    capaPuntos.appendChild(grupo);
    capaPuntos.appendChild(etiqueta);

    function ajustar(p) {
      var m = moduloComplejo(p);
      return m > maxMod ? complejo((p.re * maxMod) / m, (p.im * maxMod) / m) : p;
    }

    function pintar() {
      grupo.setAttribute("transform", "translate(" + plano.px(z.re) + "," + plano.py(z.im) + ")");
      etiqueta.setAttribute("x", plano.px(z.re) + 13);
      etiqueta.setAttribute("y", plano.py(z.im) - 12);
      grupo.setAttribute("aria-label",
        (op.nombre || "Punto") + " = " + formatoComplejo(z).replace(/ /g, "") +
        ". Usa las flechas del teclado para moverlo.");
    }

    function mover(p, avisar) {
      z = ajustar(p);
      pintar();
      if (avisar !== false && op.onCambio) {
        op.onCambio(z);
      }
    }

    var arrastrando = false;
    grupo.addEventListener("pointerdown", function (e) {
      arrastrando = true;
      grupo.setPointerCapture(e.pointerId);
      grupo.focus();
      e.preventDefault();
    });
    grupo.addEventListener("pointermove", function (e) {
      if (arrastrando) {
        var p = plano.aComplejo(e);
        mover(complejo(redondear(p.re, 1), redondear(p.im, 1)));
      }
    });
    function soltar(e) {
      arrastrando = false;
      if (grupo.hasPointerCapture && grupo.hasPointerCapture(e.pointerId)) {
        grupo.releasePointerCapture(e.pointerId);
      }
    }
    grupo.addEventListener("pointerup", soltar);
    grupo.addEventListener("pointercancel", soltar);
    grupo.addEventListener("keydown", function (e) {
      var paso = e.shiftKey ? 0.5 : 0.1;
      var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (d) {
        e.preventDefault();
        mover(complejo(redondear(z.re + d[0] * paso, 1), redondear(z.im + d[1] * paso, 1)));
      }
    });

    pintar();
    return {
      obtener: function () { return z; },
      establecer: function (p, avisar) { mover(p, avisar); }
    };
  };

  return plano;
}
