/*
  Actividad 3: problemas guiados de aplicación. Cada problema tiene una
  pista opcional, opciones de respuesta, verificación inmediata y una
  solución explicada en un <details> nativo (accesible sin JS adicional).
*/

function crearProblemaAct3(problema, indice) {
  var articulo = document.createElement("fieldset");
  articulo.className = "tarjeta-problema";

  var leyenda = document.createElement("legend");
  leyenda.textContent = problema.titulo;
  articulo.appendChild(leyenda);

  var enunciado = document.createElement("p");
  enunciado.textContent = problema.enunciado;
  articulo.appendChild(enunciado);

  var botonPista = document.createElement("button");
  botonPista.type = "button";
  botonPista.className = "boton-pista";
  botonPista.textContent = "Ver pista";
  botonPista.setAttribute("aria-expanded", "false");
  var idPista = "act3-pista-" + indice;
  botonPista.setAttribute("aria-controls", idPista);

  var textoPista = document.createElement("p");
  textoPista.className = "texto-pista";
  textoPista.id = idPista;
  textoPista.hidden = true;
  textoPista.textContent = problema.pista;

  botonPista.addEventListener("click", function () {
    var visible = !textoPista.hidden;
    textoPista.hidden = visible;
    botonPista.setAttribute("aria-expanded", visible ? "false" : "true");
    botonPista.textContent = visible ? "Ver pista" : "Ocultar pista";
  });

  articulo.appendChild(botonPista);
  articulo.appendChild(textoPista);

  var nombreGrupo = "act3-" + problema.id;
  problema.opciones.forEach(function (textoOpcion, indiceOpcion) {
    var envoltura = document.createElement("label");
    envoltura.className = "opcion-radio";

    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = nombreGrupo;
    radio.value = String(indiceOpcion);
    radio.id = nombreGrupo + "-" + indiceOpcion;

    var texto = document.createElement("span");
    texto.textContent = textoOpcion;

    envoltura.appendChild(radio);
    envoltura.appendChild(texto);
    articulo.appendChild(envoltura);
  });

  var botonVerificar = document.createElement("button");
  botonVerificar.type = "button";
  botonVerificar.className = "boton boton-secundario";
  botonVerificar.textContent = "Verificar respuesta";

  var resultado = document.createElement("p");
  resultado.className = "resultado-pregunta";
  resultado.setAttribute("aria-live", "polite");

  botonVerificar.addEventListener("click", function () {
    var seleccionado = articulo.querySelector('input[name="' + nombreGrupo + '"]:checked');
    if (!seleccionado) {
      anunciar(resultado, "Selecciona una opción antes de verificar.");
      resultado.className = "resultado-pregunta";
      return;
    }
    var esCorrecta = parseInt(seleccionado.value, 10) === problema.respuestaCorrecta;
    anunciar(resultado, esCorrecta ? "✓ Correcto." : "✗ Incorrecto, intenta de nuevo.");
    resultado.className = "resultado-pregunta " + (esCorrecta ? "correcto" : "incorrecto");
  });

  articulo.appendChild(botonVerificar);
  articulo.appendChild(resultado);

  var detalles = document.createElement("details");
  detalles.className = "solucion";
  var resumenDetalles = document.createElement("summary");
  resumenDetalles.textContent = "Ver solución explicada";
  var contenidoSolucion = document.createElement("div");
  contenidoSolucion.className = "contenido-solucion";
  contenidoSolucion.textContent = problema.solucion;
  detalles.appendChild(resumenDetalles);
  detalles.appendChild(contenidoSolucion);
  articulo.appendChild(detalles);

  return articulo;
}

function initActividad3() {
  var contenedor = document.getElementById("act3-problemas");
  window.PALOMAR_PROBLEMAS.forEach(function (problema, indice) {
    contenedor.appendChild(crearProblemaAct3(problema, indice));
  });
}
