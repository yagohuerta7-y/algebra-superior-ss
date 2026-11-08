/*
  Componentes compartidos por los temas de estructuras algebraicas (grupos,
  anillos, campos y espacios vectoriales). Cargar después de js/comun.js y de
  KaTeX. Notación común a todos los temas:
    - operación genérica de grupo: \ast, neutro: e, inverso: a^{-1}
    - operaciones de anillo/campo: + (neutro 0, opuesto -a) y \cdot (neutro 1, inverso a^{-1})
  Incluye:
    - utilidades KaTeX
    - estructuras finitas (Z_n, diedrales, Klein, unidades) con tabla calculada por código
    - analizarEstructura: verificación automática de los axiomas
    - crearTablaOperacion: tabla de operación/Cayley interactiva
    - crearChecklistAxiomas: "¿es un grupo?" con ejemplos y no-ejemplos
    - crearDiagramaEstructuras: mapa de relaciones entre estructuras
*/

/* ---------- KaTeX ---------- */

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

function prefiereMenosMovimiento() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/* Escribe texto con fórmulas $...$ en un elemento y lo renderiza. */
function escribirConMath(elemento, texto) {
  elemento.textContent = texto;
  renderMathEnElemento(elemento);
}

/* ---------- Estructuras finitas ---------- */

/*
  Una estructura finita es:
    { nombre (LaTeX), simbolo (LaTeX), elementos: [{latex, texto}], n,
      tabla[i][j] = índice del resultado, o -1 si cae fuera del conjunto,
      valorFuera(i, j) = LaTeX del resultado cuando cae fuera (opcional) }
*/
function crearEstructura(datos) {
  var n = datos.elementos.length;
  var tabla = [];
  for (var i = 0; i < n; i++) {
    tabla.push([]);
    for (var j = 0; j < n; j++) {
      tabla[i].push(datos.op(i, j));
    }
  }
  datos.n = n;
  datos.tabla = tabla;
  return datos;
}

/* (Z_n, +) */
function estructuraZn(n) {
  var elementos = [];
  for (var k = 0; k < n; k++) {
    elementos.push({ latex: String(k), texto: String(k) });
  }
  return crearEstructura({
    nombre: "(\\mathbb{Z}_{" + n + "}, +)",
    simbolo: "+",
    elementos: elementos,
    op: function (i, j) {
      return (i + j) % n;
    }
  });
}

/* ({1, ..., n-1}, · mod n): puede no ser cerrado (si n no es primo). */
function estructuraZnMultiplicativo(n) {
  var elementos = [];
  for (var k = 1; k < n; k++) {
    elementos.push({ latex: String(k), texto: String(k) });
  }
  return crearEstructura({
    nombre: "(\\mathbb{Z}_{" + n + "}\\setminus\\{0\\}, \\cdot)",
    simbolo: "\\cdot",
    elementos: elementos,
    op: function (i, j) {
      var valor = ((i + 1) * (j + 1)) % n;
      return valor === 0 ? -1 : valor - 1;
    },
    valorFuera: function () {
      return "0";
    }
  });
}

/*
  Grupo diedral D_n: simetrías del polígono regular de n lados.
  Cada elemento es r^k s^f ("primero s^f, luego r^k"). a ∗ b significa
  "primero b, luego a", igual que la composición de funciones.
  Se guarda la permutación de posiciones: perms[i][x] = posición a la que va
  el vértice que estaba en la posición x.
*/
function estructuraDiedral(n) {
  var perms = [];
  var elementos = [];
  for (var f = 0; f < 2; f++) {
    for (var k = 0; k < n; k++) {
      var p = [];
      for (var x = 0; x < n; x++) {
        var despuesDeS = f ? (n - x) % n : x;
        p.push((despuesDeS + k) % n);
      }
      perms.push(p);
      var potencia = k === 0 ? "" : k === 1 ? "r" : "r^{" + k + "}";
      var reflexion = f ? "s" : "";
      var latex = potencia + reflexion || "e";
      var texto = latex.replace(/\^\{(\d+)\}/g, "^$1");
      elementos.push({ latex: latex, texto: texto });
    }
  }
  var indicePorClave = {};
  perms.forEach(function (p, idx) {
    indicePorClave[p.join(",")] = idx;
  });
  var est = crearEstructura({
    nombre: "D_{" + n + "}",
    simbolo: "\\ast",
    elementos: elementos,
    op: function (i, j) {
      var c = [];
      for (var x = 0; x < n; x++) {
        c.push(perms[i][perms[j][x]]);
      }
      return indicePorClave[c.join(",")];
    }
  });
  est.perms = perms;
  est.lados = n;
  return est;
}

/* Grupo de Klein V_4 = {e, a, b, c}: cada elemento es su propio inverso. */
function estructuraKlein() {
  var nombres = ["e", "a", "b", "c"];
  return crearEstructura({
    nombre: "(V_4, \\ast)",
    simbolo: "\\ast",
    elementos: nombres.map(function (t) {
      return { latex: t, texto: t };
    }),
    op: function (i, j) {
      return i ^ j;
    }
  });
}

