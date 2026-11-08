/*
  Actividad 1: buscador de inverso en Z_n. Muestra a·b mod n para todo b y
  marca cuándo sale 1.
*/

function initActividad1() {
  var campoN = document.getElementById("act1-n");
  var rangoA = document.getElementById("act1-a");
  var valorA = document.getElementById("act1-a-valor");
  var franja = document.getElementById("act1-franja");
  var mensaje = document.getElementById("act1-mensaje");
  var resumen = document.getElementById("act1-resumen");

  function leerN() {
    var n = parseInt(campoN.value, 10);
    if (isNaN(n)) {
      n = 7;
    }
    return Math.max(2, Math.min(30, n));
  }

  function actualizar() {
    var n = leerN();
    rangoA.max = String(n - 1);
    var a = Math.min(Number(rangoA.value), n - 1);
    rangoA.value = String(a);
    valorA.textContent = String(a);

    var tabla = document.createElement("table");
    tabla.setAttribute("aria-label", "Productos de " + a + " por cada elemento de Z" + n + ", módulo " + n);
    var filaB = document.createElement("tr");
    var filaR = document.createElement("tr");
    var encB = document.createElement("th");
    encB.textContent = "b";
    var encR = document.createElement("th");
    encR.textContent = a + "·b";
    filaB.appendChild(encB);
    filaR.appendChild(encR);
    var inverso = -1;
    for (var b = 0; b < n; b++) {
      var th = document.createElement("th");
      th.textContent = String(b);
      filaB.appendChild(th);
      var r = (a * b) % n;
      var td = document.createElement("td");
      td.textContent = String(r);
      if (r === 1 % n && n > 1) {
        td.className = "es-uno";
        inverso = b;
      }
      filaR.appendChild(td);
    }
    tabla.appendChild(filaB);
    tabla.appendChild(filaR);
    franja.innerHTML = "";
    franja.appendChild(tabla);

    var g = mcd(a, n);
    var texto;
    if (inverso >= 0) {
      texto = "$" + a + "^{-1} = " + inverso + "$ en $\\mathbb{Z}_{" + n + "}$, porque $" + a + " \\cdot " + inverso + " \\equiv 1$. Además $\\gcd(" + a + ", " + n + ") = 1$.";
      mensaje.className = "aviso aviso-exito";
    } else {
      texto = "$" + a + "$ no tiene inverso en $\\mathbb{Z}_{" + n + "}$: nunca sale $1$. Y es que $\\gcd(" + a + ", " + n + ") = " + g + " \\neq 1$.";
      mensaje.className = "aviso aviso-error";
    }
    escribirConMath(mensaje, texto);

    var sin = [];
    for (var x = 1; x < n; x++) {
      if (mcd(x, n) !== 1) {
        sin.push(x);
      }
    }
    var esPrimo = true;
    for (var d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        esPrimo = false;
      }
    }
    escribirConMath(
      resumen,
      esPrimo
        ? "$n = " + n + "$ es primo: todo elemento no nulo tiene inverso, así que $\\mathbb{Z}_{" + n + "}$ es un campo."
        : "$n = " + n + "$ no es primo. Elementos no nulos sin inverso: " + sin.join(", ") + ". Por eso $\\mathbb{Z}_{" + n + "}$ no es un campo."
    );
  }

  campoN.addEventListener("input", actualizar);
  rangoA.addEventListener("input", actualizar);
  actualizar();
}
