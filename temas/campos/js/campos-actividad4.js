/*
  Actividad 4: checklist de axiomas de campo.
*/

function itemCampo(clave, ok, texto) {
  return { clave: clave, nombre: nombreEn(AXIOMAS_CAMPO, clave), ok: ok, texto: texto, opcional: false };
}

function ejemploCampoFinito(id, textoSelector, titulo, suma, prod) {
  return {
    id: id,
    textoSelector: textoSelector,
    titulo: titulo,
    evaluar: function () {
      return analizarCampo(suma, prod);
    },
    tablas: [
      { etiqueta: "Tabla de la suma", estructura: suma },
      { etiqueta: "Tabla del producto", estructura: prod }
    ]
  };
}

function ejemplosCampos() {
  var lista = [
    {
      id: "q",
      textoSelector: "ℚ: los racionales",
      titulo: "(\\mathbb{Q}, +, \\cdot)",
      evaluar: function () {
        return [
          itemCampo("suma", true, "$(\\mathbb{Q}, +)$ es un grupo abeliano."),
          itemCampo("cerradura", true, "El producto de dos fracciones es una fracción."),
          itemCampo("asociatividad", true, "Se hereda de los números reales."),
          itemCampo("distributividad", true, "Se hereda de los números reales."),
          itemCampo("conmutatividad", true, "$ab = ba$."),
          itemCampo("unidad", true, "La unidad es $1 \\neq 0$."),
          itemCampo("inversos", true, "El inverso de $\\tfrac{p}{q}$ (con $p \\neq 0$) es $\\tfrac{q}{p}$, también racional.")
        ];
      }
    },
    {
      id: "z",
      textoSelector: "ℤ: los enteros",
      titulo: "(\\mathbb{Z}, +, \\cdot)",
      evaluar: function () {
        return [
          itemCampo("suma", true, "$(\\mathbb{Z}, +)$ es un grupo abeliano."),
          itemCampo("cerradura", true, "El producto de enteros es entero."),
          itemCampo("asociatividad", true, "$(ab)c = a(bc)$."),
          itemCampo("distributividad", true, "$a(b+c) = ab + ac$."),
          itemCampo("conmutatividad", true, "$ab = ba$."),
          itemCampo("unidad", true, "La unidad es $1 \\neq 0$."),
          itemCampo("inversos", false, "$2$ no tiene inverso en $\\mathbb{Z}$: $2b = 1$ obliga $b = \\tfrac{1}{2}$, que no es entero. A $\\mathbb{Z}$ le faltan las fracciones.")
        ];
      }
    },
    {
      id: "zi",
      textoSelector: "ℤ[i]: enteros de Gauss",
      titulo: "(\\mathbb{Z}[i], +, \\cdot)",
      evaluar: function () {
        return [
          itemCampo("suma", true, "La suma de enteros de Gauss es un grupo abeliano."),
          itemCampo("cerradura", true, "$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ tiene coeficientes enteros."),
          itemCampo("asociatividad", true, "Se hereda de $\\mathbb{C}$."),
          itemCampo("distributividad", true, "Se hereda de $\\mathbb{C}$."),
          itemCampo("conmutatividad", true, "$zw = wz$."),
          itemCampo("unidad", true, "La unidad es $1 \\neq 0$."),
          itemCampo("inversos", false, "$1/(1+i) = \\tfrac{1}{2} - \\tfrac{1}{2}i$ no tiene coeficientes enteros, así que $1 + i$ no tiene inverso en $\\mathbb{Z}[i]$.")
        ];
      }
    },
    {
      id: "q-raiz2",
      textoSelector: "ℚ(√2) = {a + b√2}",
      titulo: "\\mathbb{Q}(\\sqrt{2}) = \\{a + b\\sqrt{2} : a, b \\in \\mathbb{Q}\\}",
      evaluar: function () {
        return [
          itemCampo("suma", true, "$(a + b\\sqrt{2}) + (c + d\\sqrt{2}) = (a + c) + (b + d)\\sqrt{2}$, un grupo abeliano."),
          itemCampo("cerradura", true, "$(a + b\\sqrt{2})(c + d\\sqrt{2}) = (ac + 2bd) + (ad + bc)\\sqrt{2}$, de la misma forma."),
          itemCampo("asociatividad", true, "Se hereda de $\\mathbb{R}$."),
          itemCampo("distributividad", true, "Se hereda de $\\mathbb{R}$."),
          itemCampo("conmutatividad", true, "Se hereda de $\\mathbb{R}$."),
          itemCampo("unidad", true, "La unidad es $1 = 1 + 0\\sqrt{2}$."),
          itemCampo("inversos", true, "$\\dfrac{1}{a + b\\sqrt{2}} = \\dfrac{a - b\\sqrt{2}}{a^2 - 2b^2}$, que otra vez es de la forma $c + d\\sqrt{2}$ con $c, d$ racionales (Actividad 3).")
        ];
      }
    },
    {
      id: "matrices",
      textoSelector: "M₂(ℝ): matrices 2×2",
      titulo: "(M_2(\\mathbb{R}), +, \\cdot)",
      evaluar: function () {
        var ab = multiplicarMatrices2Campos([[1, 1], [0, 1]], [[1, 0], [1, 1]]);
        var ba = multiplicarMatrices2Campos([[1, 0], [1, 1]], [[1, 1], [0, 1]]);
        return [
          itemCampo("suma", true, "La suma entrada por entrada es un grupo abeliano."),
          itemCampo("cerradura", true, "El producto de matrices $2 \\times 2$ es $2\\times 2$."),
          itemCampo("asociatividad", true, "El producto de matrices es asociativo."),
          itemCampo("distributividad", true, "Se cumple por ambos lados."),
          itemCampo("conmutatividad", false, "$AB = " + matrizLatexCampos(ab) + "$ pero $BA = " + matrizLatexCampos(ba) + "$ para $A = \\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ y $B = \\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$."),
          itemCampo("unidad", true, "La unidad es la identidad $I$."),
          itemCampo("inversos", false, "$\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$ no es la matriz cero, pero tampoco tiene inversa (su determinante es $0$).")
        ];
      }
    }
  ];
  lista.push(ejemploCampoFinito("f2", "𝔽₂: bits con XOR y AND", "(\\mathbb{F}_2, +, \\cdot)", estructuraModular(2, [0, 1], "+"), estructuraModular(2, [0, 1], "*")));
  lista.push(ejemploCampoFinito("z5", "ℤ₅", "(\\mathbb{Z}_5, +, \\cdot)", estructuraModular(5, [0, 1, 2, 3, 4], "+"), estructuraModular(5, [0, 1, 2, 3, 4], "*")));
  lista.push(ejemploCampoFinito("z7", "ℤ₇", "(\\mathbb{Z}_7, +, \\cdot)", estructuraModular(7, [0, 1, 2, 3, 4, 5, 6], "+"), estructuraModular(7, [0, 1, 2, 3, 4, 5, 6], "*")));
  lista.push(ejemploCampoFinito("z4", "ℤ₄ (cuatro elementos, ¿campo?)", "(\\mathbb{Z}_4, +, \\cdot)", estructuraModular(4, [0, 1, 2, 3], "+"), estructuraModular(4, [0, 1, 2, 3], "*")));
  lista.push(ejemploCampoFinito("f4", "𝔽₄ (cuatro elementos, ¿campo?)", "(\\mathbb{F}_4, +, \\cdot)", estructuraF4("+"), estructuraF4("*")));
  lista.push(ejemploCampoFinito("z6", "ℤ₆", "(\\mathbb{Z}_6, +, \\cdot)", estructuraModular(6, [0, 1, 2, 3, 4, 5], "+"), estructuraModular(6, [0, 1, 2, 3, 4, 5], "*")));
  lista.push(ejemploCampoFinito("z9", "ℤ₉", "(\\mathbb{Z}_9, +, \\cdot)", estructuraModular(9, [0, 1, 2, 3, 4, 5, 6, 7, 8], "+"), estructuraModular(9, [0, 1, 2, 3, 4, 5, 6, 7, 8], "*")));
  return lista;
}

function multiplicarMatrices2Campos(a, b) {
  return [
    [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
    [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]
  ];
}

function matrizLatexCampos(m) {
  return "\\begin{pmatrix}" + m[0][0] + " & " + m[0][1] + " \\\\ " + m[1][0] + " & " + m[1][1] + "\\end{pmatrix}";
}

function initActividad4() {
  crearChecklistAxiomas(document.getElementById("act4-checklist"), {
    idPrefijo: "act4",
    sustantivo: "campo",
    ejemplos: ejemplosCampos(),
    resumen: function (items, fallas) {
      return fallas.length === 0
        ? "Sí es un campo."
        : "No es un campo: falla " + fallas.join(", ") + ".";
    }
  });
}
