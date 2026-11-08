/*
  Actividad 3: Z_4 frente a V_4. Las tablas son cuadrados latinos, pero la
  diagonal (a ∗ a) y los órdenes de los elementos los distinguen.
*/

function ordenDeElemento(est, indice, neutro) {
  var valor = indice;
  var k = 1;
  while (valor !== neutro && k < 100) {
    valor = est.tabla[indice][valor];
    k++;
  }
  return k;
}

function initActividad3() {
  var z4 = estructuraZn(4);
  var v4 = estructuraKlein();
  var casilla = document.getElementById("act3-diagonal");

  var tablaZ4 = crearTablaOperacion(document.getElementById("act3-tabla-z4"), {
    estructura: z4,
    idPrefijo: "act3-z4",
    resaltarInversos: true
  });
  var tablaV4 = crearTablaOperacion(document.getElementById("act3-tabla-v4"), {
    estructura: v4,
    idPrefijo: "act3-v4",
    resaltarInversos: true
  });

  function escribirOrdenes(est, destino) {
    var partes = est.elementos.map(function (el, idx) {
      return "$" + el.latex + "$: " + ordenDeElemento(est, idx, 0);
    });
    escribirConMath(destino, "Órdenes — " + partes.join(", ") + ".");
  }
  escribirOrdenes(z4, document.getElementById("act3-ordenes-z4"));
  escribirOrdenes(v4, document.getElementById("act3-ordenes-v4"));

  casilla.addEventListener("change", function () {
    tablaZ4.establecerDiagonal(casilla.checked);
    tablaV4.establecerDiagonal(casilla.checked);
  });
}
