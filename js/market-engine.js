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