/* ---------- Verificación de axiomas ---------- */

var AXIOMAS_GRUPO = [
  { clave: "cerradura", nombre: "Cerradura" },
  { clave: "asociatividad", nombre: "Asociatividad" },
  { clave: "identidad", nombre: "Identidad (neutro)" },
  { clave: "inversos", nombre: "Inversos" },
  { clave: "conmutatividad", nombre: "Conmutatividad (extra, no es parte de la definición)" }
];

function nombreDeAxioma(clave) {
  for (var i = 0; i < AXIOMAS_GRUPO.length; i++) {
    if (AXIOMAS_GRUPO[i].clave === clave) {
      return AXIOMAS_GRUPO[i].nombre;
    }
  }
  return clave;
}

function expresionOp(est, i, j) {
  return est.elementos[i].latex + " " + est.simbolo + " " + est.elementos[j].latex;
}

/*
  Revisa uno por uno los axiomas de grupo en una estructura finita.
  Devuelve { items: [{clave, ok, texto}], esGrupo, neutro, inversos, abeliana }.
*/
function analizarEstructura(est) {
  var n = est.n;
  var tabla = est.tabla;
  var i, j, k;
  var items = [];

  var fuera = null;
  for (i = 0; i < n && !fuera; i++) {
    for (j = 0; j < n && !fuera; j++) {
      if (tabla[i][j] < 0) {
        fuera = [i, j];
      }
    }
  }
  if (fuera) {
    var valor = est.valorFuera ? est.valorFuera(fuera[0], fuera[1]) : "?";
    items.push({
      clave: "cerradura",
      ok: false,
      texto:
        "$" + expresionOp(est, fuera[0], fuera[1]) + " = " + valor +
        "$, y ese resultado no pertenece al conjunto."
    });
  } else {
    items.push({
      clave: "cerradura",
      ok: true,
      texto: "Al operar dos elementos cualesquiera el resultado siempre cae dentro del conjunto: se ve porque la tabla solo contiene elementos del conjunto."
    });
  }

  var contraAsoc = null;
  for (i = 0; i < n && !contraAsoc; i++) {
    for (j = 0; j < n && !contraAsoc; j++) {
      for (k = 0; k < n && !contraAsoc; k++) {
        var ij = tabla[i][j];
        var jk = tabla[j][k];
        if (ij < 0 || jk < 0) {
          continue;
        }
        var izq = tabla[ij][k];
        var der = tabla[i][jk];
        if (izq >= 0 && der >= 0 && izq !== der) {
          contraAsoc = [i, j, k];
        }
      }
    }
  }
  items.push(
    contraAsoc
      ? {
          clave: "asociatividad",
          ok: false,
          texto: "Con $" + est.elementos[contraAsoc[0]].latex + "$, $" + est.elementos[contraAsoc[1]].latex + "$, $" + est.elementos[contraAsoc[2]].latex + "$ los dos agrupamientos dan resultados distintos."
        }
      : {
          clave: "asociatividad",
          ok: true,
          texto: (fuera ? "Donde los productos están definidos, " : "Se revisaron las $" + n * n * n + "$ ternas posibles y ") + "siempre $(a \\, " + est.simbolo + " \\, b) \\, " + est.simbolo + " \\, c = a \\, " + est.simbolo + " \\, (b \\, " + est.simbolo + " \\, c)$."
        }
  );

  var neutro = null;
  for (i = 0; i < n && neutro === null; i++) {
    var sirve = true;
    for (j = 0; j < n && sirve; j++) {
      if (tabla[i][j] !== j || tabla[j][i] !== j) {
        sirve = false;
      }
    }
    if (sirve) {
      neutro = i;
    }
  }
  items.push(
    neutro !== null
      ? {
          clave: "identidad",
          ok: true,
          texto: "El neutro es $" + est.elementos[neutro].latex + "$: su fila y su columna repiten los encabezados."
        }
      : {
          clave: "identidad",
          ok: false,
          texto: "Ningún elemento $e$ cumple $e \\, " + est.simbolo + " \\, a = a \\, " + est.simbolo + " \\, e = a$ para todo $a$."
        }
  );

  var inversos = [];
  var sinInverso = null;
  if (neutro !== null) {
    for (i = 0; i < n; i++) {
      var inverso = -1;
      for (j = 0; j < n && inverso < 0; j++) {
        if (tabla[i][j] === neutro && tabla[j][i] === neutro) {
          inverso = j;
        }
      }
      inversos.push(inverso);
      if (inverso < 0 && sinInverso === null) {
        sinInverso = i;
      }
    }
  }
  if (neutro === null) {
    items.push({
      clave: "inversos",
      ok: false,
      texto: "Sin neutro la pregunta ni siquiera tiene sentido: un inverso es un elemento que da el neutro."
    });
  } else if (sinInverso !== null) {
    items.push({
      clave: "inversos",
      ok: false,
      texto: "$" + est.elementos[sinInverso].latex + "$ no tiene inverso: ningún $b$ cumple $" + est.elementos[sinInverso].latex + " \\, " + est.simbolo + " \\, b = b \\, " + est.simbolo + " \\, " + est.elementos[sinInverso].latex + " = " + est.elementos[neutro].latex + "$."
    });
  } else {
    items.push({
      clave: "inversos",
      ok: true,
      texto: "En cada fila y cada columna aparece el neutro $" + est.elementos[neutro].latex + "$, así que todo elemento tiene inverso."
    });
  }

  var contraConm = null;
  for (i = 0; i < n && !contraConm; i++) {
    for (j = i + 1; j < n && !contraConm; j++) {
      if (tabla[i][j] !== tabla[j][i]) {
        contraConm = [i, j];
      }
    }
  }
  items.push(
    contraConm
      ? {
          clave: "conmutatividad",
          opcional: true,
          ok: false,
          texto: "$" + expresionOp(est, contraConm[0], contraConm[1]) + " \\neq " + expresionOp(est, contraConm[1], contraConm[0]) + "$: el orden importa."
        }
      : {
          clave: "conmutatividad",
          opcional: true,
          ok: true,
          texto: "La tabla es simétrica respecto a la diagonal: $a \\, " + est.simbolo + " \\, b = b \\, " + est.simbolo + " \\, a$."
        }
  );

  var esGrupo = items[0].ok && items[1].ok && items[2].ok && items[3].ok;
  return {
    items: items,
    esGrupo: esGrupo,
    neutro: neutro,
    inversos: inversos,
    abeliana: items[4].ok
  };
}

