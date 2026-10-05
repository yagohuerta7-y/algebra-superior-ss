/*
  Punto de entrada del tema "Cifrado César": inicializa el toggle de tema, la
  tabla del alfabeto y el reloj modular estático de la sección #modular,
  cada actividad, el quiz, y al final renderiza todas las fórmulas LaTeX de
  la página con KaTeX.
*/

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();

  renderTablaAlfabeto(document.getElementById("modular-tabla-alfabeto"));

  var relojIntroductorio = crearRelojModular(document.getElementById("modular-reloj"), {
    idPrefijo: "modular-reloj"
  });
  relojIntroductorio.actualizar({ origen: 7, destino: 12 });

  initActividad1();
  initActividad2();
  initQuiz();

  renderMathEnElemento(document.body);
});
