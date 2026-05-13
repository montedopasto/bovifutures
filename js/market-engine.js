function converterVivoParaCarcaca(precoVivo, rendimento){
    return precoVivo / rendimento;
}

function calcularSpread(precoCarcaca, convertido){
    return precoCarcaca - convertido;
}
function calcularScoreMercado(f){

    // atenção: doenças é negativo
    const score =
        (f.preco * 0.25) +
        (f.oferta * 0.15) +
        (f.procura * 0.20) +
        ((100 - f.doencas) * 0.15) +
        (f.comercio * 0.15) +
        ((100 - f.sustentabilidade) * 0.10);

    return Math.round(score);
}
function interpretarMercado(score){

    if(score >= 70){
        return {
            estado: "Mercado Favorável",
            cor: "green",
            texto: "Boa altura para venda. Procura forte e absorção do mercado positiva."
        }
    }

    if(score >= 50){
        return {
            estado: "Mercado Neutro",
            cor: "orange",
            texto: "Mercado equilibrado. Decisão depende mais da estratégia interna."
        }
    }

    return {
        estado: "Mercado Pressionado",
        cor: "red",
        texto: "Cuidado na venda. Pressão de mercado e menor capacidade de valorização."
    }
}
function gerarLeituraMercado(historico){

    const carcaca = historico
        .filter(d => d.tipo === "carcaca")
        .sort((a,b)=>{

            const numA = parseInt(a.semana.replace("W",""));
            const numB = parseInt(b.semana.replace("W",""));

            return numA - numB;
        });

    if(carcaca.length < 4){

        return "Dados insuficientes para análise de mercado.";
    }

    const ultimos = carcaca.slice(-4);

    const primeiro = ultimos[0].valor;
    const ultimo = ultimos[ultimos.length - 1].valor;

    const diferenca = ultimo - primeiro;

    let tendencia = "";

    if(diferenca > 0.10){

        tendencia = "bullish";

    }else if(diferenca < -0.10){

        tendencia = "bearish";

    }else{

        tendencia = "lateral";
    }

    const pressao = calcularPressaoMercado();

    let texto = "";

    // ==========================
    // TENDÊNCIA
    // ==========================

    if(tendencia === "bullish"){

        texto += `
        O mercado apresenta uma tendência de valorização nas últimas semanas, 
        refletindo uma pressão positiva sobre os preços da carcaça.
        `;

    }else if(tendencia === "bearish"){

        texto += `
        O mercado demonstra alguma pressão descendente, 
        com correção nos preços da carcaça nas últimas semanas.
        `;

    }else{

        texto += `
        O mercado mantém um comportamento relativamente estável, 
        sem movimentos bruscos de valorização ou correção.
        `;
    }

    // ==========================
    // PRESSÃO DE MERCADO
    // ==========================

    if(pressao > 0.05){

        texto += `
        A procura continua superior à oferta disponível, 
        sustentando os preços em níveis elevados.
        `;

    }else if(pressao < -0.05){

        texto += `
        A oferta disponível continua elevada face à procura, 
        limitando subidas mais agressivas.
        `;

    }else{

        texto += `
        O equilíbrio entre procura e oferta continua relativamente controlado.
        `;
    }

    // ==========================
    // CUSTO RAÇÃO
    // ==========================

    if(contexto.custoRacao > 1.05){

        texto += `
        O aumento dos custos de alimentação animal continua a exercer pressão sobre os produtores.
        `;
    }

    return texto;
}
function atualizarSentimentoMercado(historico){

    const carcaca = historico
        .filter(d => d.tipo === "carcaca");

    if(carcaca.length < 4) return;

    // =========================
    // TENDÊNCIA
    // =========================

    const ultimos = carcaca.slice(-4);

    const primeiro = ultimos[0].valor;
    const ultimo = ultimos[ultimos.length - 1].valor;

    const diferenca = ultimo - primeiro;

    // =========================
    // PRESSÃO
    // =========================

    const pressao = calcularPressaoMercado();

    // =========================
    // SCORE
    // =========================

    let score = 50;

    score += diferenca * 25;

    score += pressao * 100;

    // limitar
    score = Math.max(0, Math.min(100, score));

    // =========================
    // RENDER SCORE
    // =========================

    document.getElementById("sentimentoValor").innerText =
        Math.round(score);

    // =========================
    // ESTADO
    // =========================

    const estado = document.getElementById("estadoMercado");

    const label = document.querySelector(".sentiment-label");

    if(score >= 65){

        estado.innerText = "Bullish";
        estado.style.color = "#22c55e";

        label.innerText = "BULLISH";
        label.className = "sentiment-label bullish";

    }
    else if(score <= 40){

        estado.innerText = "Bearish";
        estado.style.color = "#ef4444";

        label.innerText = "BEARISH";
        label.className = "sentiment-label bearish";

    }
    else{

        estado.innerText = "Neutral";
        estado.style.color = "#facc15";

        label.innerText = "NEUTRAL";
        label.className = "sentiment-label";

    }

    // =========================
    // CÍRCULO DINÂMICO
    // =========================

    const graus = (score / 100) * 360;

    document.querySelector(".sentiment-circle").style.background =
        `conic-gradient(
            #22c55e 0deg,
            #22c55e ${graus}deg,
            #111827 ${graus}deg
        )`;
}
function atualizarIndicadoresTecnicos(historico){

    const carcaca = historico
        .filter(d => d.tipo === "carcaca");

    if(carcaca.length < 4) return;

    const ultimos = carcaca.slice(-4);

    const primeiro = ultimos[0].valor;
    const ultimo = ultimos[ultimos.length - 1].valor;

    const diff = ultimo - primeiro;

    // ======================
    // MOMENTUM
    // ======================

    document.getElementById("momentumValor").innerText =
        diff > 0 ? "Bullish" : "Bearish";

    // ======================
    // VOLATILIDADE
    // ======================

    const volatilidade = Math.abs(diff);

    document.getElementById("volatilidadeValor").innerText =
        volatilidade > 0.5 ? "Alta" : "Baixa";

    // ======================
    // RISCO
    // ======================

    document.getElementById("riscoValor").innerText =
        volatilidade > 0.7 ? "Elevado" : "Moderado";

    // ======================
    // PROCURA
    // ======================

    document.getElementById("procuraValor").innerText =
        calcularProcura() > 60 ? "Elevada" : "Fraca";

    // ======================
    // OFERTA
    // ======================

    document.getElementById("ofertaValor").innerText =
        calcularOferta() > 80 ? "Controlada" : "Pressionada";
}
