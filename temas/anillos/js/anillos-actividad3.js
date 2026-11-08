/*
  Actividad 3: checklist de axiomas de anillo con ejemplos y no-ejemplos.
  Los ejemplos finitos se verifican con código (analizarAnillo); los infinitos
  traen contraejemplos con números concretos.
*/

function itemAnillo(clave, ok, texto) {
  return {
    clave: clave,
    nombre: nombreEn(AXIOMAS_ANILLO, clave),
    ok: ok,
    texto: texto,
    opcional: clave === "unidad" || clave === "conmutatividad"
  };
}

function ejemploFinito(id, textoSelector, titulo, n, valores) {
  var suma = estructuraModular(n, valores, "+");
  var prod = estructuraModular(n, valores, "*");
  return {
    id: id,
    textoSelector: textoSelector,
    titulo: titulo,
    evaluar: function () {
      return analizarAnillo(suma, prod);
    },
    tablas: [
      { etiqueta: "Tabla de la suma", estructura: suma },
      { etiqueta: "Tabla del producto", estructura: prod }
    ]
  };
}

function ejemplosAnillos() {
  return [
    {
      id: "z",
      textoSelector: "(ℤ, +, ·): los enteros",
      titulo: "(\\mathbb{Z}, +, \\cdot)",
      evaluar: function () {
        return [
          itemAnillo("suma", true, "$(\\mathbb{Z}, +)$ es un grupo abeliano (tema anterior)."),
          itemAnillo("cerradura", true, "El producto de enteros es entero."),
          itemAnillo("asociatividad", true, "$(ab)c = a(bc)$."),
          itemAnillo("distributividad", true, "$a(b + c) = ab + ac$."),
          itemAnillo("unidad", true, "La unidad es $1$."),
          itemAnillo("conmutatividad", true, "$ab = ba$.")
        ];
      }
    },
    {
      id: "pares",
      textoSelector: "(2ℤ, +, ·): los enteros pares",
      titulo: "(2\\mathbb{Z}, +, \\cdot)",
      evaluar: function () {
        return [
          itemAnillo("suma", true, "La suma de pares es par, $0$ es par y el opuesto de un par es par."),
          itemAnillo("cerradura", true, "Par por par es par (de hecho múltiplo de $4$)."),
          itemAnillo("asociatividad", true, "Se hereda de $\\mathbb{Z}$."),
          itemAnillo("distributividad", true, "Se hereda de $\\mathbb{Z}$."),
          itemAnillo("unidad", false, "Si $u$ cumpliera $u \\cdot 2 = 2$, tendría que ser $u = 1$, que no es par. Es un anillo sin unidad."),
          itemAnillo("conmutatividad", true, "$ab = ba$.")
        ];
      }
    },
    {
      id: "naturales",
      textoSelector: "(ℕ, +, ·): los naturales",
      titulo: "(\\mathbb{N}, +, \\cdot), \\quad \\mathbb{N} = \\{0, 1, 2, \\dots\\}",
      evaluar: function () {
        return [
          itemAnillo("suma", false, "$(\\mathbb{N}, +)$ no es un grupo: $1$ no tiene opuesto, porque $1 + b = 0$ obligaría a $b = -1$."),
          itemAnillo("cerradura", true, "El producto de naturales es natural."),
          itemAnillo("asociatividad", true, "$(ab)c = a(bc)$."),
          itemAnillo("distributividad", true, "$a(b+c) = ab + ac$."),
          itemAnillo("unidad", true, "La unidad es $1$."),
          itemAnillo("conmutatividad", true, "$ab = ba$.")
        ];
      }
    },
    {
      id: "matrices",
      textoSelector: "M₂(ℝ): matrices 2×2 con suma y producto",
      titulo: "(M_2(\\mathbb{R}), +, \\cdot)",
      evaluar: function () {
        var ab = multiplicarMatrices2([[1, 1], [0, 1]], [[1, 0], [1, 1]]);
        var ba = multiplicarMatrices2([[1, 0], [1, 1]], [[1, 1], [0, 1]]);
        return [
          itemAnillo("suma", true, "La suma entrada por entrada es un grupo abeliano; el neutro es la matriz cero."),
          itemAnillo("cerradura", true, "El producto de dos matrices $2\\times 2$ es $2 \\times 2$."),
          itemAnillo("asociatividad", true, "El producto de matrices es asociativo."),
          itemAnillo("distributividad", true, "$A(B + C) = AB + AC$ y $(A + B)C = AC + BC$."),
          itemAnillo("unidad", true, "La unidad es la matriz identidad $I$."),
          itemAnillo("conmutatividad", false, "Con $A = \\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ y $B = \\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$: $AB = " + matrizLatex(ab) + "$ pero $BA = " + matrizLatex(ba) + "$.")
        ];
      }
    },
    {
      id: "suma-como-producto",
      textoSelector: "(ℤ, +, ∗) con a ∗ b = a + b",
      titulo: "(\\mathbb{Z}, +, \\ast), \\quad a \\ast b = a + b",
      evaluar: function () {
        var izq = 1 + (2 + 3);
        var der = (1 + 2) + (1 + 3);
        return [
          itemAnillo("suma", true, "La suma usual de enteros es un grupo abeliano."),
          itemAnillo("cerradura", true, "$a + b$ es entero."),
          itemAnillo("asociatividad", true, "$(a \\ast b) \\ast c = a + b + c = a \\ast (b \\ast c)$."),
          itemAnillo("distributividad", false, "$1 \\ast (2 + 3) = " + izq + "$, pero $(1 \\ast 2) + (1 \\ast 3) = " + der + "$. La «multiplicación» no se distribuye sobre la suma."),
          itemAnillo("unidad", true, "El «uno» sería el $0$: $0 \\ast a = a$."),
          itemAnillo("conmutatividad", true, "$a + b = b + a$.")
        ];
      }
    },
    {
      id: "producto-cruz",
      textoSelector: "(ℝ³, +, ×): producto vectorial",
      titulo: "(\\mathbb{R}^3, +, \\times)",
      evaluar: function () {
        return [
          itemAnillo("suma", true, "La suma de vectores es un grupo abeliano."),
          itemAnillo("cerradura", true, "El producto vectorial de dos vectores es un vector."),
          itemAnillo("asociatividad", false, "Con $\\mathbf{i} = (1,0,0)$ y $\\mathbf{j} = (0,1,0)$: $(\\mathbf{i}\\times\\mathbf{i})\\times\\mathbf{j} = \\mathbf{0}$, pero $\\mathbf{i}\\times(\\mathbf{i}\\times\\mathbf{j}) = \\mathbf{i}\\times\\mathbf{k} = -\\mathbf{j}$."),
          itemAnillo("distributividad", true, "$\\mathbf{a}\\times(\\mathbf{b}+\\mathbf{c}) = \\mathbf{a}\\times\\mathbf{b} + \\mathbf{a}\\times\\mathbf{c}$."),
          itemAnillo("unidad", false, "No hay vector $\\mathbf{u}$ con $\\mathbf{u}\\times\\mathbf{a} = \\mathbf{a}$ para todo $\\mathbf{a}$: el producto vectorial siempre es perpendicular a $\\mathbf{a}$."),
          itemAnillo("conmutatividad", false, "$\\mathbf{a}\\times\\mathbf{b} = -\\,\\mathbf{b}\\times\\mathbf{a}$.")
        ];
      }
    },
    ejemploFinito("z4", "ℤ₄ (reloj de 4)", "(\\mathbb{Z}_4, +, \\cdot)", 4, [0, 1, 2, 3]),
    ejemploFinito("z5", "ℤ₅ (reloj de 5)", "(\\mathbb{Z}_5, +, \\cdot)", 5, [0, 1, 2, 3, 4]),
    ejemploFinito("z6", "ℤ₆ (reloj de 6)", "(\\mathbb{Z}_6, +, \\cdot)", 6, [0, 1, 2, 3, 4, 5]),
    ejemploFinito("pares8", "{0, 2, 4, 6} ⊂ ℤ₈: pares módulo 8", "(\\{0,2,4,6\\} \\subset \\mathbb{Z}_8, +, \\cdot)", 8, [0, 2, 4, 6]),
    ejemploFinito("sin0", "{1, 2, 3, 4, 5} ⊂ ℤ₆ (sin el 0)", "(\\{1,2,3,4,5\\} \\subset \\mathbb{Z}_6, +, \\cdot)", 6, [1, 2, 3, 4, 5])
  ];
}

function initActividad3() {
  crearChecklistAxiomas(document.getElementById("act3-checklist"), {
    idPrefijo: "act3",
    sustantivo: "anillo",
    ejemplos: ejemplosAnillos(),
    resumen: function (items, fallas) {
      if (fallas.length > 0) {
        return "No es un anillo: falla " + fallas.join(", ") + ".";
      }
      var unidad = items.filter(function (i) { return i.clave === "unidad"; })[0].ok;
      var conm = items.filter(function (i) { return i.clave === "conmutatividad"; })[0].ok;
      return "Sí es un anillo, " + (unidad ? "con unidad" : "sin unidad") + " y " + (conm ? "conmutativo." : "no conmutativo.");
    }
  });
}
