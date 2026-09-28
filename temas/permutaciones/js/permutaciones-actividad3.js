/*
  Actividad 3: "Buscador del inverso". El estudiante construye una
  permutación sigma con el constructor compartido; la actividad calcula su
  inversa y verifica, aplicando primero sigma y luego sigma^-1 al Sudoku, que
  se regresa exactamente al original (sigma^-1 o sigma = id).
*/

var estadoActividad3 = { controlPermutacion: null };

function actualizarActividad3(permutacion, resultado) {
  var mensajeValidez = document.getElementById("act3-mensaje-validez");

  if (!resultado.esValida) {
    anunciar(
      mensajeValidez,
      "La asignación aún no es una permutación: el dígito " + resultado.repetidos.join(", ") +
        " se repite como imagen. Ajusta los selectores para que no haya repeticiones."
    );
    mensajeValidez.className = "aviso aviso-error";
    document.getElementById("act3-mensaje-verificacion").textContent = "";
    return;
  }

  anunciar(mensajeValidez, "σ es una permutación válida.");
  mensajeValidez.className = "aviso aviso-exito";

  var inversa = invertirPermutacion(permutacion);
  katexRender(formatoNotacionCiclos(permutacion), document.getElementById("act3-notacion-sigma"), true);
  katexRender(formatoNotacionCiclos(inversa), document.getElementById("act3-notacion-inversa"), true);

  var sudokuTrasSigma = aplicarPermutacionASudoku(window.SUDOKU_RESUELTO, permutacion);
  var sudokuTrasInversa = aplicarPermutacionASudoku(sudokuTrasSigma, inversa);

  renderSudoku(document.getElementById("act3-sudoku-sigma"), sudokuTrasSigma, {
    sudokuComparar: window.SUDOKU_RESUELTO
  });
  renderSudoku(document.getElementById("act3-sudoku-inversa"), sudokuTrasInversa);

  var mensajeVerificacion = document.getElementById("act3-mensaje-verificacion");
  var regresoAlOriginal = sudokuTrasInversa.every(function (fila, i) {
    return fila.every(function (valor, j) {
      return valor === window.SUDOKU_RESUELTO[i][j];
    });
  });

  if (regresoAlOriginal) {
    anunciar(
      mensajeVerificacion,
      "El Sudoku regresó exactamente al original: σ⁻¹∘σ = id, tal como lo garantiza el axioma de inversos."
    );
    mensajeVerificacion.className = "aviso aviso-exito";
  } else {
    anunciar(mensajeVerificacion, "Algo salió mal: revisa la consola.");
    mensajeVerificacion.className = "aviso aviso-error";
  }
}

function initActividad3() {
  renderSudoku(document.getElementById("act3-sudoku-original"), window.SUDOKU_RESUELTO);

  estadoActividad3.controlPermutacion = crearConstructorPermutacion({
    contenedor: document.getElementById("act3-constructor-permutacion"),
    idPrefijo: "act3",
    etiqueta: "σ",
    onCambio: actualizarActividad3
  });

  document.getElementById("act3-boton-aleatorio").addEventListener("click", function () {
    estadoActividad3.controlPermutacion.aleatorizar();
  });
}
