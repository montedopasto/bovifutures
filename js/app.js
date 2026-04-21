async function carregarDados(){

    const res = await fetch("data/market-data.json");
    const data = await res.json();

    window.marketData = data;
const precoCarcaca = data.mercadoCarcaca.preco;
const rendimento = data.rendimento;

// calcular equivalente vivo (invertido)
const precoVivoEstimado = precoCarcaca * rendimento;

// converter novamente para validar lógica
const convertido = converterVivoParaCarcaca(
    precoVivoEstimado,
    rendimento
);

// spread (diferença teórica)
const spread = precoCarcaca - convertido;
    );

    document.getElementById("precoCarcacaPT").innerText =
    precoCarcaca.toFixed(2) + " €/kg";

document.getElementById("precoVivoPT").innerText =
    precoVivoEstimado.toFixed(2) + " €/kg (estimado)";

document.getElementById("convertido").innerText =
    convertido.toFixed(2) + " €/kg";

document.getElementById("spread").innerText =
    spread.toFixed(2) + " €/kg";
}

carregarDados();
