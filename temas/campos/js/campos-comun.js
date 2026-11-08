/*
  Utilidades del tema "Campos": campos finitos de 4 elementos y verificación
  de los axiomas de campo en dos estructuras finitas (suma y producto).
*/

function mcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    var t = a % b;
    a = b;
    b = t;
  }
  return a;
}

/*
  F_4 = {0, 1, α, α+1} con α² = α + 1 (coeficientes en F_2).
  El elemento c0 + c1·α tiene índice c0 + 2·c1.
*/
function estructuraF4(tipo) {
  var etiquetas = ["0", "1", "\\alpha", "\\alpha+1"];
  var textos = ["0", "1", "α", "α+1"];
  function producto(i, j) {
    var a0 = i & 1, a1 = i >> 1;
    var b0 = j & 1, b1 = j >> 1;
    var c0 = (a0 * b0 + a1 * b1) % 2;
    var c1 = (a0 * b1 + a1 * b0 + a1 * b1) % 2;
    return c0 + 2 * c1;
  }
  return crearEstructura({
    nombre: "\\mathbb{F}_4",
    simbolo: tipo === "+" ? "+" : "\\cdot",
    elementos: etiquetas.map(function (l, k) {
      return { latex: l, texto: textos[k] };
    }),
    op: function (i, j) {
      return tipo === "+" ? i ^ j : producto(i, j);
    }
  });
}

var AXIOMAS_CAMPO = [
  { clave: "suma", nombre: "Suma (grupo abeliano)" },
  { clave: "cerradura", nombre: "Producto cerrado" },
  { clave: "asociatividad", nombre: "Producto asociativo" },
  { clave: "distributividad", nombre: "Distributividad" },
  { clave: "conmutatividad", nombre: "Producto conmutativo" },
  { clave: "unidad", nombre: "Unidad (con 1 distinto de 0)" },
  { clave: "inversos", nombre: "Inverso de todo elemento no nulo" }
];

/* Verifica los axiomas de campo en dos estructuras finitas (suma y producto). */
function analizarCampo(suma, prod) {
  var base = analizarAnillo(suma, prod);
  var porClave = {};
  base.forEach(function (it) {
    porClave[it.clave] = it;
  });
  var cero = analizarEstructura(suma).neutro;
  var aProd = analizarEstructura(prod);
  var uno = aProd.neutro;
  var n = suma.n;
  var items = [];

  ["suma", "cerradura", "asociatividad", "distributividad", "conmutatividad"].forEach(function (clave) {
    var it = porClave[clave];
    items.push({ clave: clave, nombre: nombreEn(AXIOMAS_CAMPO, clave), ok: it.ok, texto: it.texto, opcional: false });
  });

  var tieneUno = uno !== null && uno !== cero;
  items.push({
    clave: "unidad",
    nombre: nombreEn(AXIOMAS_CAMPO, "unidad"),
    opcional: false,
    ok: tieneUno,
    texto: tieneUno
      ? "La unidad es $" + prod.elementos[uno].latex + "$, distinta del neutro de la suma $" + suma.elementos[cero].latex + "$."
      : "No hay un elemento $1$ con $1 \\cdot a = a$ para todo $a$ (y distinto de $0$)."
  });

  var sinInverso = null;
  if (tieneUno) {
    for (var i = 0; i < n && sinInverso === null; i++) {
      if (i === cero) {
        continue;
      }
      var hay = false;
      for (var j = 0; j < n && !hay; j++) {
        if (prod.tabla[i][j] === uno && prod.tabla[j][i] === uno) {
          hay = true;
        }
      }
      if (!hay) {
        sinInverso = i;
      }
    }
  }
  items.push({
    clave: "inversos",
    nombre: nombreEn(AXIOMAS_CAMPO, "inversos"),
    opcional: false,
    ok: tieneUno && sinInverso === null,
    texto: !tieneUno
      ? "Sin unidad, la pregunta no tiene sentido."
      : sinInverso === null
      ? "Todo elemento no nulo tiene inverso: en la tabla del producto, cada fila (salvo la del $0$) contiene el $1$."
      : "$" + prod.elementos[sinInverso].latex + "$ no tiene inverso: ningún $b$ cumple $" + prod.elementos[sinInverso].latex + " \\cdot b = 1$."
  });
  return items;
}
