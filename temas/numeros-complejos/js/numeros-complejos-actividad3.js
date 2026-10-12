/*
  Actividad 3: las potencias z, z², z³, … trazan una espiral (si |z| ≠ 1) o
  un polígono regular inscrito en el círculo unitario (si |z| = 1 y el
  ángulo es racional respecto de 360°).
*/

var estadoActividad3 = { plano: null, pz: null, n: 8 };

function initActividad3() {
  var contenedor = document.getElementById("act3-plano");
  if (!contenedor) {
    return;
  }
  var e = estadoActividad3;
  e.plano = crearPlano(contenedor, {
    rango: 3, circuloUnitario: true, etiqueta: "Plano complejo con las potencias de z"
  });
  e.pz = e.plano.puntoArrastrable({
    z: complejo(0.9, 0.4), clase: "pc-z", nombre: "z", maxMod: 1.7, onCambio: actualizarActividad3
  });

  var deslizador = document.getElementById("act3-n");
  deslizador.addEventListener("input", function () {
    e.n = parseInt(deslizador.value, 10);
    actualizarActividad3();
  });
  document.getElementById("act3-unitario").addEventListener("click", function () {
    var z = e.pz.obtener();
    var r = moduloComplejo(z);
    e.pz.establecer(r < 1e-9 ? complejo(1, 0) : complejo(z.re / r, z.im / r), false);
    actualizarActividad3();
  });
  document.getElementById("act3-ej-sexto").addEventListener("click", function () {
    e.pz.establecer(desdePolar(1, Math.PI / 3), false);
    actualizarActividad3();
  });

  actualizarActividad3();
}

function actualizarActividad3() {
  var e = estadoActividad3;
  var plano = e.plano;
  var z = e.pz.obtener();
  var r = moduloComplejo(z);
  var pot = complejo(1, 0);
  var puntos = [pot];
  var k;

  for (k = 1; k <= e.n; k++) {
    pot = multiplicarComplejos(pot, z);
    puntos.push(pot);
    if (moduloComplejo(pot) > plano.rango * 1.6) {
      break;
    }
  }

  plano.limpiar();
  plano.polilinea(puntos, "pc-w", false);
  puntos.forEach(function (p, j) {
    plano.punto(p, j === 0 ? "pc-ref" : "pc-p", 5);
    if (j <= 12) {
      plano.texto(p, j === 0 ? "1" : "z" + (j === 1 ? "" : superindice(j)), j === 0 ? "pc-ref" : "pc-p", 8, -8);
    }
  });

  var aviso = document.getElementById("act3-mensaje");
  var texto;
  if (r < 0.995) {
    texto = "|z| < 1: las potencias se acercan al origen en espiral.";
  } else if (r > 1.005) {
    texto = "|z| > 1: las potencias se alejan del origen en espiral.";
  } else {
    texto = "|z| = 1: todas las potencias están sobre el círculo unitario; solo giran.";
  }
  aviso.textContent = texto;

  katexRender(
    "|z| = " + num(r) + ",\\quad \\arg z = " + num(aGrados(argumentoComplejo(z))) + "^\\circ" +
    "\;\\Rightarrow\; |z^k| = " + num(r) + "^k,\\quad \\arg z^k = k\\cdot " + num(aGrados(argumentoComplejo(z))) + "^\\circ",
    document.getElementById("act3-lectura"), false);
}

function superindice(n) {
  var s = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  return String(n).split("").map(function (d) { return s[parseInt(d, 10)]; }).join("");
}
