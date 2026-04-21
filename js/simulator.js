function simular(){

    const animais = Number(document.getElementById("animais").value);
    const peso = Number(document.getElementById("peso").value);
    const rendimento = Number(document.getElementById("rendimento").value) / 100;

    const precoCarcaca = window.marketData.precoCarcacaPT;

    const kgCarcaca = animais * peso * rendimento;

    const receita = kgCarcaca * precoCarcaca;

    document.getElementById("resultado").innerText =
        "Receita estimada: " + receita.toFixed(2) + "€";
}
