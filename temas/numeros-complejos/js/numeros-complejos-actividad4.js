/*
  Actividad 4: las raíces n-ésimas de la unidad son los vértices de un
  polígono regular; multiplicar por ω = e^{2πi/n} gira el polígono un paso.
*/

var estadoActividad4 = { plano: null, n: 6, k: 0 };

function initActividad4() {
  var contenedor = document.getElementById("act4-plano");
  if (!contenedor) {
    return;
  }
  var e = estadoActividad4;
  e.plano = crearPlano(contenedor, {
    rango: 1.6, circuloUnitario: true, etiqueta: "Raíces n-ésimas de la unidad en el plano complejo"
  });
  var deslizador = document.getElementById("act4-n");
  deslizador.addEventListener("input", function () {
    e.n = parseInt(deslizador.value, 10);
    e.k = 0;
    actualizarActividad4();
  });
  document.getElementById("act4-paso").addEventListener("click", function () {
    e.k = (e.k + 1) % e.n;
    actualizarActividad4();
  });
  actualizarActividad4();
}

function actualizarActividad4() {
  var e = estadoActividad4;
  var plano = e.plano;
  var n = e.n;
  var vertices = [];
  var j;
  for (j = 0; j < n; j++) {
    vertices.push(desdePolar(1, (2 * Math.PI * j) / n));
  }

  plano.limpiar();
  plano.polilinea(vertices, "pc-w", true);
  vertices.forEach(function (v, idx) {
    plano.segmento(complejo(0, 0), v, "pc-rayo");
    plano.punto(v, idx === e.k ? "pc-z" : "pc-p", idx === e.k ? 8 : 5);
  });
  var actual = vertices[e.k];
  var siguiente = vertices[(e.k + 1) % n];
  plano.arco(0.35, (2 * Math.PI * e.k) / n, (2 * Math.PI * (e.k + 1)) / n, "pc-z");
  plano.flecha(complejo(0, 0), actual, "pc-z");
  plano.punto(siguiente, "pc-p", 7);

  katexRender(
    "\\omega = e^{2\\pi i/" + n + "} = \\cos " + num(360 / n) + "^\\circ + i\\,\\sin " + num(360 / n) + "^\\circ",
    document.getElementById("act4-lectura-omega"), false);
  katexRender(
    "\\omega^{" + e.k + "} = " + formatoComplejo(actual) + " \;\\xrightarrow{\\ \\times\\,\\omega\\ }\; \\omega^{" +
    ((e.k + 1) % n) + "} = " + formatoComplejo(siguiente),
    document.getElementById("act4-lectura-paso"), false);
}
