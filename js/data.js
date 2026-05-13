let historico = [];
async function carregarDados(){

    const response = await fetch("https://script.google.com/macros/s/AKfycbwkvrOOnYAmesi1UXpUuc4D_osgPZzdYgF4WD6T6uISGj-BZUsINYv6uwfbD4tbhz5klA/exec");

    const historico = await response.json();

    localStorage.setItem("precos", JSON.stringify(historico));

    carregarGrafico();
    atualizarKPIs();
    renderPrevisao();
}
async function guardarPreco(){

    const semana = document.getElementById("semana").value;
    const tipo = document.getElementById("tipoPreco").value;
    const valor = parseFloat(document.getElementById("valorPreco").value);

    if(!semana || !valor){
        alert("Preenche todos os campos");
        return;
    }

    const dados = {
        semana,
        tipo,
        valor
    };

    await fetch("https://script.google.com/macros/s/AKfycbwkvrOOnYAmesi1UXpUuc4D_osgPZzdYgF4WD6T6uISGj-BZUsINYv6uwfbD4tbhz5klA/exec", {
        method: "POST",
        body: JSON.stringify(dados)
    });

    alert("Preço guardado com sucesso!");

    carregarDados();
}
