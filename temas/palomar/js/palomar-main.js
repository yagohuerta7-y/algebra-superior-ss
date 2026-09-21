/*
  Punto de entrada del tema "Principio del palomar": inicializa el toggle de
  tema y las tarjetas compartidas (js/comun.js), cada actividad, y al final
  renderiza todas las fórmulas LaTeX de la página con KaTeX.
*/

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();
  initActividad1();
  initActividad2();
  initActividad3();
  initQuiz();

  renderMathEnElemento(document.body);
});
