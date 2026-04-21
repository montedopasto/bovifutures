async function carregarDados(){

    const res = await fetch("data/market-data.json");
    const data = await res.json();

    window.marketData = data;
const score = calcularScoreMercado(data.fatores);
const leitura = interpretarMercado(score);

document.getElementById("estadoMercado").innerText = leitura.estado;
document.getElementById("scoreMercado").innerText = "Score: " + score;

document.getElementById("textoMercado").innerText = leitura.texto;
    const convertido = converterVivoParaCarcaca(
        data.precoVivoPT,
        data.rendimento
    );

    const spread = calcularSpread(
        data.precoCarcacaPT,
        convertido
    );

    document.getElementById("precoVivoPT").innerText =
        data.precoVivoPT + " €/kg";

    document.getElementById("precoCarcacaPT").innerText =
        data.precoCarcacaPT + " €/kg";

    document.getElementById("convertido").innerText =
        convertido.toFixed(2) + " €/kg";

    document.getElementById("spread").innerText =
        spread.toFixed(2) + " €/kg";
}

carregarDados();
