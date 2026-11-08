/*
  Actividad 2: campos finitos pequeños F_2, F_3, F_4, F_5 con sus tablas.
*/

function initActividad2() {
  var selector = document.getElementById("act2-campo");
  var contSuma = document.getElementById("act2-suma");
  var contProd = document.getElementById("act2-prod");
  var contInversos = document.getElementById("act2-inversos");
  var contNota = document.getElementById("act2-nota");

  var campos = {
    f2: { n: 2, notas: "En $\\mathbb{F}_2$ la suma es el XOR y el producto es el AND de los bits. Fíjate: $1 + 1 = 0$." },
    f3: { n: 3, notas: "$\\mathbb{F}_3 = \\mathbb{Z}_3$. Aquí $2 + 1 = 0$, así que $-1 = 2$." },
    f4: { n: 4, notas: "$\\mathbb{F}_4$ no es $\\mathbb{Z}_4$. Sus elementos son $0, 1, \\alpha, \\alpha + 1$ con $1 + 1 = 0$ y $\\alpha^2 = \\alpha + 1$. Se construye igual que $\\mathbb{C}$ a partir de $\\mathbb{R}$ con $i^2 = -1$." },
    f5: { n: 5, notas: "$\\mathbb{F}_5 = \\mathbb{Z}_5$." }
  };

  function estructurasDe(clave) {
    var c = campos[clave];
    if (clave === "f4") {
      return { suma: estructuraF4("+"), prod: estructuraF4("*") };
    }
    var valores = [];
    for (var k = 0; k < c.n; k++) {
      valores.push(k);
    }
    return { suma: estructuraModular(c.n, valores, "+"), prod: estructuraModular(c.n, valores, "*") };
  }

  function dibujar() {
    var clave = selector.value;
    var par = estructurasDe(clave);
    crearTablaOperacion(contSuma, { estructura: par.suma, idPrefijo: "act2-suma-t", mostrarLatino: false, resaltarInversos: true });
    var tp = crearTablaOperacion(contProd, { estructura: par.prod, idPrefijo: "act2-prod-t", mostrarLatino: false, resaltarInversos: true });
    var inv = tp.analisis.inversos;
    var partes = [];
    for (var i = 0; i < par.prod.n; i++) {
      if (i === 0) {
        continue;
      }
      partes.push("$(" + par.prod.elementos[i].latex + ")^{-1} = " + par.prod.elementos[inv[i]].latex + "$");
    }
    escribirConMath(contInversos, "Inversos para el producto: " + partes.join(", ") + ". El $0$ es el único sin inverso.");
    escribirConMath(contNota, campos[clave].notas);
  }

  selector.addEventListener("change", dibujar);
  dibujar();
}