/* ¿Cada elemento aparece exactamente una vez en cada fila y cada columna? */
function esCuadradoLatino(est) {
  var n = est.n;
  for (var a = 0; a < n; a++) {
    var enFila = {};
    var enColumna = {};
    for (var b = 0; b < n; b++) {
      var f = est.tabla[a][b];
      var c = est.tabla[b][a];
      if (f < 0 || c < 0 || enFila[f] || enColumna[c]) {
        return false;
      }
      enFila[f] = true;
      enColumna[c] = true;
    }
  }
  return true;
}

/*
  Subconjunto de Z_n (dado por sus valores) con la suma o el producto módulo n.
  tipo: "+" o "*". Si el resultado no está en el subconjunto, la tabla guarda -1.
*/
function estructuraModular(n, valores, tipo) {
  var indice = {};
  valores.forEach(function (v, k) {
    indice[v] = k;
  });
  function valor(i, j) {
    return tipo === "+" ? (valores[i] + valores[j]) % n : (valores[i] * valores[j]) % n;
  }
  return crearEstructura({
    nombre: "\\mathbb{Z}_{" + n + "}",
    simbolo: tipo === "+" ? "+" : "\\cdot",
    elementos: valores.map(function (v) {
      return { latex: String(v), texto: String(v) };
    }),
    op: function (i, j) {
      var r = valor(i, j);
      return indice[r] === undefined ? -1 : indice[r];
    },
    valorFuera: function (i, j) {
      return String(valor(i, j));
    }
  });
}

/* (Z_n, ·) con todos los elementos, incluido el 0 (no es un grupo; es la parte multiplicativa del anillo). */
function estructuraZnProducto(n) {
  var valores = [];
  for (var k = 0; k < n; k++) {
    valores.push(k);
  }
  return estructuraModular(n, valores, "*");
}

var AXIOMAS_ANILLO = [
  { clave: "suma", nombre: "Suma (grupo abeliano)" },
  { clave: "cerradura", nombre: "Producto cerrado" },
  { clave: "asociatividad", nombre: "Producto asociativo" },
  { clave: "distributividad", nombre: "Distributividad" },
  { clave: "unidad", nombre: "Unidad (extra)" },
  { clave: "conmutatividad", nombre: "Producto conmutativo (extra)" }
];

