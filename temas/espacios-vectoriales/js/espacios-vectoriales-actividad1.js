/*
  Actividad 1: combinaciones lineales a·u + b·v en R². Las puntas de u y v se arrastran.
*/

function initActividad1() {
  var plano = crearPlanoVec(document.getElementById("act1-plano"), {
    rango: 6,
    idPrefijo: "act1",
    etiqueta: "Plano con los vectores u, v y la combinación a u más b v. Se pueden mover las puntas de u y de v."
  });
  var rangoA = document.getElementById("act1-a");
  var rangoB = document.getElementById("act1-b");
  var textoA = document.getElementById("act1-a-valor");
  var textoB = document.getElementById("act1-b-valor");
  var lectura = document.getElementById("act1-lectura");

  function redibujar() {
    var u = manU.obtener();
    var v = manV.obtener();
    var a = Number(rangoA.value);
    var b = Number(rangoB.value);
    textoA.textContent = formatoNum(a);
    textoB.textContent = formatoNum(b);
    var au = [a * u[0], a * u[1]];
    var bv = [b * v[0], b * v[1]];
    var s = [au[0] + bv[0], au[1] + bv[1]];

    plano.limpiar();
    plano.segmento(au[0], au[1], s[0], s[1], "ev-guia");
    plano.segmento(bv[0], bv[1], s[0], s[1], "ev-guia");
    plano.flecha(0, 0, au[0], au[1], "ev-u ev-punteada", "a·u");
    plano.flecha(0, 0, bv[0], bv[1], "ev-v ev-punteada", "b·v");
    plano.flecha(0, 0, u[0], u[1], "ev-u");
    plano.flecha(0, 0, v[0], v[1], "ev-v");
    plano.flecha(0, 0, s[0], s[1], "ev-res", "a·u + b·v");

    katexRender(
      "u = (" + formatoNum(u[0]) + ", " + formatoNum(u[1]) + "),\\quad v = (" + formatoNum(v[0]) + ", " + formatoNum(v[1]) + ")" +
        "\\qquad " + formatoNum(a) + "\\,u + " + formatoNum(b) + "\\,v = (" + formatoNum(s[0]) + ", " + formatoNum(s[1]) + ")",
      lectura,
      true
    );
  }

  var manU = plano.puntoArrastrable({ x: 2, y: 1, clase: "ev-u", nombre: "u", paso: 0.5, onCambio: redibujar });
  var manV = plano.puntoArrastrable({ x: -1, y: 2, clase: "ev-v", nombre: "v", paso: 0.5, onCambio: redibujar });

  rangoA.addEventListener("input", redibujar);
  rangoB.addEventListener("input", redibujar);

  function preset(id, a, b) {
    document.getElementById(id).addEventListener("click", function () {
      rangoA.value = String(a);
      rangoB.value = String(b);
      redibujar();
    });
  }
  preset("act1-suma", 1, 1);
  preset("act1-doble", 2, 0);
  preset("act1-opuesto", 0, -1);
  preset("act1-resta", 1, -1);

  redibujar();
}
