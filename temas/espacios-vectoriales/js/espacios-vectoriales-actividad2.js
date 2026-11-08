/*
  Actividad 2: subespacios. Se toman dos puntos u, v de la recta y = m x + c y se
  comprueba si u + v y k·u siguen en la recta.
*/

function initActividad2() {
  var plano = crearPlanoVec(document.getElementById("act2-plano"), {
    rango: 6,
    idPrefijo: "act2",
    etiqueta: "Plano con una recta y los puntos u, v, u más v y k por u. Una cruz indica que el punto se sale de la recta."
  });
  var rm = document.getElementById("act2-m");
  var rc = document.getElementById("act2-c");
  var rs = document.getElementById("act2-s");
  var rt = document.getElementById("act2-t");
  var rk = document.getElementById("act2-k");
  var textos = {
    m: document.getElementById("act2-m-valor"),
    c: document.getElementById("act2-c-valor"),
    s: document.getElementById("act2-s-valor"),
    t: document.getElementById("act2-t-valor"),
    k: document.getElementById("act2-k-valor")
  };
  var lectura = document.getElementById("act2-lectura");
  var mensaje = document.getElementById("act2-mensaje");

  function enRecta(p, m, c) {
    return Math.abs(p[1] - (m * p[0] + c)) < 1e-9;
  }

  function dibujarPunto(p, m, c, etiqueta, clase) {
    var ok = enRecta(p, m, c);
    plano.punto(p[0], p[1], ok ? clase : "ev-error", ok ? "circulo" : "cruz", etiqueta);
    return ok;
  }

  function actualizar() {
    var m = Number(rm.value), c = Number(rc.value), s = Number(rs.value), t = Number(rt.value), k = Number(rk.value);
    textos.m.textContent = formatoNum(m);
    textos.c.textContent = formatoNum(c);
    textos.s.textContent = formatoNum(s);
    textos.t.textContent = formatoNum(t);
    textos.k.textContent = formatoNum(k);

    var u = [s, m * s + c];
    var v = [t, m * t + c];
    var suma = [u[0] + v[0], u[1] + v[1]];
    var mult = [k * u[0], k * u[1]];
    var origen = [0, 0];

    plano.limpiar();
    plano.recta(m, c, "ev-recta");
    var okOrigen = dibujarPunto(origen, m, c, "0", "ev-gris");
    dibujarPunto(u, m, c, "u", "ev-u");
    dibujarPunto(v, m, c, "v", "ev-v");
    var okSuma = dibujarPunto(suma, m, c, "u+v", "ev-res");
    var okMult = dibujarPunto(mult, m, c, "k·u", "ev-res");

    var marca = function (ok) {
      return ok ? "\\checkmark\\text{ en la recta}" : "\\times\\text{ se sale de la recta}";
    };
    katexRender(
      "\\begin{aligned}" +
        "\\vec 0 &= (0,0): " + marca(okOrigen) + "\\\\" +
        "u + v &= (" + formatoNum(suma[0]) + ", " + formatoNum(suma[1]) + "): " + marca(okSuma) + "\\\\" +
        formatoNum(k) + "\\,u &= (" + formatoNum(mult[0]) + ", " + formatoNum(mult[1]) + "): " + marca(okMult) +
        "\\end{aligned}",
      lectura,
      true
    );

    var subespacio = c === 0;
    mensaje.className = "aviso " + (subespacio ? "aviso-exito" : "aviso-error");
    mensaje.textContent = subespacio
      ? "La recta pasa por el origen: sumar puntos de la recta o multiplicarlos por un escalar nunca la abandona. Es un subespacio."
      : "La recta NO pasa por el origen (c ≠ 0): ni siquiera contiene al vector cero, y sumar o escalar puntos de la recta (con k ≠ 1) la abandona. No es un subespacio.";
  }

  [rm, rc, rs, rt, rk].forEach(function (r) {
    r.addEventListener("input", actualizar);
  });
  document.getElementById("act2-por-origen").addEventListener("click", function () {
    rc.value = "0";
    actualizar();
  });
  document.getElementById("act2-desplazar").addEventListener("click", function () {
    rc.value = "1.5";
    actualizar();
  });
  actualizar();
}
