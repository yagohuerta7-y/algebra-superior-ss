/*
  Actividad 2: matrices 2×2 con entradas enteras. Calcula AB y BA y compara.
*/

function multiplicarMatrices2(a, b) {
  return [
    [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
    [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]
  ];
}

function matrizLatex(m) {
  return "\\begin{pmatrix}" + m[0][0] + " & " + m[0][1] + " \\\\ " + m[1][0] + " & " + m[1][1] + "\\end{pmatrix}";
}

function initActividad2() {
  var celdas = { a: [[], []], b: [[], []] };
  ["a", "b"].forEach(function (nombre) {
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        celdas[nombre][i][j] = document.getElementById("act2-" + nombre + (i + 1) + (j + 1));
      }
    }
  });
  var salida = document.getElementById("act2-resultado");
  var mensaje = document.getElementById("act2-mensaje");

  function leer(nombre) {
    return [0, 1].map(function (i) {
      return [0, 1].map(function (j) {
        var v = parseInt(celdas[nombre][i][j].value, 10);
        return isNaN(v) ? 0 : v;
      });
    });
  }

  function escribir(nombre, m) {
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        celdas[nombre][i][j].value = String(m[i][j]);
      }
    }
  }

  function calcular() {
    var a = leer("a");
    var b = leer("b");
    var ab = multiplicarMatrices2(a, b);
    var ba = multiplicarMatrices2(b, a);
    var iguales = JSON.stringify(ab) === JSON.stringify(ba);
    katexRender(
      "AB = " + matrizLatex(a) + matrizLatex(b) + " = " + matrizLatex(ab) +
        " \\qquad BA = " + matrizLatex(b) + matrizLatex(a) + " = " + matrizLatex(ba),
      salida,
      true
    );
    mensaje.className = "aviso " + (iguales ? "aviso-exito" : "aviso-error");
    mensaje.textContent = iguales
      ? "Aquí AB = BA: estas dos matrices conmutan. Pasa con algunas parejas, pero no con todas."
      : "AB ≠ BA: el orden importa. El producto de matrices no es conmutativo.";
  }

  [celdas.a, celdas.b].forEach(function (m) {
    m.forEach(function (fila) {
      fila.forEach(function (input) {
        input.addEventListener("input", calcular);
      });
    });
  });

  var ejemplos = {
    "act2-clasico": [[[1, 1], [0, 1]], [[1, 0], [1, 1]]],
    "act2-conmutan": [[[2, 1], [1, 2]], [[3, 1], [1, 3]]],
    "act2-identidad": [[[1, 2], [3, 4]], [[1, 0], [0, 1]]],
    "act2-azar": null
  };
  Object.keys(ejemplos).forEach(function (id) {
    document.getElementById(id).addEventListener("click", function () {
      if (ejemplos[id]) {
        escribir("a", ejemplos[id][0]);
        escribir("b", ejemplos[id][1]);
      } else {
        var al = function () {
          return Math.floor(Math.random() * 7) - 3;
        };
        escribir("a", [[al(), al()], [al(), al()]]);
        escribir("b", [[al(), al()], [al(), al()]]);
      }
      calcular();
    });
  });

  escribir("a", ejemplos["act2-clasico"][0]);
  escribir("b", ejemplos["act2-clasico"][1]);
  calcular();
}
