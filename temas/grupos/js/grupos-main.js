/*
  Punto de entrada del tema "Grupos": inicializa el toggle de tema, las cuatro
  actividades, el diagrama de estructuras y renderiza las fórmulas con KaTeX.
*/

document.addEventListener("DOMContentLoaded", function () {
  initToggleTema();

  initActividad1();
  initActividad2();
  initActividad3();
  initActividad4();

  crearDiagramaEstructuras(document.getElementById("diagrama-grupos"), {
    resaltar: ["grupo", "grupo-abeliano"],
    idPrefijo: "diagrama-grupos"
  });

  renderMathEnElemento(document.body);
});
