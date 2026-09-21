/*
  Actividad 1: "Palomas y palomares". El estudiante asigna cada paloma a un
  palomar mediante un <select> (accesible por teclado y en touch) y la
  interfaz muestra en vivo la función resultante, si es inyectiva, y resalta
  los palomares con dos o más palomas.
*/

var estadoAct1 = { n: 5, m: 3, asignacion: [] };

function reiniciarAsignacionAct1() {
  estadoAct1.asignacion = new Array(estadoAct1.n).fill(null);
}

function contarPorPalomarAct1() {
  var conteos = new Array(estadoAct1.m).fill(0);
  estadoAct1.asignacion.forEach(function (palomar) {
    if (palomar !== null) {
      conteos[palomar] += 1;
    }
  });
  return conteos;
}

function renderPalomasAct1() {
  var lista = document.getElementById("act1-lista-palomas");
  lista.innerHTML = "";
  for (var i = 0; i < estadoAct1.n; i++) {
    (function (indice) {
      var fila = document.createElement("li");
      fila.className = "fila-paloma";

      var etiqueta = document.createElement("label");
      etiqueta.setAttribute("for", "act1-paloma-" + indice);
      etiqueta.textContent = "Paloma " + (indice + 1);

      var select = document.createElement("select");
      select.id = "act1-paloma-" + indice;

      var opcionVacia = document.createElement("option");
      opcionVacia.value = "";
      opcionVacia.textContent = "Sin asignar";
      select.appendChild(opcionVacia);

      for (var j = 0; j < estadoAct1.m; j++) {
        var opcion = document.createElement("option");
        opcion.value = String(j);
        opcion.textContent = "Palomar " + (j + 1);
        select.appendChild(opcion);
      }

      var valorActual = estadoAct1.asignacion[indice];
      select.value = valorActual === null || valorActual === undefined ? "" : String(valorActual);

      select.addEventListener("change", function () {
        estadoAct1.asignacion[indice] = select.value === "" ? null : parseInt(select.value, 10);
        actualizarResultadoAct1();
      });

      fila.appendChild(etiqueta);
      fila.appendChild(select);
      lista.appendChild(fila);
    })(i);
  }
}

function renderPalomaresAct1(conteos) {
  var rejilla = document.getElementById("act1-rejilla-palomares");
  rejilla.innerHTML = "";
  conteos.forEach(function (cuenta, indice) {
    var tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-palomar" + (cuenta >= 2 ? " colision" : "");

    var titulo = document.createElement("span");
    titulo.textContent = "Palomar " + (indice + 1);

    var numero = document.createElement("span");
    numero.className = "cuenta";
    numero.textContent = String(cuenta);

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(numero);

    if (cuenta >= 2) {
      var aviso = document.createElement("span");
      aviso.className = "aviso-colision";
      aviso.textContent = "⚠ " + cuenta + " palomas aquí";
      tarjeta.appendChild(aviso);
    }

    rejilla.appendChild(tarjeta);
  });
}

function actualizarResultadoAct1() {
  var conteos = contarPorPalomarAct1();
  renderPalomaresAct1(conteos);

  var asignadas = estadoAct1.asignacion.filter(function (v) {
    return v !== null;
  }).length;
  var palomaresConColision = conteos.filter(function (c) {
    return c >= 2;
  }).length;
  var esInyectiva = asignadas === estadoAct1.n && palomaresConColision === 0;

  var resumen = document.getElementById("act1-resumen");
  var mensaje;
  if (asignadas < estadoAct1.n) {
    mensaje =
      "Asignadas " + asignadas + " de " + estadoAct1.n + " palomas. " +
      (palomaresConColision > 0
        ? "Ya hay " + palomaresConColision + " palomar(es) con dos o más palomas: la función no es inyectiva."
        : "Aún no hay colisiones.");
  } else if (esInyectiva) {
    mensaje = "Las " + estadoAct1.n + " palomas están asignadas sin colisiones: la función f es inyectiva.";
  } else {
    mensaje =
      "Las " + estadoAct1.n + " palomas están asignadas. Hay " + palomaresConColision +
      " palomar(es) con dos o más palomas: la función f no es inyectiva.";
  }
  anunciar(resumen, mensaje);
  resumen.className = "aviso " + (esInyectiva && asignadas === estadoAct1.n ? "aviso-exito" : palomaresConColision > 0 ? "aviso-error" : "aviso-info");

  var banner = document.getElementById("act1-banner-imposible");
  if (estadoAct1.n > estadoAct1.m) {
    banner.hidden = false;
    banner.textContent =
      "Como hay " + estadoAct1.n + " palomas y solo " + estadoAct1.m +
      " palomares, es imposible asignar todas las palomas sin que algún palomar reciba dos o más: " +
      "el principio del palomar lo garantiza, sin importar cómo intentes acomodarlas.";
  } else {
    banner.hidden = true;
  }
}

function asignacionAleatoriaAct1() {
  estadoAct1.asignacion = estadoAct1.asignacion.map(function () {
    return enteroAleatorio(0, estadoAct1.m - 1);
  });
  renderPalomasAct1();
  actualizarResultadoAct1();
}

function reiniciarAct1() {
  reiniciarAsignacionAct1();
  renderPalomasAct1();
  actualizarResultadoAct1();
}

function aplicarNuevosNM_Act1(n, m) {
  estadoAct1.n = n;
  estadoAct1.m = m;
  reiniciarAsignacionAct1();
  renderPalomasAct1();
  actualizarResultadoAct1();
}

function initActividad1() {
  var contenedorControl = document.getElementById("act1-control-nm");
  reiniciarAsignacionAct1();
  crearControlNM({
    contenedor: contenedorControl,
    idPrefijo: "act1",
    nInicial: estadoAct1.n,
    mInicial: estadoAct1.m,
    onCambio: aplicarNuevosNM_Act1
  });

  renderPalomasAct1();
  actualizarResultadoAct1();

  document.getElementById("act1-boton-aleatorio").addEventListener("click", asignacionAleatoriaAct1);
  document.getElementById("act1-boton-reiniciar").addEventListener("click", reiniciarAct1);
}
