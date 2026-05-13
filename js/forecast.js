function calcularPrevisao(){

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    const carcaca = historico
        .filter(d => d.tipo === "carcaca")
        .sort((a,b) => a.semana.localeCompare(b.semana));

    if(carcaca.length < 4) return [];

    const ultimos = carcaca.slice(-4);

    let variacoes = [];

    for(let i=1;i<ultimos.length;i++){
        variacoes.push(ultimos[i].valor - ultimos[i-1].valor);
    }

    const tendencia = variacoes.reduce((a,b)=>a+b,0) / variacoes.length;

    const pressao = calcularPressaoMercado();
    const choque = (contexto.geopolitica - 1) * 0.5;

    let valor = ultimos[ultimos.length - 1].valor;

    let previsao = [];

    for(let i=1;i<=4;i++){

        const precoJusto = 7.8;
        const regressao = (precoJusto - valor) * 0.3;

        valor +=
            (tendencia * 0.4) +
            (pressao * 0.3) +
            choque +
            regressao;

        previsao.push(valor);
    }

 return previsao;
}
