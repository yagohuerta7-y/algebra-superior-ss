/*
  Actividad 1: tabla del producto de (Z_n, +, ·) con unidades (●) y divisores de cero (◆).
*/

function analizarUnidadesYDivisores(n) {
  var unidades = [];
  var divisores = [];
  for (var a = 0; a < n; a++) {
    var esUnidad = false;
    var esDivisor = false;
    for (var b = 0; b < n; b++) {
      if ((a * b) % n === 1 % n && n > 1) {
        esUnidad = true;
      }
      if (a !== 0 && b !== 0 && (a * b) % n === 0) {
        esDivisor = true;
      }
    }
    if (esUnidad) {
      unidades.push(a);
    }
    if (esDivisor) {
      divisores.push(a);
    }
  }
  return { unidades: unidades, divisores: divisores };
}

function initActividad1() {
  var selector = document.getElementById("act1-n");
  var contenedor = document.getElementById("act1-tabla");
  var casillaUnidades = document.getElementById("act1-unidades");
  var casillaDivisores = document.getElementById("act1-divisores");
  var resumen = document.getElementById("act1-resumen");

  for (var n = 2; n <= 12; n++) {
    var opcion = document.createElement("option");
    opcion.value = String(n);
    opcion.textContent = "n = " + n;
    if (n === 6) {
      opcion.selected = true;
    }
    selector.appendChild(opcion);
  }

  var tabla = null;
  var n0 = 0;

  function aplicarMarcas() {
    tabla.establecerInversos(casillaUnidades.checked);
    tabla.marcarCeldas(
      casillaDivisores.checked
        ? function (i, j, v) {
            return i !== 0 && j !== 0 && v === 0;
          }
        : null
    );
  }

  function dibujar() {
    n0 = Number(selector.value);
    tabla = crearTablaOperacion(contenedor, {
      estructura: estructuraZnProducto(n0),
      idPrefijo: "act1-tabla",
      mostrarLatino: false,
      mostrarLeyenda: false
    });
    aplicarMarcas();

    var info = analizarUnidadesYDivisores(n0);
    var lista = function (xs) {
      return xs.length ? xs.join(", ") : "ninguno";
    };
    var texto =
      "Unidades (tienen inverso para el producto): " + lista(info.unidades) + ". " +
      "Divisores de cero: " + lista(info.divisores) + ". ";
    texto += info.divisores.length === 0
      ? "No hay divisores de cero: $\\mathbb{Z}_{" + n0 + "}$ es un dominio entero" +
        (info.unidades.length === n0 - 1 ? " y, más aún, todo elemento no nulo es unidad: es un campo." : ".")
      : "Hay divisores de cero: $\\mathbb{Z}_{" + n0 + "}$ no es un dominio entero.";
    escribirConMath(resumen, texto);
  }

  selector.addEventListener("change", dibujar);
  casillaUnidades.addEventListener("change", aplicarMarcas);
  casillaDivisores.addEventListener("change", aplicarMarcas);
  dibujar();
}
