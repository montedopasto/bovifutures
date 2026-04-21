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
