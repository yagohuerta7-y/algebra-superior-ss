/*
  Punto de entrada del tema "Campos".
*/

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();

  initActividad1();
  initActividad2();
  initActividad3();
  initActividad4();

  crearDiagramaEstructuras(document.getElementById("diagrama-campos"), {
    resaltar: ["campo"],
    idPrefijo: "diagrama-campos"
  });

  renderMathEnElemento(document.body);
});
