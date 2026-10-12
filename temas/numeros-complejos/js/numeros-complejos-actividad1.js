/*
  Actividad 1: multiplicar dos complejos arrastrables z y w. Se muestra que
  los módulos se multiplican y los ángulos se suman.
*/

var estadoActividad1 = { plano: null, pz: null, pw: null };

function initActividad1() {
  var contenedor = document.getElementById("act1-plano");
  if (!contenedor) {
    return;
  }
  estadoActividad1.plano = crearPlano(contenedor, {
    rango: 5,
    circuloUnitario: true,
    etiqueta: "Plano complejo con z, w y su producto zw"
  });
  estadoActividad1.pz = estadoActividad1.plano.puntoArrastrable({
    z: complejo(1.5, 0.5), clase: "pc-z", nombre: "z", maxMod: 2.2, onCambio: actualizarActividad1
  });
  estadoActividad1.pw = estadoActividad1.plano.puntoArrastrable({
    z: complejo(0.5, 1.5), clase: "pc-w", nombre: "w", maxMod: 2.2, onCambio: actualizarActividad1
  });

  var ejemplos = {
    "act1-ej-i": [complejo(1.5, 1), complejo(0, 1)],
    "act1-ej-conj": [complejo(1.5, 1), complejo(1.5, -1)],
    "act1-ej-menos1": [complejo(1.5, 1), complejo(-1, 0)],
    "act1-ej-inicial": [complejo(1.5, 0.5), complejo(0.5, 1.5)]
  };
  Object.keys(ejemplos).forEach(function (id) {
    var boton = document.getElementById(id);
    if (boton) {
      boton.addEventListener("click", function () {
        estadoActividad1.pz.establecer(ejemplos[id][0], false);
        estadoActividad1.pw.establecer(ejemplos[id][1], false);
        actualizarActividad1();
      });
    }
  });

  actualizarActividad1();
}

function actualizarActividad1() {
  var e = estadoActividad1;
  var plano = e.plano;
  var z = e.pz.obtener();
  var w = e.pw.obtener();
  var p = multiplicarComplejos(z, w);
  var origen = complejo(0, 0);
  var uno = complejo(1, 0);

  var rz = moduloComplejo(z), rw = moduloComplejo(w), rp = moduloComplejo(p);
  var tz = argumentoComplejo(z), tw = argumentoComplejo(w), tp = argumentoComplejo(p);

  plano.limpiar();
  /* Arcos: arg z desde el eje real; arg w a partir de z; arg(zw) desde el eje real. */
  if (rz > 0.05) {
    plano.arco(0.55, 0, tz, "pc-z");
  }
  if (rz > 0.05 && rw > 0.05) {
    plano.arco(0.85, tz, tz + tw, "pc-w");
  }
  if (rp > 0.05) {
    plano.arco(1.15, 0, tp, "pc-p");
  }
  plano.flecha(origen, z, "pc-z");
  plano.flecha(origen, w, "pc-w");
  plano.flecha(origen, p, "pc-p");
  plano.punto(uno, "pc-ref", 4);
  plano.texto(uno, "1", "pc-ref", 6, 16);
  plano.texto(p, "zw", "pc-p", 12, -10);

  var gz = aGrados(tz), gw = aGrados(tw), gp = aGrados(tp);
  var suma = gz + gw;
  katexRender(
    "z = " + formatoComplejo(z) + ",\\quad |z| = " + num(rz) + ",\\quad \\arg z = " + num(gz) + "^\\circ",
    document.getElementById("act1-lectura-z"), false);
  katexRender(
    "w = " + formatoComplejo(w) + ",\\quad |w| = " + num(rw) + ",\\quad \\arg w = " + num(gw) + "^\\circ",
    document.getElementById("act1-lectura-w"), false);
  katexRender(
    "zw = " + formatoComplejo(p) + ",\\quad |zw| = |z||w| = " + num(rz) + "\\cdot" + num(rw) + " = " + num(rz * rw),
    document.getElementById("act1-lectura-producto"), false);
  katexRender(
    "\\arg(zw) = \\arg z + \\arg w = " + num(gz) + "^\\circ + " + num(gw) + "^\\circ = " + num(suma) +
    "^\\circ \\equiv " + num(gp) + "^\\circ \\pmod{360^\\circ}",
    document.getElementById("act1-lectura-angulo"), false);

  var aviso = document.getElementById("act1-mensaje");
  if (aviso) {
    aviso.textContent = "zw = " + formatoComplejo(p).replace(/ /g, "") + ", con módulo " + num(rp) +
      " y ángulo " + num(gp) + " grados.";
  }
}
