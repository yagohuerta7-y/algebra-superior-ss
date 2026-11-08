/*
  Actividad 1: tabla de Cayley de (Z_n, +) con color, inversos y resaltado de elementos.
*/

function initActividad1() {
  var selector = document.getElementById("act1-n");
  var contenedor = document.getElementById("act1-tabla");
  var casillaColor = document.getElementById("act1-color");
  var casillaInversos = document.getElementById("act1-inversos");

  for (var n = 2; n <= 8; n++) {
    var opcion = document.createElement("option");
    opcion.value = String(n);
    opcion.textContent = "n = " + n;
    if (n === 5) {
      opcion.selected = true;
    }
    selector.appendChild(opcion);
  }

  var tabla = null;

  function dibujar() {
    tabla = crearTablaOperacion(contenedor, {
      estructura: estructuraZn(Number(selector.value)),
      idPrefijo: "act1-tabla",
      colorear: casillaColor.checked,
      resaltarInversos: casillaInversos.checked
    });
  }

  selector.addEventListener("change", dibujar);
  casillaColor.addEventListener("change", function () {
    tabla.establecerColor(casillaColor.checked);
  });
  casillaInversos.addEventListener("change", function () {
    tabla.establecerInversos(casillaInversos.checked);
  });

  dibujar();
}
