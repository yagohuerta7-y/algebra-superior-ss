/*
  Punto de entrada del tema "Grupo de permutaciones": inicializa el toggle de
  tema y las tarjetas compartidas (js/comun.js), el Sudoku de introducción,
  cada actividad, y al final renderiza todas las fórmulas LaTeX de la página
  con KaTeX.
*/

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();
  renderSudoku(document.getElementById("intro-sudoku"), window.SUDOKU_RESUELTO);
  initActividad1();
  initActividad2();
  initActividad3();
  initQuiz();

  renderMathEnElemento(document.body);
});
