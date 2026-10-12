/*
  Punto de entrada del tema "Números complejos": inicializa el toggle de tema,
  las figuras estáticas de las secciones, cada actividad, y al final
  renderiza todas las fórmulas LaTeX de la página con KaTeX.
*/

function figuraPolar() {
  var contenedor = document.getElementById("fig-polar");
  if (!contenedor) { return; }
  var plano = crearPlano(contenedor, { rango: 3, circuloUnitario: true, etiqueta: "Un número complejo z con su módulo r y su ángulo θ" });
  var z = complejo(1.8, 1.4);
  var theta = argumentoComplejo(z);
  plano.limpiar();
  plano.segmento(complejo(z.re, 0), z, "pc-guia");
  plano.segmento(complejo(0, z.im), z, "pc-guia");
  plano.arco(0.7, 0, theta, "pc-w");
  plano.flecha(complejo(0, 0), z, "pc-z");
  plano.punto(z, "pc-z", 6);
  plano.texto(z, "z = a + bi", "pc-z", 10, -10);
  plano.texto(complejo(z.re / 2, z.im / 2), "r", "pc-z", -14, -6);
  plano.texto(complejo(0.7, 0.18), "θ", "pc-w", 6, 0);
  plano.texto(complejo(z.re, 0), "a", "pc-guia", -4, 28);
  plano.texto(complejo(0, z.im), "b", "pc-guia", -22, 4);
}

function figuraSuma() {
  var contenedor = document.getElementById("fig-suma");
  if (!contenedor) { return; }
  var plano = crearPlano(contenedor, { rango: 4, etiqueta: "Suma de dos complejos como paralelogramo" });
  var z = complejo(2.5, 0.5), w = complejo(0.5, 2);
  var s = sumaComplejos(z, w);
  plano.limpiar();
  plano.segmento(z, s, "pc-guia");
  plano.segmento(w, s, "pc-guia");
  plano.flecha(complejo(0, 0), z, "pc-z");
  plano.flecha(complejo(0, 0), w, "pc-w");
  plano.flecha(complejo(0, 0), s, "pc-p");
  plano.texto(z, "z", "pc-z", 8, 18);
  plano.texto(w, "w", "pc-w", -18, -6);
  plano.texto(s, "z + w", "pc-p", 8, -8);
}

function figuraGiroI() {
  var contenedor = document.getElementById("fig-giro-i");
  if (!contenedor) { return; }
  var plano = crearPlano(contenedor, { rango: 3, circuloUnitario: false, etiqueta: "Multiplicar por i gira 90 grados" });
  var z = complejo(2, 1);
  var puntos = [z, multiplicarComplejos(complejo(0, 1), z), complejo(-z.re, -z.im), multiplicarComplejos(complejo(0, -1), z)];
  var nombres = ["z", "iz", "i²z = −z", "i³z = −iz"];
  var clases = ["pc-z", "pc-w", "pc-p", "pc-ref"];
  plano.limpiar();
  plano.polilinea(puntos, "pc-guia", true);
  puntos.forEach(function (p, idx) {
    plano.flecha(complejo(0, 0), p, clases[idx]);
    plano.texto(p, nombres[idx], clases[idx], 8, idx === 2 || idx === 3 ? 18 : -8);
  });
  plano.arco(0.8, argumentoComplejo(z), argumentoComplejo(puntos[1]), "pc-w");
}

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();

  figuraPolar();
  figuraSuma();
  figuraGiroI();

  initActividad1();
  initActividad2();
  initActividad3();
  initActividad4();

  renderMathEnElemento(document.body);
});
