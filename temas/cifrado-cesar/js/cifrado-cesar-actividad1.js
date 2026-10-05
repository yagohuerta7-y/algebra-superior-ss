/*
  Actividad 1: "Cifrador y descifrador". El estudiante escribe un mensaje y
  elige un desplazamiento k; la actividad cifra el mensaje en vivo, muestra
  el desglose letra por letra de la congruencia aplicada, y verifica
  automáticamente que descifrar el resultado con el mismo k regresa
  exactamente al mensaje original (axioma de inversos).
*/

var estadoActividad1 = { controlK: null, k: 3 };

function renderPasosCifradoAct1(mensaje, k) {
  var lista = document.getElementById("act1-pasos-cifrado");
  lista.innerHTML = "";
  var n = window.ALFABETO.length;

  generarPasosCifrado(mensaje, k).forEach(function (paso) {
    var item = document.createElement("li");
    if (paso.esAlfabeto) {
      item.className = "paso-cifrado";
      item.textContent =
        paso.caracter + " (" + paso.indiceOriginal + ") + " + k + " ≡ " + paso.indiceResultado +
        " (mod " + n + ")  →  " + paso.caracterResultado;
    } else {
      item.className = "paso-cifrado caracter-conservado";
      item.textContent = "\"" + paso.caracter + "\" no pertenece al alfabeto: se deja igual";
    }
    lista.appendChild(item);
  });
}

function actualizarActividad1() {
  var mensaje = document.getElementById("act1-mensaje").value;
  var k = estadoActividad1.k;

  var cifrado = cifrarCesar(mensaje, k);
  document.getElementById("act1-resultado").textContent = cifrado || "(escribe un mensaje arriba)";
  renderPasosCifradoAct1(mensaje, k);

  var mensajeVerificacion = document.getElementById("act1-mensaje-verificacion");
  if (!mensaje) {
    mensajeVerificacion.textContent = "";
    return;
  }

  var descifrado = descifrarCesar(cifrado, k);
  var regresaAlOriginal = descifrado === mensaje.toUpperCase();

  if (regresaAlOriginal) {
    anunciar(
      mensajeVerificacion,
      "Descifrar \"" + cifrado + "\" con el mismo k=" + k + " regresa exactamente a \"" +
        mensaje.toUpperCase() + "\": Dₖ∘Eₖ = id, tal como lo garantiza el axioma de inversos."
    );
    mensajeVerificacion.className = "aviso aviso-exito";
  } else {
    anunciar(mensajeVerificacion, "Algo salió mal: revisa la consola.");
    mensajeVerificacion.className = "aviso aviso-error";
  }
}

function initActividad1() {
  document.getElementById("act1-mensaje").addEventListener("input", actualizarActividad1);

  estadoActividad1.controlK = crearControlK({
    contenedor: document.getElementById("act1-control-k"),
    idPrefijo: "act1",
    etiqueta: "Desplazamiento (k)",
    valorInicial: estadoActividad1.k,
    onCambio: function (valor) {
      estadoActividad1.k = valor;
      actualizarActividad1();
    }
  });

  document.getElementById("act1-boton-aleatorio").addEventListener("click", function () {
    estadoActividad1.controlK.establecerValor(enteroAleatorio(0, window.ALFABETO.length - 1));
  });

  actualizarActividad1();
}
