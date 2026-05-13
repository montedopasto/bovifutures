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