/*
  Revisa los axiomas de anillo en dos estructuras finitas sobre los mismos elementos:
  suma (grupo abeliano) y producto. Devuelve items como analizarEstructura.
*/
function analizarAnillo(suma, prod) {
  var n = suma.n;
  var i, j, k;
  var aSuma = analizarEstructura(suma);
  var aProd = analizarEstructura(prod);
  var items = [];

  var fallaSuma = null;
  for (i = 0; i < 4 && !fallaSuma; i++) {
    if (!aSuma.items[i].ok) {
      fallaSuma = aSuma.items[i];
    }
  }
  var sumaOk = !fallaSuma && aSuma.abeliana;
  items.push({
    clave: "suma",
    nombre: nombreEn(AXIOMAS_ANILLO, "suma"),
    ok: sumaOk,
    texto: sumaOk
      ? "La suma cumple los cuatro axiomas de grupo y además es conmutativa; el neutro es $" + suma.elementos[aSuma.neutro].latex + "$."
      : fallaSuma
      ? "En la suma falla " + nombreDeAxioma(fallaSuma.clave).toLowerCase() + ". " + fallaSuma.texto
      : "La suma no es conmutativa."
  });

  items.push({ clave: "cerradura", nombre: nombreEn(AXIOMAS_ANILLO, "cerradura"), ok: aProd.items[0].ok, texto: aProd.items[0].texto });
  items.push({ clave: "asociatividad", nombre: nombreEn(AXIOMAS_ANILLO, "asociatividad"), ok: aProd.items[1].ok, texto: aProd.items[1].texto });

  var contra = null;
  for (i = 0; i < n && !contra; i++) {
    for (j = 0; j < n && !contra; j++) {
      for (k = 0; k < n && !contra; k++) {
        var s = suma.tabla[j][k];
        var izq = s < 0 ? -1 : prod.tabla[i][s];
        var a = prod.tabla[i][j];
        var b = prod.tabla[i][k];
        var der = a < 0 || b < 0 ? -1 : suma.tabla[a][b];
        if (izq >= 0 && der >= 0 && izq !== der) {
          contra = [i, j, k];
        }
        var s2 = suma.tabla[i][j];
        var izq2 = s2 < 0 ? -1 : prod.tabla[s2][k];
        var c = prod.tabla[i][k];
        var d = prod.tabla[j][k];
        var der2 = c < 0 || d < 0 ? -1 : suma.tabla[c][d];
        if (izq2 >= 0 && der2 >= 0 && izq2 !== der2) {
          contra = [i, j, k];
        }
      }
    }
  }
  items.push({
    clave: "distributividad",
    nombre: nombreEn(AXIOMAS_ANILLO, "distributividad"),
    ok: !contra,
    texto: contra
      ? "Con $" + suma.elementos[contra[0]].latex + "$, $" + suma.elementos[contra[1]].latex + "$, $" + suma.elementos[contra[2]].latex + "$ falla $a(b+c) = ab + ac$ (o la versión por la derecha)."
      : "Se revisaron todas las ternas: $a(b+c) = ab + ac$ y $(a+b)c = ac + bc$."
  });

  items.push({
    clave: "unidad",
    nombre: nombreEn(AXIOMAS_ANILLO, "unidad"),
    opcional: true,
    ok: aProd.neutro !== null,
    texto:
      aProd.neutro !== null
        ? "La unidad es $" + prod.elementos[aProd.neutro].latex + "$: multiplicar por él no cambia nada."
        : "Ningún elemento $u$ cumple $u \\cdot a = a \\cdot u = a$ para todo $a$."
  });
  items.push({
    clave: "conmutatividad",
    nombre: nombreEn(AXIOMAS_ANILLO, "conmutatividad"),
    opcional: true,
    ok: aProd.abeliana,
    texto: aProd.items[4].texto
  });
  return items;
}

function nombreEn(lista, clave) {
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].clave === clave) {
      return lista[i].nombre;
    }
  }
  return clave;
}

/* ---------- Tabla de operación ---------- */

function tonoDeElemento(indice, total) {
  return Math.round((indice * 360) / total + 20) % 360;
}

/**
 * Tabla de operación (de Cayley) interactiva y accesible.
 * @param {HTMLElement} contenedor
 * @param {{estructura:Object, idPrefijo?:string, etiqueta?:string, colorear?:boolean,
 *          resaltarInversos?:boolean, resaltarDiagonal?:boolean, mostrarLeyenda?:boolean,
 *          mostrarLatino?:boolean, onSeleccion?:Function}} opciones
 */
