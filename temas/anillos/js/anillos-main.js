/*
  Punto de entrada del tema "Anillos".
*/

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();

  initActividad1();
  initActividad2();
  initActividad3();

  crearDiagramaEstructuras(document.getElementById("diagrama-anillos"), {
    resaltar: ["anillo", "anillo-conmutativo", "dominio"],
    idPrefijo: "diagrama-anillos"
  });

  renderMathEnElemento(document.body);
});
