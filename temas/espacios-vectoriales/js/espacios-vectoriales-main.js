/*
  Punto de entrada del tema "Espacios vectoriales".
*/

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();

  initActividad1();
  initActividad2();
  initActividad3();
  initActividad4();
  initActividad5();

  crearDiagramaEstructuras(document.getElementById("diagrama-ev"), {
    resaltar: ["ev", "grupo-abeliano", "campo"],
    idPrefijo: "diagrama-ev"
  });

  renderMathEnElemento(document.body);
});