function crearTablaOperacion(contenedor, opciones) {
  var est = opciones.estructura;
  var n = est.n;
  var idp = opciones.idPrefijo || "tabla-op";
  var analisis = analizarEstructura(est);
  var neutro = analisis.neutro;
  var estado = { resaltado: null };
  var celdas = [];
  var encabezadosFila = [];
  var encabezadosColumna = [];
  var celdaConTabindex = null;

  contenedor.innerHTML = "";

  var envoltura = document.createElement("div");
  envoltura.className = "tabla-op-envoltura";
  var tabla = document.createElement("table");
  tabla.className = "tabla-op";
  tabla.setAttribute("role", "grid");
  tabla.setAttribute(
    "aria-label",
    opciones.etiqueta ||
      "Tabla de la operación. La fila indica el primer elemento y la columna el segundo."
  );

  var cabecera = document.createElement("tr");
  var esquina = document.createElement("th");
  esquina.className = "tabla-op-esquina";
  esquina.scope = "col";
  katexRender(est.simbolo, esquina);
  cabecera.appendChild(esquina);
  var j, i;
  for (j = 0; j < n; j++) {
    var thc = document.createElement("th");
    thc.scope = "col";
    thc.className = "tabla-op-encabezado" + (j === neutro ? " es-neutro-encabezado" : "");
    katexRender(est.elementos[j].latex, thc);
    cabecera.appendChild(thc);
    encabezadosColumna.push(thc);
  }
  var thead = document.createElement("thead");
  thead.appendChild(cabecera);
  tabla.appendChild(thead);

  var tbody = document.createElement("tbody");
  for (i = 0; i < n; i++) {
    var tr = document.createElement("tr");
    var thf = document.createElement("th");
    thf.scope = "row";
    thf.className = "tabla-op-encabezado" + (i === neutro ? " es-neutro-encabezado" : "");
    katexRender(est.elementos[i].latex, thf);
    tr.appendChild(thf);
    encabezadosFila.push(thf);
    celdas.push([]);
    for (j = 0; j < n; j++) {
      var td = document.createElement("td");
      var v = est.tabla[i][j];
      td.className = "celda-op";
      td.tabIndex = -1;
      td.setAttribute("data-i", String(i));
      td.setAttribute("data-j", String(j));
      td.setAttribute(
        "aria-label",
        "fila " + est.elementos[i].texto + ", columna " + est.elementos[j].texto + ": " +
          (v < 0 ? "fuera del conjunto" : est.elementos[v].texto)
      );
      if (v < 0) {
        td.classList.add("celda-fuera");
        td.textContent = "∉";
      } else {
        td.style.setProperty("--h", String(tonoDeElemento(v, n)));
        katexRender(est.elementos[v].latex, td);
        if (v === neutro) {
          td.classList.add("celda-inversa");
        }
      }
      if (i === j) {
        td.classList.add("celda-diagonal");
      }
      tr.appendChild(td);
      celdas[i].push(td);
    }
    tbody.appendChild(tr);
  }
  tabla.appendChild(tbody);
  envoltura.appendChild(tabla);
  contenedor.appendChild(envoltura);

  celdas[0][0].tabIndex = 0;
  celdaConTabindex = celdas[0][0];

  var leyenda = null;
  if (opciones.mostrarLeyenda !== false) {
    leyenda = document.createElement("div");
    leyenda.className = "tabla-op-leyenda";
    leyenda.setAttribute("role", "group");
    leyenda.setAttribute("aria-label", "Resaltar las celdas donde aparece un elemento");
    var etiquetaLeyenda = document.createElement("span");
    etiquetaLeyenda.className = "tabla-op-leyenda-titulo";
    etiquetaLeyenda.textContent = "Resaltar elemento:";
    leyenda.appendChild(etiquetaLeyenda);
    est.elementos.forEach(function (el, idx) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip-elemento";
      chip.style.setProperty("--h", String(tonoDeElemento(idx, n)));
      chip.setAttribute("aria-pressed", "false");
      chip.setAttribute("aria-label", "Resaltar las celdas donde aparece " + el.texto);
      katexRender(el.latex, chip);
      chip.addEventListener("click", function () {
        resaltarElemento(estado.resaltado === idx ? null : idx);
      });
      leyenda.appendChild(chip);
    });
    contenedor.appendChild(leyenda);
  }

  var explicacion = document.createElement("p");
  explicacion.className = "tabla-op-explicacion aviso aviso-info";
  explicacion.setAttribute("role", "status");
  explicacion.setAttribute("aria-live", "polite");
  explicacion.id = idp + "-explicacion";
  explicacion.textContent = "Toca o recorre con las flechas una celda para leer qué operación representa.";
  contenedor.appendChild(explicacion);

  if (opciones.mostrarLatino !== false) {
    var latino = document.createElement("p");
    latino.className = "tabla-op-latino";
    var esLatino = esCuadradoLatino(est);
    latino.textContent = esLatino
      ? "Cada elemento aparece exactamente una vez en cada fila y en cada columna (un «cuadrado latino»)."
      : "Aquí algún elemento falta o se repite en alguna fila o columna: no es la tabla de un grupo.";
    contenedor.appendChild(latino);
  }

  function limpiarMarcas() {
    for (var a = 0; a < n; a++) {
      encabezadosFila[a].classList.remove("encabezado-activo");
      encabezadosColumna[a].classList.remove("encabezado-activo");
      for (var b = 0; b < n; b++) {
        celdas[a][b].classList.remove("fila-activa", "columna-activa", "celda-activa");
      }
    }
  }

  function enfocar(fila, columna, sinTexto) {
    limpiarMarcas();
    encabezadosFila[fila].classList.add("encabezado-activo");
    encabezadosColumna[columna].classList.add("encabezado-activo");
    for (var a = 0; a < n; a++) {
      celdas[fila][a].classList.add("fila-activa");
      celdas[a][columna].classList.add("columna-activa");
    }
    celdas[fila][columna].classList.add("celda-activa");
    if (sinTexto) {
      return;
    }
    var resultado = est.tabla[fila][columna];
    var texto = "$" + expresionOp(est, fila, columna) + " = ";
    if (resultado < 0) {
      texto += (est.valorFuera ? est.valorFuera(fila, columna) : "?") + "$, que no pertenece al conjunto.";
    } else {
      texto += est.elementos[resultado].latex + "$.";
      if (resultado === neutro) {
        texto += " Como el resultado es el neutro, cada uno es el inverso del otro.";
      }
    }
    escribirConMath(explicacion, texto);
    if (opciones.onSeleccion) {
      opciones.onSeleccion(fila, columna);
    }
  }

  function limpiar() {
    limpiarMarcas();
  }

  function resaltarElemento(idx) {
    estado.resaltado = idx;
    for (var a = 0; a < n; a++) {
      for (var b = 0; b < n; b++) {
        celdas[a][b].classList.toggle("atenuada", idx !== null && est.tabla[a][b] !== idx);
      }
    }
    if (leyenda) {
      var chips = leyenda.querySelectorAll(".chip-elemento");
      for (var c = 0; c < chips.length; c++) {
        chips[c].setAttribute("aria-pressed", c === idx ? "true" : "false");
      }
    }
    if (idx !== null) {
      escribirConMath(
        explicacion,
        "Resaltando $" + est.elementos[idx].latex + "$: aparece " + (esCuadradoLatino(est) ? "una sola vez en cada fila y en cada columna." : "donde se ve en la tabla.")
      );
    }
  }

  function marcarCeldas(predicado) {
    for (var a = 0; a < n; a++) {
      for (var b = 0; b < n; b++) {
        celdas[a][b].classList.toggle("celda-marcada", !!predicado && predicado(a, b, est.tabla[a][b]));
      }
    }
  }

  function establecerColor(activo) {
    tabla.classList.toggle("sin-color", !activo);
  }

  function establecerInversos(activo) {
    tabla.classList.toggle("con-inversos", !!activo);
  }

  function establecerDiagonal(activo) {
    tabla.classList.toggle("con-diagonal", !!activo);
  }

  establecerColor(opciones.colorear !== false);
  establecerInversos(!!opciones.resaltarInversos);
  establecerDiagonal(!!opciones.resaltarDiagonal);

  function mover(fila, columna) {
    var f = Math.max(0, Math.min(n - 1, fila));
    var c = Math.max(0, Math.min(n - 1, columna));
    celdas[f][c].focus();
  }

  tbody.addEventListener("focusin", function (evento) {
    var td = evento.target.closest ? evento.target.closest("td") : null;
    if (!td) {
      return;
    }
    if (celdaConTabindex && celdaConTabindex !== td) {
      celdaConTabindex.tabIndex = -1;
    }
    td.tabIndex = 0;
    celdaConTabindex = td;
    enfocar(Number(td.getAttribute("data-i")), Number(td.getAttribute("data-j")));
  });
  tbody.addEventListener("click", function (evento) {
    var td = evento.target.closest ? evento.target.closest("td") : null;
    if (td) {
      td.focus();
    }
  });
  tbody.addEventListener("mouseover", function (evento) {
    var td = evento.target.closest ? evento.target.closest("td") : null;
    if (td && document.activeElement !== td) {
      enfocar(Number(td.getAttribute("data-i")), Number(td.getAttribute("data-j")));
    }
  });
  tbody.addEventListener("keydown", function (evento) {
    var td = evento.target.closest ? evento.target.closest("td") : null;
    if (!td) {
      return;
    }
    var f = Number(td.getAttribute("data-i"));
    var c = Number(td.getAttribute("data-j"));
    var manejado = true;
    if (evento.key === "ArrowUp") {
      mover(f - 1, c);
    } else if (evento.key === "ArrowDown") {
      mover(f + 1, c);
    } else if (evento.key === "ArrowLeft") {
      mover(f, c - 1);
    } else if (evento.key === "ArrowRight") {
      mover(f, c + 1);
    } else if (evento.key === "Home") {
      mover(f, 0);
    } else if (evento.key === "End") {
      mover(f, n - 1);
    } else {
      manejado = false;
    }
    if (manejado) {
      evento.preventDefault();
    }
  });

  return {
    estructura: est,
    analisis: analisis,
    enfocar: function (fila, columna) {
      enfocar(fila, columna, true);
    },
    limpiar: limpiar,
    resaltarElemento: resaltarElemento,
    establecerColor: establecerColor,
    marcarCeldas: marcarCeldas,
    establecerInversos: establecerInversos,
    establecerDiagonal: establecerDiagonal
  };
}

