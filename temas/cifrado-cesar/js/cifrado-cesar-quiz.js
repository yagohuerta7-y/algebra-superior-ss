/*
  Cuestionario de autoevaluación: preguntas verdadero/falso y de opción
  múltiple con retroalimentación inmediata. Nada se envía ni se guarda; la
  calificación solo vive en memoria mientras dura la sesión de la página.
*/

function crearPreguntaQuiz(pregunta, indice) {
  var articulo = document.createElement("fieldset");
  articulo.className = "tarjeta-problema";

  var leyenda = document.createElement("legend");
  leyenda.textContent = "Pregunta " + (indice + 1);
  articulo.appendChild(leyenda);

  var textoPregunta = document.createElement("p");
  textoPregunta.textContent = pregunta.pregunta;
  articulo.appendChild(textoPregunta);

  var opciones = pregunta.tipo === "vf" ? ["Verdadero", "Falso"] : pregunta.opciones;
  var nombreGrupo = "quiz-" + pregunta.id;
  var resultado = document.createElement("p");
  resultado.className = "resultado-pregunta";
  resultado.setAttribute("aria-live", "polite");

  opciones.forEach(function (textoOpcion, indiceOpcion) {
    var envoltura = document.createElement("label");
    envoltura.className = "opcion-radio";

    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = nombreGrupo;
    radio.value = String(indiceOpcion);
    radio.id = nombreGrupo + "-" + indiceOpcion;

    var texto = document.createElement("span");
    texto.textContent = textoOpcion;

    radio.addEventListener("change", function () {
      var esCorrecta = indiceOpcion === pregunta.respuestaCorrecta;
      var mensaje = "✓ " + pregunta.retroCorrecta;
      if (!esCorrecta) {
        mensaje = "✗ " + pregunta.retroIncorrecta;
      }
      anunciar(resultado, mensaje);
      resultado.className = "resultado-pregunta " + (esCorrecta ? "correcto" : "incorrecto");
      renderMathEnElemento(resultado);
    });

    envoltura.appendChild(radio);
    envoltura.appendChild(texto);
    articulo.appendChild(envoltura);
  });

  articulo.appendChild(resultado);
  return articulo;
}

function calificarQuiz() {
  var form = document.getElementById("quiz-formulario");
  var correctas = 0;
  window.CIFRADO_CESAR_QUIZ.forEach(function (pregunta) {
    var seleccionado = form.querySelector('input[name="quiz-' + pregunta.id + '"]:checked');
    if (seleccionado && parseInt(seleccionado.value, 10) === pregunta.respuestaCorrecta) {
      correctas += 1;
    }
  });

  var total = window.CIFRADO_CESAR_QUIZ.length;
  var contestadas = window.CIFRADO_CESAR_QUIZ.filter(function (pregunta) {
    return form.querySelector('input[name="quiz-' + pregunta.id + '"]:checked');
  }).length;

  var resultadoFinal = document.getElementById("quiz-calificacion");
  var mensaje;
  if (contestadas < total) {
    mensaje = "Has respondido " + contestadas + " de " + total + " preguntas. Responde todas para ver tu calificación completa.";
  } else {
    mensaje = "Calificación final: " + correctas + " de " + total + " respuestas correctas.";
  }
  anunciar(resultadoFinal, mensaje);
}

function reiniciarQuiz() {
  var form = document.getElementById("quiz-formulario");
  form.reset();
  var resultadoFinal = document.getElementById("quiz-calificacion");
  anunciar(resultadoFinal, "");
  var resultadosIndividuales = form.querySelectorAll(".resultado-pregunta");
  resultadosIndividuales.forEach(function (elemento) {
    elemento.textContent = "";
    elemento.className = "resultado-pregunta";
  });
}

function initQuiz() {
  var contenedor = document.getElementById("quiz-preguntas");
  window.CIFRADO_CESAR_QUIZ.forEach(function (pregunta, indice) {
    contenedor.appendChild(crearPreguntaQuiz(pregunta, indice));
  });

  document.getElementById("quiz-boton-calificar").addEventListener("click", calificarQuiz);
  document.getElementById("quiz-boton-reiniciar").addEventListener("click", reiniciarQuiz);
}
