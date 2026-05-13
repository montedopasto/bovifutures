let historico = [];
async function carregarDados(){

    const response = await fetch("https://script.google.com/macros/s/AKfycbwkvrOOnYAmesi1UXpUuc4D_osgPZzdYgF4WD6T6uISGj-BZUsINYv6uwfbD4tbhz5klA/exec");

    const historico = await response.json();

    localStorage.setItem("precos", JSON.stringify(historico));

    carregarGrafico();
    atualizarKPIs();
    renderPrevisao();
}
