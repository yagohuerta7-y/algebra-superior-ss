/*
  Utilidades de dibujo del tema "Espacios vectoriales": plano con vectores
  arrastrables (SVG) y gráficas de funciones.
*/

var NS_EV = "http://www.w3.org/2000/svg";
var TAM_EV = 420;

function elementoSvg(nombre, atributos) {
  var el = document.createElementNS(NS_EV, nombre);
  Object.keys(atributos || {}).forEach(function (k) {
    el.setAttribute(k, atributos[k]);
  });
  return el;
}

function formatoNum(x) {
  var r = Math.round(x * 100) / 100;
  return String(r === 0 ? 0 : r);
}

/*
  Plano cartesiano [-rango, rango]². Las figuras se dibujan en `capa` (se borra
  con limpiar()); los puntos arrastrables persisten encima.
*/
function crearPlanoVec(contenedor, opciones) {
  var rango = opciones.rango || 6;
  var esc = TAM_EV / (2 * rango);
  function px(x) {
    return TAM_EV / 2 + x * esc;
  }
  function py(y) {
    return TAM_EV / 2 - y * esc;
  }

  contenedor.innerHTML = "";
  var svg = elementoSvg("svg", {
    viewBox: "0 0 " + TAM_EV + " " + TAM_EV,
    class: "plano-vec",
    role: "img",
    "aria-label": opciones.etiqueta || "Plano cartesiano"
  });
  var idClip = (opciones.idPrefijo || "plano") + "-clip";
  var defs = elementoSvg("defs", {});
  var clip = elementoSvg("clipPath", { id: idClip });
  clip.appendChild(elementoSvg("rect", { x: 0, y: 0, width: TAM_EV, height: TAM_EV }));
  defs.appendChild(clip);
  svg.appendChild(defs);

  for (var k = -rango; k <= rango; k++) {
    svg.appendChild(elementoSvg("line", { x1: px(k), y1: 0, x2: px(k), y2: TAM_EV, class: "ev-rejilla" }));
    svg.appendChild(elementoSvg("line", { x1: 0, y1: py(k), x2: TAM_EV, y2: py(k), class: "ev-rejilla" }));
    if (k !== 0 && k % 2 === 0) {
      var tx = elementoSvg("text", { x: px(k) + 2, y: py(0) + 12, class: "ev-marca" });
      tx.textContent = String(k);
      svg.appendChild(tx);
      var ty = elementoSvg("text", { x: px(0) + 4, y: py(k) - 3, class: "ev-marca" });
      ty.textContent = String(k);
      svg.appendChild(ty);
    }
  }
  svg.appendChild(elementoSvg("line", { x1: 0, y1: py(0), x2: TAM_EV, y2: py(0), class: "ev-eje" }));
  svg.appendChild(elementoSvg("line", { x1: px(0), y1: 0, x2: px(0), y2: TAM_EV, class: "ev-eje" }));

  var capa = elementoSvg("g", { "clip-path": "url(#" + idClip + ")" });
  svg.appendChild(capa);
  var capaMangos = elementoSvg("g", {});
  svg.appendChild(capaMangos);
  contenedor.appendChild(svg);

  var plano = {
    svg: svg,
    rango: rango,
    px: px,
    py: py,
    limpiar: function () {
      while (capa.firstChild) {
        capa.removeChild(capa.firstChild);
      }
    },
    segmento: function (x1, y1, x2, y2, clase) {
      capa.appendChild(elementoSvg("line", { x1: px(x1), y1: py(y1), x2: px(x2), y2: py(y2), class: clase }));
    },
    flecha: function (x1, y1, x2, y2, clase, etiqueta) {
      var ax = px(x1), ay = py(y1), bx = px(x2), by = py(y2);
      var dx = bx - ax, dy = by - ay;
      var largo = Math.sqrt(dx * dx + dy * dy);
      if (largo < 1) {
        return;
      }
      var ux = dx / largo, uy = dy / largo;
      var cola = Math.min(11, largo * 0.6);
      var baseX = bx - ux * cola, baseY = by - uy * cola;
      var g = elementoSvg("g", { class: clase });
      g.appendChild(elementoSvg("line", { x1: ax, y1: ay, x2: baseX, y2: baseY, class: "ev-flecha" }));
      g.appendChild(
        elementoSvg("polygon", {
          class: "ev-cabeza",
          points: bx + "," + by + " " + (baseX - uy * 5) + "," + (baseY + ux * 5) + " " + (baseX + uy * 5) + "," + (baseY - ux * 5)
        })
      );
      if (etiqueta) {
        var t = elementoSvg("text", { x: bx + 8, y: by - 8, class: "ev-etiqueta" });
        t.textContent = etiqueta;
        g.appendChild(t);
      }
      capa.appendChild(g);
    },
    punto: function (x, y, clase, forma, etiqueta) {
      var g = elementoSvg("g", { class: clase });
      if (forma === "cruz") {
        g.appendChild(elementoSvg("path", { d: "M" + (px(x) - 7) + "," + (py(y) - 7) + "L" + (px(x) + 7) + "," + (py(y) + 7) + "M" + (px(x) - 7) + "," + (py(y) + 7) + "L" + (px(x) + 7) + "," + (py(y) - 7), "stroke-width": 3.5, fill: "none" }));
      } else {
        g.appendChild(elementoSvg("circle", { cx: px(x), cy: py(y), r: 6 }));
      }
      if (etiqueta) {
        var t = elementoSvg("text", { x: px(x) + 9, y: py(y) - 9, class: "ev-etiqueta" });
        t.textContent = etiqueta;
        g.appendChild(t);
      }
      capa.appendChild(g);
    },
    /* Recta y = m x + c recortada al cuadro. */
    recta: function (m, c, clase) {
      var x1 = -rango, x2 = rango;
      plano.segmento(x1, m * x1 + c, x2, m * x2 + c, clase);
    },
    /* Punto arrastrable con mouse, tacto y flechas del teclado. */
    puntoArrastrable: function (op) {
      var estado = { x: op.x, y: op.y };
      var paso = op.paso || 0.5;
      var g = elementoSvg("g", { class: "ev-mango " + (op.clase || ""), tabindex: "0", role: "slider", "aria-valuemin": String(-rango), "aria-valuemax": String(rango) });
      var zona = elementoSvg("circle", { r: 17, class: "ev-mango-zona" });
      var visible = elementoSvg("circle", { r: 7 });
      var texto = elementoSvg("text", { class: "ev-etiqueta", dx: 11, dy: -10 });
      texto.textContent = op.nombre;
      g.appendChild(zona);
      g.appendChild(visible);
      g.appendChild(texto);
      capaMangos.appendChild(g);

      function aplicar(avisar) {
        g.setAttribute("transform", "translate(" + px(estado.x) + "," + py(estado.y) + ")");
        g.setAttribute("aria-valuenow", formatoNum(estado.x));
        g.setAttribute("aria-valuetext", op.nombre + " = (" + formatoNum(estado.x) + ", " + formatoNum(estado.y) + ")");
        g.setAttribute("aria-label", "Punta del vector " + op.nombre + ". Usa las flechas del teclado para moverlo.");
        if (avisar && op.onCambio) {
          op.onCambio(estado.x, estado.y);
        }
      }
      function fijar(x, y) {
        var m = rango - 0.5;
        estado.x = Math.max(-m, Math.min(m, Math.round(x / paso) * paso));
        estado.y = Math.max(-m, Math.min(m, Math.round(y / paso) * paso));
      }
      function desdeEvento(e) {
        var r = svg.getBoundingClientRect();
        var sx = ((e.clientX - r.left) / r.width) * TAM_EV;
        var sy = ((e.clientY - r.top) / r.height) * TAM_EV;
        fijar((sx - TAM_EV / 2) / esc, -(sy - TAM_EV / 2) / esc);
        aplicar(true);
      }
      g.addEventListener("pointerdown", function (e) {
        g.setPointerCapture(e.pointerId);
        g.dataset.arrastrando = "1";
        desdeEvento(e);
        e.preventDefault();
      });
      g.addEventListener("pointermove", function (e) {
        if (g.dataset.arrastrando === "1") {
          desdeEvento(e);
        }
      });
      g.addEventListener("pointerup", function () {
        g.dataset.arrastrando = "0";
      });
      g.addEventListener("keydown", function (e) {
        var dx = 0, dy = 0;
        if (e.key === "ArrowLeft") dx = -paso;
        else if (e.key === "ArrowRight") dx = paso;
        else if (e.key === "ArrowUp") dy = paso;
        else if (e.key === "ArrowDown") dy = -paso;
        else return;
        fijar(estado.x + dx, estado.y + dy);
        aplicar(true);
        e.preventDefault();
      });
      aplicar(false);
      return {
        obtener: function () {
          return [estado.x, estado.y];
        },
        establecer: function (x, y, avisar) {
          fijar(x, y);
          aplicar(avisar);
        }
      };
    }
  };
  return plano;
}

