/*
  Actividad 2: "Calculadora de composición". El estudiante construye dos
  permutaciones sigma y tau con el constructor compartido (una instancia por
  cada una) y ve el desglose paso a paso de (sigma o tau)(x) = sigma(tau(x)),
  aplicada al Sudoku. Un botón adicional compara sigma o tau contra tau o
  sigma para evidenciar la no conmutatividad.
*/

var estadoActividad2 = {
  controlSigma: null,
  controlTau: null,
  sigma: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  tau: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  sigmaValida: true,
  tauValida: true
};

function renderPasosComposicionAct2(sigma, tau) {
  var lista = document.getElementById("act2-pasos-composicion");
  lista.innerHTML = "";
  pasosComposicion(sigma, tau).forEach(function (paso) {
    var item = document.createElement("li");
    item.className = "paso-composicion";
    item.textContent =
      "x=" + paso.x + "  →  τ(" + paso.x + ")=" + paso.tauX + "  →  σ(" + paso.tauX + ")=" + paso.resultado;
    lista.appendChild(item);
  });
}

function actualizarActividad2() {
  var mensajeValidez = document.getElementById("act2-mensaje-validez");

  if (!estadoActividad2.sigmaValida || !estadoActividad2.tauValida) {
    var cual = !estadoActividad2.sigmaValida && !estadoActividad2.tauValida ? "σ y τ" : !estadoActividad2.sigmaValida ? "σ" : "τ";
    anunciar(mensajeValidez, "Corrige la asignación de " + cual + " para que sea una permutación válida.");
    mensajeValidez.className = "aviso aviso-error";
    document.getElementById("act2-pasos-composicion").innerHTML = "";
    document.getElementById("act2-mensaje-conmutatividad").textContent = "";
    return;
  }

  anunciar(mensajeValidez, "σ y τ son permutaciones válidas.");
  mensajeValidez.className = "aviso aviso-exito";

  var sigma = estadoActividad2.sigma;
  var tau = estadoActividad2.tau;
  var resultado = componerPermutaciones(sigma, tau);

  renderPasosComposicionAct2(sigma, tau);
  katexRender(formatoNotacionDosLineas(resultado), document.getElementById("act2-notacion-dos-lineas"), true);
  katexRender(formatoNotacionCiclos(resultado), document.getElementById("act2-notacion-ciclos"), true);

  var sudokuResultado = aplicarPermutacionASudoku(window.SUDOKU_RESUELTO, resultado);
  renderSudoku(document.getElementById("act2-sudoku-resultado"), sudokuResultado, {
    sudokuComparar: window.SUDOKU_RESUELTO
  });

  document.getElementById("act2-mensaje-conmutatividad").textContent = "";
}

function compararConmutatividadAct2() {
  if (!estadoActividad2.sigmaValida || !estadoActividad2.tauValida) {
    return;
  }

  var sigma = estadoActividad2.sigma;
  var tau = estadoActividad2.tau;
  var sigmaTau = componerPermutaciones(sigma, tau);
  var tauSigma = componerPermutaciones(tau, sigma);

  var mensajeConmutatividad = document.getElementById("act2-mensaje-conmutatividad");

  if (compararPermutaciones(sigmaTau, tauSigma)) {
    anunciar(
      mensajeConmutatividad,
      "Para esta σ y esta τ en particular, σ∘τ y τ∘σ coinciden. No es lo usual: intenta con otra " +
        "pareja de permutaciones para ver un caso donde no conmuten."
    );
    mensajeConmutatividad.className = "aviso aviso-info";
    return;
  }

  var primeraDiferencia = null;
  for (var x = 1; x <= 9; x++) {
    if (sigmaTau[x - 1] !== tauSigma[x - 1]) {
      primeraDiferencia = x;
      break;
    }
  }

  anunciar(
    mensajeConmutatividad,
    "σ∘τ ≠ τ∘σ: en x=" + primeraDiferencia + ", (σ∘τ)(" + primeraDiferencia + ")=" +
      sigmaTau[primeraDiferencia - 1] + " pero (τ∘σ)(" + primeraDiferencia + ")=" +
      tauSigma[primeraDiferencia - 1] + ". La composición de permutaciones no es conmutativa."
  );
  mensajeConmutatividad.className = "aviso aviso-error";
}

function initActividad2() {
  renderSudoku(document.getElementById("act2-sudoku-original"), window.SUDOKU_RESUELTO);

  estadoActividad2.controlSigma = crearConstructorPermutacion({
    contenedor: document.getElementById("act2-constructor-sigma"),
    idPrefijo: "act2-sigma",
    etiqueta: "σ",
    onCambio: function (permutacion, resultado) {
      estadoActividad2.sigma = permutacion;
      estadoActividad2.sigmaValida = resultado.esValida;
      actualizarActividad2();
    }
  });

  estadoActividad2.controlTau = crearConstructorPermutacion({
    contenedor: document.getElementById("act2-constructor-tau"),
    idPrefijo: "act2-tau",
    etiqueta: "τ",
    onCambio: function (permutacion, resultado) {
      estadoActividad2.tau = permutacion;
      estadoActividad2.tauValida = resultado.esValida;
      actualizarActividad2();
    }
  });

  document.getElementById("act2-boton-aleatorio-sigma").addEventListener("click", function () {
    estadoActividad2.controlSigma.aleatorizar();
  });
  document.getElementById("act2-boton-aleatorio-tau").addEventListener("click", function () {
    estadoActividad2.controlTau.aleatorizar();
  });
  document.getElementById("act2-boton-comparar").addEventListener("click", compararConmutatividadAct2);
}
