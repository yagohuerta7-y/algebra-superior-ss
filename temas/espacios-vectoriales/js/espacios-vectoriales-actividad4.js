/*
  Actividad 4: las soluciones de y'' + y = 0 son y = A cos x + B sin x: un
  espacio vectorial de dimensión 2 con coordenadas (A, B).
*/

function initActividad4() {
  var graf = crearGrafica(document.getElementById("act4-grafica"), {
    xmin: -6.3, xmax: 6.3, ymin: -5, ymax: 5, pasoRejilla: Math.PI / 2, pasoRejillaY: 1,
    idPrefijo: "act4",
    etiqueta: "Gráfica de la solución y igual a A coseno de x más B seno de x"
  });
  var rA = document.getElementById("act4-A");
  var rB = document.getElementById("act4-B");
  var tA = document.getElementById("act4-A-valor");
  var tB = document.getElementById("act4-B-valor");
  var lectura = document.getElementById("act4-lectura");

  function actualizar() {
    var A = Number(rA.value), B = Number(rB.value);
    tA.textContent = formatoNum(A);
    tB.textContent = formatoNum(B);
    graf.limpiar();
    graf.curva(function (x) { return Math.cos(x); }, "curva-esc");
    graf.curva(function (x) { return Math.sin(x); }, "curva-q");
    graf.curva(function (x) { return A * Math.cos(x) + B * Math.sin(x); }, "curva-suma");
    katexRender(
      "y(x) = " + formatoNum(A) + "\\cos x + " + formatoNum(B) + "\\sin x \\quad\\Longleftrightarrow\\quad (A, B) = (" + formatoNum(A) + ", " + formatoNum(B) + ")",
      lectura,
      true
    );
  }

  rA.addEventListener("input", actualizar);
  rB.addEventListener("input", actualizar);
  actualizar();
}
