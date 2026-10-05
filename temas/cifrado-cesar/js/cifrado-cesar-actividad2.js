/*
  Actividad 2: "Reloj modular". El estudiante elige un punto de partida x y
  un desplazamiento k; el reloj modular resalta x, el destino (x+k) mod n, y
  la flecha entre ambos. El botón "Comparar" calcula x+k y k+x y muestra que
  siempre coinciden, contrastando con la no conmutatividad de la composición
  de permutaciones vista en el tema anterior.
*/

var estadoActividad2 = { controlX: null, controlK: null, reloj: null, x: 7, k: 5 };

function actualizarActividad2() {
  var n = window.ALFABETO.length;
  var x = estadoActividad2.x;
  var k = estadoActividad2.k;
  var destino = modulo(x + k, n);

  estadoActividad2.reloj.actualizar({ origen: x, destino: destino });

  var mensajeResultado = document.getElementById("act2-mensaje-resultado");
  anunciar(
    mensajeResultado,
    indiceALetra(x) + " (" + x + ") + " + k + " ≡ " + destino + " (mod " + n + ")  →  " + indiceALetra(destino)
  );
  mensajeResultado.className = "aviso aviso-info";

  document.getElementById("act2-mensaje-conmutatividad").textContent = "";
}

function compararConmutatividadAct2() {
  var n = window.ALFABETO.length;
  var x = estadoActividad2.x;
  var k = estadoActividad2.k;
  var xMasK = modulo(x + k, n);
  var kMasX = modulo(k + x, n);

  var mensajeConmutatividad = document.getElementById("act2-mensaje-conmutatividad");
  anunciar(
    mensajeConmutatividad,
    "x+k ≡ " + xMasK + " (mod " + n + ")  y  k+x ≡ " + kMasX + " (mod " + n + "): siempre coinciden. " +
      "A diferencia de σ∘τ y τ∘σ en el tema de permutaciones, (Zₙ,+) es abeliano: el orden de la suma no importa."
  );
  mensajeConmutatividad.className = "aviso aviso-exito";
}

function initActividad2() {
  estadoActividad2.reloj = crearRelojModular(document.getElementById("act2-reloj"), {
    idPrefijo: "act2-reloj"
  });

  estadoActividad2.controlX = crearControlK({
    contenedor: document.getElementById("act2-control-x"),
    idPrefijo: "act2-x",
    etiqueta: "Punto de partida (x)",
    valorInicial: estadoActividad2.x,
    onCambio: function (valor) {
      estadoActividad2.x = valor;
      actualizarActividad2();
    }
  });

  estadoActividad2.controlK = crearControlK({
    contenedor: document.getElementById("act2-control-k"),
    idPrefijo: "act2-k",
    etiqueta: "Desplazamiento (k)",
    valorInicial: estadoActividad2.k,
    onCambio: function (valor) {
      estadoActividad2.k = valor;
      actualizarActividad2();
    }
  });

  document.getElementById("act2-boton-comparar").addEventListener("click", compararConmutatividadAct2);

  actualizarActividad2();
}
