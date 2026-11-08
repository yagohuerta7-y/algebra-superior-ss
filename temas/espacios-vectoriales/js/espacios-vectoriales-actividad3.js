/*
  Actividad 3: polinomios de grado ≤ 3 como vectores. La suma de polinomios es la
  suma de sus coeficientes.
*/

function initActividad3() {
  var graf = crearGrafica(document.getElementById("act3-grafica"), {
    xmin: -3, xmax: 3, ymin: -10, ymax: 10, pasoRejilla: 1, pasoRejillaY: 5,
    idPrefijo: "act3",
    etiqueta: "Gráficas de los polinomios p, q, su suma y un múltiplo escalar de p"
  });
  var potencias = ["1", "x", "x^2", "x^3"];
  var sp = [], sq = [];
  var contSliders = document.getElementById("act3-sliders");
  var rc = document.getElementById("act3-c");
  var textoC = document.getElementById("act3-c-valor");
  var tabla = document.getElementById("act3-tabla");
  var lectura = document.getElementById("act3-lectura");

  function crearSlider(prefijo, i, lista, inicial) {
    var cont = document.createElement("div");
    var etiqueta = document.createElement("label");
    var valor = document.createElement("span");
    var id = "act3-" + prefijo + i;
    etiqueta.setAttribute("for", id);
    etiqueta.appendChild(document.createTextNode("Coeficiente de "));
    var m = document.createElement("span");
    katexRender(prefijo + "_" + i + " \\ (\\text{de } " + potencias[i] + ")", m);
    etiqueta.appendChild(m);
    etiqueta.appendChild(document.createTextNode(" = "));
    etiqueta.appendChild(valor);
    var fila = document.createElement("div");
    fila.className = "fila-rango";
    var r = document.createElement("input");
    r.type = "range";
    r.id = id;
    r.min = "-3";
    r.max = "3";
    r.step = "1";
    r.value = String(inicial);
    r.addEventListener("input", actualizar);
    fila.appendChild(r);
    cont.appendChild(etiqueta);
    cont.appendChild(fila);
    lista.push({ input: r, valor: valor });
    return cont;
  }

  var inicialP = [1, -1, 0, 1];
  var inicialQ = [0, 2, 1, -1];
  var colP = document.createElement("div");
  var colQ = document.createElement("div");
  var tp = document.createElement("h4");
  tp.textContent = "Polinomio p";
  var tq = document.createElement("h4");
  tq.textContent = "Polinomio q";
  colP.appendChild(tp);
  colQ.appendChild(tq);
  for (var i = 0; i < 4; i++) {
    colP.appendChild(crearSlider("a", i, sp, inicialP[i]));
    colQ.appendChild(crearSlider("b", i, sq, inicialQ[i]));
  }
  contSliders.appendChild(colP);
  contSliders.appendChild(colQ);

  function leer(lista) {
    return lista.map(function (s) {
      return Number(s.input.value);
    });
  }

  function polinomioLatex(c) {
    var partes = [];
    for (var k = 3; k >= 0; k--) {
      var v = c[k];
      if (v === 0) {
        continue;
      }
      var abs = Math.abs(v);
      var termino = k === 0 ? formatoNum(abs) : (abs === 1 ? "" : formatoNum(abs)) + potencias[k];
      partes.push((v < 0 ? "-" : partes.length ? "+" : "") + termino);
    }
    return partes.length ? partes.join(" ") : "0";
  }

  function evaluar(c, x) {
    return c[0] + c[1] * x + c[2] * x * x + c[3] * x * x * x;
  }

  function filaTabla(nombre, coef, clase) {
    var tr = document.createElement("tr");
    if (clase) {
      tr.className = clase;
    }
    var th = document.createElement("th");
    th.scope = "row";
    katexRender(nombre, th);
    tr.appendChild(th);
    coef.forEach(function (v) {
      var td = document.createElement("td");
      td.textContent = formatoNum(v);
      tr.appendChild(td);
    });
    return tr;
  }

  function actualizar() {
    var p = leer(sp), q = leer(sq), c = Number(rc.value);
    sp.concat(sq).forEach(function (s) {
      s.valor.textContent = s.input.value;
    });
    textoC.textContent = formatoNum(c);
    var suma = p.map(function (v, k) {
      return v + q[k];
    });
    var esc = p.map(function (v) {
      return c * v;
    });

    graf.limpiar();
    graf.curva(function (x) { return evaluar(esc, x); }, "curva-esc");
    graf.curva(function (x) { return evaluar(suma, x); }, "curva-suma");
    graf.curva(function (x) { return evaluar(q, x); }, "curva-q");
    graf.curva(function (x) { return evaluar(p, x); }, "curva-p");

    tabla.innerHTML = "";
    var cab = document.createElement("thead");
    var trc = document.createElement("tr");
    var vacio = document.createElement("th");
    vacio.textContent = "Vector (coordenadas)";
    trc.appendChild(vacio);
    potencias.forEach(function (pot) {
      var th = document.createElement("th");
      th.scope = "col";
      katexRender("\\text{coef. de } " + pot, th);
      trc.appendChild(th);
    });
    cab.appendChild(trc);
    tabla.appendChild(cab);
    var cuerpo = document.createElement("tbody");
    cuerpo.appendChild(filaTabla("p", p));
    cuerpo.appendChild(filaTabla("q", q));
    cuerpo.appendChild(filaTabla("p + q", suma, "fila-suma"));
    cuerpo.appendChild(filaTabla(formatoNum(c) + "\\,p", esc));
    tabla.appendChild(cuerpo);

    katexRender(
      "p = " + polinomioLatex(p) + ",\\quad q = " + polinomioLatex(q) + "\\\\[4pt] p + q = " + polinomioLatex(suma) + ",\\quad " + formatoNum(c) + "\\,p = " + polinomioLatex(esc),
      lectura,
      true
    );
  }

  rc.addEventListener("input", actualizar);
  actualizar();
}
