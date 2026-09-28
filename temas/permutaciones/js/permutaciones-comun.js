/*
  Utilidades compartidas por las actividades del tema "Grupo de
  permutaciones": construcción/validación de una permutación de {1,...,9}
  mediante 9 <select>, operaciones del grupo (composición, inversa, orden),
  notación (dos líneas y ciclos), y renderizado del Sudoku.
*/

/**
 * Crea un control con 9 <select> (uno por dígito del dominio) para construir
 * una permutación de {1,...,9}. Marca en vivo las filas cuyo valor colisiona
 * con otra (es decir, mientras la asignación no sea biyectiva).
 *
 * @param {Object} opciones
 * @param {HTMLElement} opciones.contenedor
 * @param {string} opciones.idPrefijo - prefijo único para los ids generados.
 * @param {number[]} [opciones.valoresIniciales] - permutación inicial (por defecto la identidad).
 * @param {string} [opciones.etiqueta] - letra usada en las etiquetas (por defecto "f").
 * @param {(permutacion: number[], resultado: {esValida:boolean, colisiones:number[], repetidos:number[], faltantes:number[]}) => void} opciones.onCambio
 * @returns {{obtenerPermutacion: () => number[], establecerPermutacion: (arreglo: number[]) => void, aleatorizar: () => void, reiniciar: () => void}}
 */
