/*
  Actividad 1: "Explorador de permutaciones de un Sudoku". El estudiante
  construye una permutación de {1,...,9} con el constructor compartido y ve
  en vivo si es una biyección válida; si lo es, se aplica al Sudoku de
  ejemplo y se resaltan las celdas que cambiaron.
*/

var estadoActividad1 = { controlPermutacion: null };

function actualizarActividad1(permutacion, resultado) {
  var resumen = document.getElementById("act1-resumen-biyeccion");
  var mensaje;

  if (!resultado.esValida) {
    mensaje =
      "La asignación aún no es una permutación: el dígito " +
      resultado.repetidos.join(", ") +
      " se repite como imagen. Ajusta los selectores para que no haya repeticiones.";
    anunciar(resumen, mensaje);
    resumen.className = "aviso aviso-error";
    return;
  }

  mensaje = "Es una biyección válida: la asignación es una permutación de {1,...,9}.";
  anunciar(resumen, mensaje);
  resumen.className = "aviso aviso-exito";

  katexRender(formatoNotacionDosLineas(permutacion), document.getElementById("act1-notacion-dos-lineas"), true);
  katexRender(formatoNotacionCiclos(permutacion), document.getElementById("act1-notacion-ciclos"), true);

  var sudokuTransformado = aplicarPermutacionASudoku(window.SUDOKU_RESUELTO, permutacion);
  renderSudoku(document.getElementById("act1-sudoku-transformado"), sudokuTransformado, {
    sudokuComparar: window.SUDOKU_RESUELTO
  });
}

function initActividad1() {
  renderSudoku(document.getElementById("act1-sudoku-original"), window.SUDOKU_RESUELTO);

  estadoActividad1.controlPermutacion = crearConstructorPermutacion({
    contenedor: document.getElementById("act1-constructor-permutacion"),
    idPrefijo: "act1",
    etiqueta: "σ",
    onCambio: actualizarActividad1
  });

  document.getElementById("act1-boton-aleatorio").addEventListener("click", function () {
    estadoActividad1.controlPermutacion.aleatorizar();
  });
  document.getElementById("act1-boton-identidad").addEventListener("click", function () {
    estadoActividad1.controlPermutacion.reiniciar();
  });
}