/* Gráfica de funciones en [xmin, xmax] × [ymin, ymax]. */
function crearGrafica(contenedor, opciones) {
  var ancho = 420, alto = 300;
  var xmin = opciones.xmin, xmax = opciones.xmax, ymin = opciones.ymin, ymax = opciones.ymax;
  function px(x) {
    return ((x - xmin) / (xmax - xmin)) * ancho;
  }
  function py(y) {
    return alto - ((y - ymin) / (ymax - ymin)) * alto;
  }
  contenedor.innerHTML = "";
  var svg = elementoSvg("svg", { viewBox: "0 0 " + ancho + " " + alto, class: "grafica-svg", role: "img", "aria-label": opciones.etiqueta || "Gráfica" });
  var idClip = (opciones.idPrefijo || "graf") + "-clip";
  var defs = elementoSvg("defs", {});
  var clip = elementoSvg("clipPath", { id: idClip });
  clip.appendChild(elementoSvg("rect", { x: 0, y: 0, width: ancho, height: alto }));
  defs.appendChild(clip);
  svg.appendChild(defs);
  var paso = opciones.pasoRejilla || 1;
  for (var x = Math.ceil(xmin / paso) * paso; x <= xmax; x += paso) {
    svg.appendChild(elementoSvg("line", { x1: px(x), y1: 0, x2: px(x), y2: alto, class: "ev-rejilla" }));
  }
  var pasoY = opciones.pasoRejillaY || paso;
  for (var y = Math.ceil(ymin / pasoY) * pasoY; y <= ymax; y += pasoY) {
    svg.appendChild(elementoSvg("line", { x1: 0, y1: py(y), x2: ancho, y2: py(y), class: "ev-rejilla" }));
  }
  svg.appendChild(elementoSvg("line", { x1: 0, y1: py(0), x2: ancho, y2: py(0), class: "ev-eje" }));
  svg.appendChild(elementoSvg("line", { x1: px(0), y1: 0, x2: px(0), y2: alto, class: "ev-eje" }));
  var capa = elementoSvg("g", { "clip-path": "url(#" + idClip + ")" });
  svg.appendChild(capa);
  contenedor.appendChild(svg);
  return {
    limpiar: function () {
      while (capa.firstChild) {
        capa.removeChild(capa.firstChild);
      }
    },
    curva: function (f, clase) {
      var d = "";
      var n = 240;
      for (var i = 0; i <= n; i++) {
        var xx = xmin + ((xmax - xmin) * i) / n;
        d += (i === 0 ? "M" : "L") + px(xx).toFixed(1) + "," + py(f(xx)).toFixed(1);
      }
      capa.appendChild(elementoSvg("path", { d: d, class: "ev-curva " + clase }));
    }
  };
}
