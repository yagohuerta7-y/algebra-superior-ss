/*
  Utilidades compartidas por las actividades del tema "Principio del palomar":
  un control n/m reutilizable (slider + input numérico sincronizados) y un
  wrapper delgado sobre katex.render para fórmulas que cambian en vivo.
*/

/**
 * Crea un control con dos pares slider+número sincronizados para elegir
 * n (palomas) y m (palomares), en el rango [1, limite].
 *
 * @param {Object} opciones
 * @param {HTMLElement} opciones.contenedor - dónde insertar el control.
 * @param {string} opciones.idPrefijo - prefijo único para los ids generados.
 * @param {number} [opciones.nInicial]
 * @param {number} [opciones.mInicial]
 * @param {number} [opciones.limite]
 * @param {(n: number, m: number) => void} opciones.onCambio
 * @returns {{obtenerValores: () => {n:number,m:number}}}
 */
function crearControlNM(opciones) {
  var contenedor = opciones.contenedor;
  var prefijo = opciones.idPrefijo;
  var limite = opciones.limite || 10;
  var n = opciones.nInicial || 5;
  var m = opciones.mInicial || 3;
  var onCambio = opciones.onCambio || function () {};

  contenedor.innerHTML = "";
  var envoltura = document.createElement("div");
  envoltura.className = "control-nm";

  function crearCampo(clave, etiquetaTexto, valorInicial, alCambiar) {
    var campo = document.createElement("div");
    campo.className = "campo";

    var idCampo = prefijo + "-" + clave;
    var etiqueta = document.createElement("label");
    etiqueta.setAttribute("for", idCampo + "-rango");
    etiqueta.textContent = etiquetaTexto;

    var fila = document.createElement("div");
    fila.className = "fila-rango";

    var rango = document.createElement("input");
    rango.type = "range";
    rango.id = idCampo + "-rango";
    rango.min = "1";
    rango.max = String(limite);
    rango.value = String(valorInicial);

    var numero = document.createElement("input");
    numero.type = "number";
    numero.id = idCampo + "-numero";
    numero.min = "1";
    numero.max = String(limite);
    numero.value = String(valorInicial);
    numero.setAttribute("aria-label", etiquetaTexto + " (valor exacto)");

    function sincronizar(valor) {
      var v = Math.max(1, Math.min(limite, parseInt(valor, 10) || 1));
      rango.value = String(v);
      numero.value = String(v);
      alCambiar(v);
    }

    rango.addEventListener("input", function () {
      sincronizar(rango.value);
    });
    numero.addEventListener("input", function () {
      sincronizar(numero.value);
    });

    fila.appendChild(rango);
    fila.appendChild(numero);
    campo.appendChild(etiqueta);
    campo.appendChild(fila);
    envoltura.appendChild(campo);
  }

  crearCampo("n", "Número de palomas (n)", n, function (v) {
    n = v;
    onCambio(n, m);
  });
  crearCampo("m", "Número de palomares (m)", m, function (v) {
    m = v;
    onCambio(n, m);
  });

  contenedor.appendChild(envoltura);

  return {
    obtenerValores: function () {
      return { n: n, m: m };
    }
  };
}

/**
 * Renderiza una fórmula LaTeX dentro de un elemento usando KaTeX (vendorizado
 * en vendor/katex/). Pensado para fórmulas que se recalculan dinámicamente;
 * el contenido matemático estático se procesa una sola vez con
 * renderMathInElement (ver palomar-main.js).
 */
function katexRender(formula, elemento, display) {
  if (!elemento || typeof katex === "undefined") {
    return;
  }
  katex.render(formula, elemento, { throwOnError: false, displayMode: !!display });
}

var KATEX_DELIMITADORES = [
  { left: "$$", right: "$$", display: true },
  { left: "$", right: "$", display: false },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true }
];

/**
 * Vuelve a procesar las fórmulas LaTeX dentro de un elemento con
 * renderMathInElement. Necesario para contenido insertado dinámicamente
 * después del renderizado inicial de la página (por ejemplo, la
 * retroalimentación del cuestionario), ya que ese renderizado inicial solo
 * procesa el contenido que existe en el DOM en ese momento.
 */
function renderMathEnElemento(elemento) {
  if (elemento && window.renderMathInElement) {
    window.renderMathInElement(elemento, { delimiters: KATEX_DELIMITADORES, throwOnError: false });
  }
}

function enteroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}