/* ---------- Checklist de axiomas ---------- */

/**
 * Checklist de axiomas: el estudiante elige un ejemplo y ve qué axiomas se cumplen.
 * @param {HTMLElement} contenedor
 * @param {{idPrefijo:string, ejemplos:Array, sustantivo?:string, resumen?:Function}} opciones
 *   Cada ejemplo trae `estructura` (grupo finito, se analiza sola) o `evaluar()` que devuelve
 *   [{clave, nombre?, ok, texto, opcional?}]. Opcionalmente `tablas: [{etiqueta, estructura}]`.
 *   Los items con `opcional` no cuentan para decidir si es válido (p. ej. conmutatividad).
 */
function crearChecklistAxiomas(contenedor, opciones) {
  var idp = opciones.idPrefijo;
  var ejemplos = opciones.ejemplos;
  var sustantivo = opciones.sustantivo || "grupo";

  contenedor.innerHTML = "";
  contenedor.classList.add("checklist-axiomas");

  var campo = document.createElement("div");
  campo.className = "campo";
  var etiqueta = document.createElement("label");
  etiqueta.setAttribute("for", idp + "-ejemplo");
  etiqueta.textContent = "Elige un ejemplo";
  var selector = document.createElement("select");
  selector.id = idp + "-ejemplo";
  ejemplos.forEach(function (ej, idx) {
    var opcion = document.createElement("option");
    opcion.value = String(idx);
    opcion.textContent = ej.textoSelector || ej.id;
    selector.appendChild(opcion);
  });
  campo.appendChild(etiqueta);
  campo.appendChild(selector);
  contenedor.appendChild(campo);

  var titulo = document.createElement("div");
  titulo.className = "formula-dinamica checklist-titulo";
  contenedor.appendChild(titulo);

  var lista = document.createElement("ul");
  lista.className = "lista-axiomas";
  contenedor.appendChild(lista);

  var resumen = document.createElement("p");
  resumen.className = "aviso aviso-info";
  resumen.setAttribute("role", "status");
  resumen.setAttribute("aria-live", "polite");
  contenedor.appendChild(resumen);

  var zonaTabla = document.createElement("div");
  zonaTabla.className = "checklist-tabla";
  contenedor.appendChild(zonaTabla);

  function resumenPorDefecto(items, fallas) {
    var abeliano = items[items.length - 1].ok;
    return fallas.length === 0
      ? "Sí es un " + sustantivo + (abeliano ? " (y además abeliano)." : ", pero no es abeliano.")
      : "No es un " + sustantivo + ": falla " + fallas.join(", ") + ".";
  }

  function mostrar(idx) {
    var ej = ejemplos[idx];
    var items = ej.estructura ? analizarEstructura(ej.estructura).items : ej.evaluar();
    katexRender(ej.titulo, titulo, true);

    lista.innerHTML = "";
    var fallas = [];
    items.forEach(function (item) {
      if (item.opcional === undefined) {
        item.opcional = item.clave === "conmutatividad";
      }
      var li = document.createElement("li");
      li.className = "axioma " + (item.ok ? "axioma-ok" : item.opcional ? "axioma-no-conmuta" : "axioma-falla");
      var marca = document.createElement("span");
      marca.className = "axioma-marca";
      marca.setAttribute("aria-hidden", "true");
      marca.textContent = item.ok ? "✔" : "✘";
      var cuerpo = document.createElement("div");
      var nombre = document.createElement("strong");
      var nombreAxioma = item.nombre || nombreDeAxioma(item.clave);
      nombre.textContent = nombreAxioma + (item.ok ? ": se cumple" : item.opcional ? ": no se cumple" : ": FALLA");
      var detalle = document.createElement("p");
      detalle.textContent = item.texto;
      cuerpo.appendChild(nombre);
      cuerpo.appendChild(detalle);
      li.appendChild(marca);
      li.appendChild(cuerpo);
      lista.appendChild(li);
      if (!item.ok && !item.opcional) {
        fallas.push(nombreAxioma.toLowerCase());
      }
    });
    renderMathEnElemento(lista);

    resumen.className = "aviso " + (fallas.length === 0 ? "aviso-exito" : "aviso-error");
    resumen.textContent = opciones.resumen ? opciones.resumen(items, fallas) : resumenPorDefecto(items, fallas);

    zonaTabla.innerHTML = "";
    var tablas = ej.tablas || (ej.estructura ? [{ etiqueta: "", estructura: ej.estructura }] : []);
    tablas.forEach(function (t, k) {
      var bloque = document.createElement("div");
      if (t.etiqueta) {
        var encabezado = document.createElement("h4");
        encabezado.textContent = t.etiqueta;
        zonaTabla.appendChild(encabezado);
      }
      zonaTabla.appendChild(bloque);
      crearTablaOperacion(bloque, {
        estructura: t.estructura,
        idPrefijo: idp + "-tabla" + k,
        resaltarInversos: true,
        mostrarLatino: false
      });
    });
    renderMathEnElemento(zonaTabla);
  }

  selector.addEventListener("change", function () {
    mostrar(Number(selector.value));
  });
  mostrar(0);

  return {
    seleccionar: function (idx) {
      selector.value = String(idx);
      mostrar(idx);
    }
  };
}

