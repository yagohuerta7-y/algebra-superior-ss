/*
  Actividad 2: multiplicar por z deforma todo el plano como una rotación
  seguida (o acompañada) de un escalamiento. Se transforma una cuadrícula y
  una figura; el deslizador t interpola el giro y el escalamiento.
*/

var estadoActividad2 = { plano: null, pz: null, t: 1, animacion: null };

var CASA_ACTIVIDAD2 = [
  complejo(0.5, 0.2), complejo(1.5, 0.2), complejo(1.5, 1),
  complejo(1, 1.5), complejo(0.5, 1)
];

function initActividad2() {
  var contenedor = document.getElementById("act2-plano");
  if (!contenedor) {
    return;
  }
  var e = estadoActividad2;
  e.plano = crearPlano(contenedor, { rango: 4, etiqueta: "Plano complejo con una figura transformada al multiplicar por z" });
  e.pz = e.plano.puntoArrastrable({
    z: complejo(1, 1), clase: "pc-z", nombre: "z", maxMod: 2, onCambio: actualizarActividad2
  });

  var deslizador = document.getElementById("act2-t");
  deslizador.addEventListener("input", function () {
    detenerAnimacionActividad2();
    e.t = parseFloat(deslizador.value);
    actualizarActividad2();
  });

  var presets = {
    "act2-ej-i": complejo(0, 1),
    "act2-ej-2": complejo(2, 0),
    "act2-ej-menos1": complejo(-1, 0),
    "act2-ej-1mas-i": complejo(1, 1),
    "act2-ej-mitad": complejo(0.5, 0)
  };
  Object.keys(presets).forEach(function (id) {
    document.getElementById(id).addEventListener("click", function () {
      detenerAnimacionActividad2();
      e.pz.establecer(presets[id], false);
      actualizarActividad2();
    });
  });

  document.getElementById("act2-animar").addEventListener("click", function () {
    detenerAnimacionActividad2();
    if (prefiereMenosMovimiento()) {
      e.t = 1;
      deslizador.value = 1;
      actualizarActividad2();
      return;
    }
    var inicio = null;
    function paso(ahora) {
      if (inicio === null) {
        inicio = ahora;
      }
      var progreso = Math.min(1, (ahora - inicio) / 2500);
      e.t = progreso;
      deslizador.value = progreso;
      actualizarActividad2();
      e.animacion = progreso < 1 ? requestAnimationFrame(paso) : null;
    }
    e.animacion = requestAnimationFrame(paso);
  });

  actualizarActividad2();
}

function detenerAnimacionActividad2() {
  if (estadoActividad2.animacion !== null) {
    cancelAnimationFrame(estadoActividad2.animacion);
    estadoActividad2.animacion = null;
  }
}

function actualizarActividad2() {
  var e = estadoActividad2;
  var plano = e.plano;
  var z = e.pz.obtener();
  var r = moduloComplejo(z);
  var theta = Math.atan2(z.im, z.re);
  /* Multiplicador parcial: módulo r^t y ángulo t·θ (en t = 1 es exactamente z). */
  var m = r < 1e-9 ? complejo(e.t === 0 ? 1 : 0, 0) : desdePolar(Math.pow(r, e.t), e.t * theta);
  var origen = complejo(0, 0);

  plano.limpiar();

  /* Cuadrícula transformada. */
  var k;
  for (k = -3; k <= 3; k++) {
    plano.segmento(multiplicarComplejos(m, complejo(-3, k)), multiplicarComplejos(m, complejo(3, k)), "pc-rejilla");
    plano.segmento(multiplicarComplejos(m, complejo(k, -3)), multiplicarComplejos(m, complejo(k, 3)), "pc-rejilla");
  }

  /* Figura original (discontinua) y transformada. */
  plano.polilinea(CASA_ACTIVIDAD2, "pc-original", true);
  plano.polilinea(CASA_ACTIVIDAD2.map(function (p) { return multiplicarComplejos(m, p); }), "pc-w", true, true);

  /* Imágenes de 1 e i: las columnas de la matriz. */
  var uno = complejo(1, 0), i = complejo(0, 1);
  plano.flecha(origen, multiplicarComplejos(m, uno), "pc-p");
  plano.flecha(origen, multiplicarComplejos(m, i), "pc-z");
  plano.texto(multiplicarComplejos(m, uno), "1·z", "pc-p", 8, 16);
  plano.texto(multiplicarComplejos(m, i), "i·z", "pc-z", 8, -8);

  katexRender(
    "t = " + num(e.t) + ":\\quad \\text{giro de } " + num(aGrados(e.t * theta)) +
    "^\\circ \\ \\text{y escala de } " + num(Math.pow(r, e.t)),
    document.getElementById("act2-lectura-t"), false);
  katexRender(
    "z = " + formatoComplejo(z) + " \;\\Rightarrow\; " +
    "\\begin{pmatrix} " + num(m.re) + " & " + num(-m.im) + " \\\\ " + num(m.im) + " & " + num(m.re) + " \\end{pmatrix}",
    document.getElementById("act2-lectura-matriz"), true);
}
