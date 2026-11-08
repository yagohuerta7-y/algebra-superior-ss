/*
  Actividad 3: inverso de a + b√2 por racionalización, en Q(√2).
*/

function fraccionLatex(p, q) {
  var g = mcd(p, q) || 1;
  p = p / g;
  q = q / g;
  if (q < 0) {
    p = -p;
    q = -q;
  }
  return q === 1 ? String(p) : (p < 0 ? "-" : "") + "\\frac{" + Math.abs(p) + "}{" + q + "}";
}

function initActividad3() {
  var entradaA = document.getElementById("act3-a");
  var entradaB = document.getElementById("act3-b");
  var salida = document.getElementById("act3-resultado");
  var mensaje = document.getElementById("act3-mensaje");

  function entero(input) {
    var v = parseInt(input.value, 10);
    return isNaN(v) ? 0 : v;
  }

  function signoTermino(b) {
    return b < 0 ? "-" : "+";
  }

  function actualizar() {
    var a = entero(entradaA);
    var b = entero(entradaB);
    var z = a + (b < 0 ? "" : "+") + b + "\\sqrt{2}";
    if (a === 0 && b === 0) {
      katexRender("z = 0", salida, true);
      mensaje.className = "aviso aviso-error";
      mensaje.textContent = "El 0 no tiene inverso, en ningún campo.";
      return;
    }
    var n = a * a - 2 * b * b;
    var parteA = fraccionLatex(a, n);
    var parteB = fraccionLatex(-b, n);
    var tex =
      "\\frac{1}{" + a + signoTermino(b) + Math.abs(b) + "\\sqrt{2}}" +
      " = \\frac{" + a + (b < 0 ? "+" : "-") + Math.abs(b) + "\\sqrt{2}}{(" + a + ")^2 - 2(" + b + ")^2}" +
      " = \\frac{" + a + (b < 0 ? "+" : "-") + Math.abs(b) + "\\sqrt{2}}{" + n + "}" +
      " = " + parteA + (-b / n < 0 ? "" : "+") + parteB + "\\sqrt{2}";
    katexRender(tex, salida, true);
    mensaje.className = "aviso aviso-exito";
    var decimal = 1 / (a + b * Math.SQRT2);
    var aprox = a / n + (-b / n) * Math.SQRT2;
    mensaje.textContent =
      "Comprobación numérica: 1/(" + a + (b < 0 ? " − " : " + ") + Math.abs(b) + "·√2) ≈ " + decimal.toFixed(6) + " y " + parteACadena(a, n) + (-b / n < 0 ? " − " : " + ") + parteACadena(Math.abs(b), Math.abs(n)) + "·√2 ≈ " + aprox.toFixed(6) + ". El denominador " + n + " nunca es 0, porque √2 es irracional.";
  }

  function parteACadena(p, q) {
    var g = mcd(p, q) || 1;
    var pp = p / g;
    var qq = q / g;
    if (qq < 0) {
      pp = -pp;
      qq = -qq;
    }
    return qq === 1 ? String(pp) : pp + "/" + qq;
  }

  entradaA.addEventListener("input", actualizar);
  entradaB.addEventListener("input", actualizar);

  [["act3-ej1", 1, 1], ["act3-ej2", 3, 2], ["act3-ej3", 2, -1]].forEach(function (e) {
    document.getElementById(e[0]).addEventListener("click", function () {
      entradaA.value = String(e[1]);
      entradaB.value = String(e[2]);
      actualizar();
    });
  });

  actualizar();
}
