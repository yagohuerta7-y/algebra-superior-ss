/*
  Actividad 2: simetrías del triángulo y del cuadrado (grupos diedrales).
  El estado es un elemento del grupo; cada botón multiplica por la izquierda
  (r ∗ estado, s ∗ estado), así que la celda de la tabla es (fila = botón,
  columna = estado anterior).
*/

var TAM_POLIGONO = 300;
var RADIO_POLIGONO = 105;

function initActividad2() {
  var selector = document.getElementById("act2-n");
  var contFigura = document.getElementById("act2-figura");
  var descripcion = document.getElementById("act2-descripcion");
  var contEstado = document.getElementById("act2-estado");
  var contOrden = document.getElementById("act2-orden");
  var contPasos = document.getElementById("act2-pasos");
  var contTabla = document.getElementById("act2-tabla");
  var contConmuta = document.getElementById("act2-conmuta");
  var botonR = document.getElementById("act2-r");
  var botonS = document.getElementById("act2-s");
  var botonDeshacer = document.getElementById("act2-deshacer");
  var botonReiniciar = document.getElementById("act2-reiniciar");

  var NS = "http://www.w3.org/2000/svg";
  var est = null;
  var n = 0;
  var tabla = null;
  var actual = 0;
  var pasos = [];
  var vertices = [];

  function ranura(i) {
    var angulo = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return {
      x: TAM_POLIGONO / 2 + RADIO_POLIGONO * Math.cos(angulo),
      y: TAM_POLIGONO / 2 + RADIO_POLIGONO * Math.sin(angulo)
    };
  }

  function construirFigura() {
    contFigura.innerHTML = "";
    vertices = [];
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + TAM_POLIGONO + " " + TAM_POLIGONO);
    svg.setAttribute("class", "poligono-svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", n === 3 ? "Triángulo equilátero con vértices numerados" : "Cuadrado con vértices numerados");

    var puntos = [];
    for (var i = 0; i < n; i++) {
      var p = ranura(i);
      puntos.push(p.x + "," + p.y);
    }
    var contorno = document.createElementNS(NS, "polygon");
    contorno.setAttribute("points", puntos.join(" "));
    contorno.setAttribute("class", "poligono-contorno");
    svg.appendChild(contorno);

    var eje = document.createElementNS(NS, "line");
    eje.setAttribute("x1", String(TAM_POLIGONO / 2));
    eje.setAttribute("x2", String(TAM_POLIGONO / 2));
    eje.setAttribute("y1", "8");
    eje.setAttribute("y2", String(TAM_POLIGONO - 8));
    eje.setAttribute("class", "poligono-eje");
    svg.appendChild(eje);
    var textoEje = document.createElementNS(NS, "text");
    textoEje.setAttribute("x", String(TAM_POLIGONO / 2 + 6));
    textoEje.setAttribute("y", String(TAM_POLIGONO - 12));
    textoEje.setAttribute("class", "poligono-eje-texto");
    textoEje.textContent = "eje de s";
    svg.appendChild(textoEje);

    for (var k = 0; k < n; k++) {
      var base = ranura(k);
      var hueco = document.createElementNS(NS, "circle");
      hueco.setAttribute("cx", String(base.x));
      hueco.setAttribute("cy", String(base.y));
      hueco.setAttribute("r", "22");
      hueco.setAttribute("class", "poligono-ranura");
      svg.appendChild(hueco);
    }

    for (var v = 0; v < n; v++) {
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "vertice-poligono");
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("r", "17");
      c.setAttribute("class", "vertice-circulo");
      c.style.setProperty("--h", String(tonoDeElemento(v, n)));
      var t = document.createElementNS(NS, "text");
      t.setAttribute("class", "vertice-texto");
      t.textContent = String(v + 1);
      g.appendChild(c);
      g.appendChild(t);
      svg.appendChild(g);
      vertices.push(g);
    }
    contFigura.appendChild(svg);
  }

  function ordenDe(indice) {
    var neutro = 0;
    var k = 1;
    var valor = indice;
    while (valor !== neutro && k < 100) {
      valor = est.tabla[indice][valor];
      k++;
    }
    return k;
  }

  function nombreLatex(i) {
    return est.elementos[i].latex;
  }

  function pintar() {
    var perm = est.perms[actual];
    var enRanura = [];
    for (var v = 0; v < n; v++) {
      var p = ranura(perm[v]);
      vertices[v].style.transform = "translate(" + p.x + "px, " + p.y + "px)";
      enRanura[perm[v]] = v + 1;
    }
    katexRender("\\text{Estás en } " + nombreLatex(actual), contEstado, true);
    var orden = ordenDe(actual);
    descripcion.textContent = "Etiquetas de los vértices, desde arriba y en sentido horario: " + enRanura.join(", ") + ".";
    contOrden.textContent =
      (actual === 0 ? "Es el neutro: no hace nada. " : "Orden de este elemento: " + orden + " (repetirlo " + orden + " veces regresa al inicio). ") +
      descripcion.textContent;

    if (pasos.length === 0) {
      contPasos.textContent = "Todavía no has hecho ningún movimiento.";
    } else {
      var nombres = pasos.map(function (g) {
        return g === 1 ? "r" : "s";
      });
      contPasos.innerHTML = "";
      contPasos.appendChild(document.createTextNode("Movimientos (en orden): " + nombres.join(", ") + ". "));
      if (pasos.length <= 6) {
        var span = document.createElement("span");
        contPasos.appendChild(span);
        katexRender(nombres.slice().reverse().join(" \\ast ") + " = " + nombreLatex(actual), span);
      }
    }
    botonDeshacer.disabled = pasos.length === 0;
  }

  function aplicar(g) {
    var anterior = actual;
    actual = est.tabla[g][anterior];
    pasos.push(g);
    pintar();
    tabla.enfocar(g, anterior);
  }

  function deshacer() {
    if (pasos.length === 0) {
      return;
    }
    pasos.pop();
    actual = 0;
    pasos.forEach(function (g) {
      actual = est.tabla[g][actual];
    });
    pintar();
    tabla.limpiar();
  }

  function reiniciar() {
    actual = 0;
    pasos = [];
    pintar();
    tabla.limpiar();
  }

  function cambiarPoligono() {
    n = Number(selector.value);
    est = estructuraDiedral(n);
    actual = 0;
    pasos = [];
    construirFigura();
    tabla = crearTablaOperacion(contTabla, {
      estructura: est,
      idPrefijo: "act2-tabla",
      resaltarInversos: true,
      mostrarLatino: false
    });
    var rs = est.tabla[1][n];
    var sr = est.tabla[n][1];
    katexRender(
      "r \\ast s = " + nombreLatex(rs) + " \\qquad\\text{pero}\\qquad s \\ast r = " + nombreLatex(sr) + " \\quad\\Rightarrow\\quad r \\ast s \\neq s \\ast r",
      contConmuta,
      true
    );
    pintar();
  }

  botonR.addEventListener("click", function () {
    aplicar(1);
  });
  botonS.addEventListener("click", function () {
    aplicar(n);
  });
  botonDeshacer.addEventListener("click", deshacer);
  botonReiniciar.addEventListener("click", reiniciar);
  selector.addEventListener("change", cambiarPoligono);

  cambiarPoligono();
}
