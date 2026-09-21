/*
  Actividad 2: forma general del principio del palomar. Si n palomas se
  reparten en m palomares, algún palomar tiene al menos ceil(n/m) palomas.
  Se muestran dos modos: el peor caso equilibrado (donde la cota se alcanza)
  y un reparto aleatorio (donde el máximo siempre es >= ceil(n/m)).
*/

var estadoAct2 = { n: 8, m: 3, conteos: [] };

function repartoEquilibradoAct2(n, m) {
  var base = Math.floor(n / m);
  var sobran = n % m;
  var conteos = [];
  for (var i = 0; i < m; i++) {
    conteos.push(base + (i < sobran ? 1 : 0));
  }
  return conteos;
}

function repartoAleatorioAct2(n, m) {
  var conteos = new Array(m).fill(0);
  for (var i = 0; i < n; i++) {
    conteos[enteroAleatorio(0, m - 1)] += 1;
  }
  return conteos;
}

function renderGraficaAct2() {
  var grafica = document.getElementById("act2-grafica");
  var etiquetas = document.getElementById("act2-etiquetas");
  grafica.innerHTML = "";
  etiquetas.innerHTML = "";

  var maximo = Math.max.apply(null, estadoAct2.conteos.concat([1]));
  var techo = Math.ceil(estadoAct2.n / estadoAct2.m);

  estadoAct2.conteos.forEach(function (cuenta, indice) {
    var columna = document.createElement("div");
    columna.className = "barra-contenedor";

    var numero = document.createElement("span");
    numero.textContent = String(cuenta);

    var barra = document.createElement("div");
    barra.className = "barra" + (cuenta >= techo ? " destacada" : "");
    var alturaPorcentaje = Math.max(4, (cuenta / maximo) * 100);
    barra.style.height = alturaPorcentaje + "%";

    columna.appendChild(numero);
    columna.appendChild(barra);
    grafica.appendChild(columna);

    var etiqueta = document.createElement("span");
    etiqueta.textContent = "P" + (indice + 1);
    etiquetas.appendChild(etiqueta);
  });
}

function actualizarTechoAct2() {
  var techo = Math.ceil(estadoAct2.n / estadoAct2.m);
  var elementoFormula = document.getElementById("act2-formula-techo");
  katexRender(
    "\\left\\lceil \\dfrac{" + estadoAct2.n + "}{" + estadoAct2.m + "} \\right\\rceil = " + techo,
    elementoFormula,
    true
  );
  return techo;
}

function actualizarResumenAct2(etiquetaModo) {
  var techo = actualizarTechoAct2();
  var maximoObservado = Math.max.apply(null, estadoAct2.conteos);
  var resumen = document.getElementById("act2-resumen");
  var mensaje =
    etiquetaModo + ": el palomar más cargado tiene " + maximoObservado + " palomas. " +
    "La forma general garantiza al menos ⌈" + estadoAct2.n + "/" + estadoAct2.m + "⌉ = " + techo + ".";
  anunciar(resumen, mensaje);
  resumen.className = "aviso aviso-info";
}

function mostrarPeorCasoAct2() {
  estadoAct2.conteos = repartoEquilibradoAct2(estadoAct2.n, estadoAct2.m);
  renderGraficaAct2();
  actualizarResumenAct2("Peor caso equilibrado");
}

function mostrarCasoAleatorioAct2() {
  estadoAct2.conteos = repartoAleatorioAct2(estadoAct2.n, estadoAct2.m);
  renderGraficaAct2();
  actualizarResumenAct2("Caso aleatorio");
}

function aplicarNuevosNM_Act2(n, m) {
  estadoAct2.n = n;
  estadoAct2.m = m;
  mostrarPeorCasoAct2();
}

function initActividad2() {
  var contenedorControl = document.getElementById("act2-control-nm");
  crearControlNM({
    contenedor: contenedorControl,
    idPrefijo: "act2",
    nInicial: estadoAct2.n,
    mInicial: estadoAct2.m,
    limite: 20,
    onCambio: aplicarNuevosNM_Act2
  });

  mostrarPeorCasoAct2();

  document.getElementById("act2-boton-peor-caso").addEventListener("click", mostrarPeorCasoAct2);
  document.getElementById("act2-boton-aleatorio").addEventListener("click", mostrarCasoAleatorioAct2);
}