/* ---------- Diagrama de relaciones entre estructuras ---------- */

var NS_SVG_EST = "http://www.w3.org/2000/svg";

/**
 * Mapa de cómo se relacionan las estructuras. `resaltar` es una lista de ids:
 * "grupo", "grupo-abeliano", "anillo", "anillo-conmutativo", "dominio", "campo", "ev".
 */
function crearDiagramaEstructuras(contenedor, opciones) {
  opciones = opciones || {};
  var resaltar = opciones.resaltar || [];
  var cajas = [
    { id: "grupo", titulo: "Grupo", sub: "una operación ∗", x: 15, y: 10 },
    { id: "grupo-abeliano", titulo: "Grupo abeliano", sub: "∗ conmutativa (+)", x: 15, y: 90 },
    { id: "anillo", titulo: "Anillo", sub: "+ y ·, distributiva", x: 15, y: 170 },
    { id: "anillo-conmutativo", titulo: "Anillo conmutativo", sub: "· conmutativa", x: 15, y: 250 },
    { id: "dominio", titulo: "Dominio entero", sub: "sin divisores de cero", x: 15, y: 330 },
    { id: "campo", titulo: "Campo", sub: "todo a ≠ 0 tiene inverso", x: 15, y: 410 }
  ];
  var etiquetasFlecha = [
    "+ conmutatividad",
    "+ una 2.ª operación",
    "+ producto conmutativo",
    "+ sin divisores de cero",
    "+ inversos del producto"
  ];
  var ancho = 195;
  var alto = 50;
  var idp = opciones.idPrefijo || "diagrama-est";

  function crear(nombre, atributos) {
    var el = document.createElementNS(NS_SVG_EST, nombre);
    Object.keys(atributos || {}).forEach(function (k) {
      el.setAttribute(k, atributos[k]);
    });
    return el;
  }

  function caja(c) {
    var g = crear("g", {});
    var marcado = resaltar.indexOf(c.id) >= 0;
    g.appendChild(
      crear("rect", {
        x: c.x, y: c.y, width: c.ancho || ancho, height: c.alto || alto, rx: 8,
        class: "diag-caja" + (marcado ? " diag-actual" : "")
      })
    );
    var t1 = crear("text", { x: c.x + 10, y: c.y + 21, class: "diag-titulo" });
    t1.textContent = (marcado ? "★ " : "") + c.titulo;
    g.appendChild(t1);
    var lineas = c.sub.split("\n");
    lineas.forEach(function (linea, idx) {
      var t2 = crear("text", { x: c.x + 10, y: c.y + 38 + idx * 14, class: "diag-sub" });
      t2.textContent = linea;
      g.appendChild(t2);
    });
    return g;
  }

  contenedor.innerHTML = "";
  var svg = crear("svg", {
    viewBox: "0 0 440 470",
    class: "diagrama-estructuras",
    role: "img",
    "aria-label":
      "Mapa de estructuras: un grupo abeliano es un grupo con operación conmutativa. Un anillo añade una segunda operación. Un anillo conmutativo con producto conmutativo y sin divisores de cero es un dominio entero. Un campo es un dominio donde todo elemento no nulo tiene inverso. Un espacio vectorial combina un grupo abeliano de vectores con escalares de un campo."
  });
  var defs = crear("defs", {});
  var marcador = crear("marker", {
    id: idp + "-punta", viewBox: "0 0 10 10", refX: 8, refY: 5,
    markerWidth: 6, markerHeight: 6, orient: "auto"
  });
  marcador.appendChild(crear("path", { d: "M0,0 L10,5 L0,10 z", class: "diag-punta" }));
  defs.appendChild(marcador);
  svg.appendChild(defs);

  for (var i = 0; i < cajas.length - 1; i++) {
    var xc = cajas[i].x + ancho / 2;
    svg.appendChild(
      crear("line", {
        x1: xc, y1: cajas[i].y + alto, x2: xc, y2: cajas[i + 1].y - 2,
        class: "diag-flecha", "marker-end": "url(#" + idp + "-punta)"
      })
    );
    var et = crear("text", { x: xc + 10, y: cajas[i].y + alto + 20, class: "diag-etiqueta" });
    et.textContent = etiquetasFlecha[i];
    svg.appendChild(et);
  }

  var ev = { id: "ev", titulo: "Espacio vectorial", sub: "grupo abeliano de vectores\n+ escalares de un campo", x: 235, y: 190, ancho: 195, alto: 66 };
  svg.appendChild(
    crear("polyline", {
      points: "210,115 222,115 222,223 233,223",
      class: "diag-flecha diag-flecha-ev", fill: "none", "marker-end": "url(#" + idp + "-punta)"
    })
  );
  svg.appendChild(
    crear("polyline", {
      points: "210,435 332,435 332,258",
      class: "diag-flecha diag-flecha-ev", fill: "none", "marker-end": "url(#" + idp + "-punta)"
    })
  );
  var etEscalares = crear("text", { x: 222, y: 428, class: "diag-etiqueta" });
  etEscalares.textContent = "escalares";
  svg.appendChild(etEscalares);

  cajas.forEach(function (c) {
    svg.appendChild(caja(c));
  });
  svg.appendChild(caja(ev));

  contenedor.appendChild(svg);
}