function crearConstructorPermutacion(opciones) {
  var contenedor = opciones.contenedor;
  var prefijo = opciones.idPrefijo;
  var etiqueta = opciones.etiqueta || "f";
  var onCambio = opciones.onCambio || function () {};
  var permutacion = (opciones.valoresIniciales || [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice();

  contenedor.innerHTML = "";
  var envoltura = document.createElement("div");
  envoltura.className = "constructor-permutacion";

  var filas = [];
  var selects = [];

  for (var i = 0; i < 9; i++) {
    (function (indice) {
      var dominio = indice + 1;
      var fila = document.createElement("div");
      fila.className = "fila-permutacion";

      var idSelect = prefijo + "-" + dominio;
      var label = document.createElement("label");
      label.setAttribute("for", idSelect);
      label.textContent = etiqueta + "(" + dominio + ") =";

      var select = document.createElement("select");
      select.id = idSelect;
      for (var valor = 1; valor <= 9; valor++) {
        var option = document.createElement("option");
        option.value = String(valor);
        option.textContent = String(valor);
        select.appendChild(option);
      }
      select.value = String(permutacion[indice]);

      select.addEventListener("change", function () {
        permutacion[indice] = parseInt(select.value, 10);
        actualizar();
      });

      fila.appendChild(label);
      fila.appendChild(select);
      envoltura.appendChild(fila);

      filas.push(fila);
      selects.push(select);
    })(i);
  }

  contenedor.appendChild(envoltura);

  function actualizar() {
    var resultado = verificarBiyeccion(permutacion);
    filas.forEach(function (fila, indice) {
      var enColision = resultado.colisiones.indexOf(indice) !== -1;
      fila.className = "fila-permutacion" + (enColision ? " colision-permutacion" : "");
    });
    onCambio(permutacion.slice(), resultado);
  }

  actualizar();

  return {
    obtenerPermutacion: function () {
      return permutacion.slice();
    },
    establecerPermutacion: function (arreglo) {
      permutacion = arreglo.slice();
      selects.forEach(function (select, indice) {
        select.value = String(permutacion[indice]);
      });
      actualizar();
    },
    aleatorizar: function () {
      this.establecerPermutacion(generarPermutacionAleatoria());
    },
    reiniciar: function () {
      this.establecerPermutacion([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  };
}

/**
 * Verifica si un arreglo de 9 valores en {1,...,9} es una biyección (es
 * decir, una permutación válida): como el dominio y el codominio tienen el
 * mismo tamaño finito, basta con que no haya valores repetidos.
 */
function verificarBiyeccion(permutacion) {
  var conteo = new Array(9).fill(0);
  permutacion.forEach(function (valor) {
    conteo[valor - 1] += 1;
  });

  var repetidos = [];
  var faltantes = [];
  for (var valor = 1; valor <= 9; valor++) {
    if (conteo[valor - 1] > 1) {
      repetidos.push(valor);
    } else if (conteo[valor - 1] === 0) {
      faltantes.push(valor);
    }
  }

  var colisiones = [];
  permutacion.forEach(function (valor, indice) {
    if (conteo[valor - 1] > 1) {
      colisiones.push(indice);
    }
  });

  return {
    esValida: repetidos.length === 0,
    colisiones: colisiones,
    repetidos: repetidos,
    faltantes: faltantes
  };
}

/** Shuffle de Fisher-Yates de [1,...,9]. */
function generarPermutacionAleatoria() {
  var arreglo = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (var i = arreglo.length - 1; i > 0; i--) {
    var j = enteroAleatorio(0, i);
    var temporal = arreglo[i];
    arreglo[i] = arreglo[j];
    arreglo[j] = temporal;
  }
  return arreglo;
}

/** Aplica una permutación a cada celda de un Sudoku (arreglo 9x9). */
function aplicarPermutacionASudoku(sudoku, permutacion) {
  return sudoku.map(function (fila) {
    return fila.map(function (valor) {
      return permutacion[valor - 1];
    });
  });
}

/**
 * Renderiza un Sudoku (arreglo 9x9) dentro de un contenedor, delineando las
 * cajas de 3x3 y, si se da `opciones.sudokuComparar`, resaltando las celdas
 * cuyo valor cambió respecto a ese otro Sudoku.
 */
function renderSudoku(contenedor, sudoku, opciones) {
  var sudokuComparar = (opciones || {}).sudokuComparar;
  contenedor.innerHTML = "";
  for (var fila = 0; fila < 9; fila++) {
    for (var columna = 0; columna < 9; columna++) {
      var celda = document.createElement("div");
      var clases = ["celda-sudoku"];
      if (columna % 3 === 2 && columna !== 8) {
        clases.push("borde-caja-derecha");
      }
      if (fila % 3 === 2 && fila !== 8) {
        clases.push("borde-caja-inferior");
      }
      if (sudokuComparar && sudoku[fila][columna] !== sudokuComparar[fila][columna]) {
        clases.push("celda-cambiada");
      }
      celda.className = clases.join(" ");
      celda.textContent = String(sudoku[fila][columna]);
      contenedor.appendChild(celda);
    }
  }
}

/** Descompone una permutación en sus ciclos disjuntos (arreglo de arreglos). */
function calcularCiclos(permutacion) {
  var visitados = new Array(9).fill(false);
  var ciclos = [];

  for (var inicio = 1; inicio <= 9; inicio++) {
    if (visitados[inicio - 1]) {
      continue;
    }
    var ciclo = [];
    var actual = inicio;
    while (!visitados[actual - 1]) {
      visitados[actual - 1] = true;
      ciclo.push(actual);
      actual = permutacion[actual - 1];
    }
    ciclos.push(ciclo);
  }

  return ciclos;
}

/** Notación de ciclos en LaTeX, omitiendo los ciclos de longitud 1 (puntos fijos). */
function formatoNotacionCiclos(permutacion) {
  var ciclosNoTriviales = calcularCiclos(permutacion).filter(function (ciclo) {
    return ciclo.length > 1;
  });

  if (ciclosNoTriviales.length === 0) {
    return "\\text{id}";
  }

  return ciclosNoTriviales
    .map(function (ciclo) {
      return "(" + ciclo.join("\\;") + ")";
    })
    .join("");
}

/** Notación de dos líneas en LaTeX (\begin{pmatrix}...\end{pmatrix}). */
function formatoNotacionDosLineas(permutacion) {
  var dominio = [1, 2, 3, 4, 5, 6, 7, 8, 9].join(" & ");
  var imagenes = permutacion.join(" & ");
  return "\\begin{pmatrix} " + dominio + " \\\\ " + imagenes + " \\end{pmatrix}";
}

/** Compone sigma y tau: (sigma ∘ tau)(x) = sigma(tau(x)). */
function componerPermutaciones(sigma, tau) {
  return tau.map(function (valor) {
    return sigma[valor - 1];
  });
}

/** Desglose paso a paso de (sigma ∘ tau)(x) = sigma(tau(x)) para x = 1,...,9. */
function pasosComposicion(sigma, tau) {
  var pasos = [];
  for (var x = 1; x <= 9; x++) {
    var tauX = tau[x - 1];
    var resultado = sigma[tauX - 1];
    pasos.push({ x: x, tauX: tauX, resultado: resultado });
  }
  return pasos;
}

/** Calcula la permutación inversa de sigma. */
function invertirPermutacion(sigma) {
  var inversa = new Array(9);
  sigma.forEach(function (valor, indice) {
    inversa[valor - 1] = indice + 1;
  });
  return inversa;
}

function mcd(a, b) {
  while (b !== 0) {
    var resto = a % b;
    a = b;
    b = resto;
  }
  return a;
}

function mcm(a, b) {
  return (a * b) / mcd(a, b);
}

/** Orden de una permutación: mínimo común múltiplo de las longitudes de sus ciclos. */
function ordenPermutacion(permutacion) {
  return calcularCiclos(permutacion)
    .map(function (ciclo) {
      return ciclo.length;
    })
    .reduce(mcm, 1);
}

/** Compara dos permutaciones elemento a elemento. */
function compararPermutaciones(a, b) {
  return a.length === b.length && a.every(function (valor, indice) {
    return valor === b[indice];
  });
}

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

function renderMathEnElemento(elemento) {
  if (elemento && window.renderMathInElement) {
    window.renderMathInElement(elemento, { delimiters: KATEX_DELIMITADORES, throwOnError: false });
  }
}

function enteroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}
