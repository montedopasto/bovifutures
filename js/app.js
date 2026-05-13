const contexto = {
    // PROCURA
    consumoBase: 100,
    sazonalidade: 1.05,
    rendimento: 0.58,

    // OFERTA
    producao: 1.00,
    custoRacao: 1.10,
    abates: 1.00,

    // CHOQUES
    doencas: 0.90,
    geopolitica: 0.95,
    exportacoes: 1.05
};
function calcularProcura(){

    // começamos com base neutra
    let procura = contexto.consumoBase;

    // aplicar sazonalidade (ex: verão ↑)
    procura *= contexto.sazonalidade;

    // aplicar rendimento (poder de compra)
    procura *= contexto.rendimento;

    // aplicar exportações (procura externa)
    procura *= contexto.exportacoes;

    return procura;
}
function calcularOferta(){

    // base neutra
    let oferta = 100;

    // produção global
    oferta *= contexto.producao;

    // ritmo de abates (mais abates = mais oferta)
    oferta *= contexto.abates;

    // custo da ração (quanto mais caro, menos oferta real)
    oferta *= (2 - contexto.custoRacao);

    // impacto de doenças (reduz oferta)
    oferta *= contexto.doencas;

    return oferta;
}
function calcularPressaoMercado(){

    const procura = calcularProcura();
    const oferta = calcularOferta();

    // diferença relativa
    const diferenca = procura - oferta;

    // normalizar (escala suave)
    const pressao = diferenca / 100;

    return pressao;
}
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
function carregarGrafico(){

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    // ordenar por semana
    historico.sort((a,b) => a.semana.localeCompare(b.semana));

    // semanas reais (histórico)
const baseLabels = [...new Set(historico.map(d => d.semana))];

// semanas futuras
const previsaoLabels = ["W+1","W+2","W+3","W+4"];

// eixo completo
const labels = baseLabels.concat(previsaoLabels);

    const carcacaData = baseLabels.map(semana => {
        const reg = historico.find(d => d.semana === semana && d.tipo === "carcaca");
        return reg ? reg.valor : null;
    });

    const vivoData = baseLabels.map(semana => {
        const reg = historico.find(d => d.semana === semana && d.tipo === "vivo");
        return reg ? reg.valor : null;
    });

    const ctx = document.getElementById("graficoPrecos");

    if(!ctx) return;

    const previsaoValores = calcularPrevisao();
const previsaoVivo = previsaoValores.map(v => v * contexto.rendimento);

window.chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [

            {
                label: "Carcaça €/kg",
                data: carcacaData.concat([null,null,null,null]),
                borderColor: "#00ff88",
                tension: 0.4,
                fill: true
            },

            {
                label: "Vivo €/kg",
                data: vivoData.concat([null,null,null,null]),
                borderColor: "#3b82f6",
                tension: 0.4,
                fill: true
            },

            {
                label: "Previsão €/kg",
                data: new Array(baseLabels.length).fill(null).concat(previsaoValores),
                borderColor: "#facc15",
                borderDash: [6,6]
            },

            {
                label: "Previsão Vivo €/kg",
                data: new Array(baseLabels.length).fill(null).concat(previsaoVivo),
                borderColor: "#60a5fa",
                borderDash: [4,4]
            }

        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});
}
window.onload = function(){
    carregarGrafico();
    atualizarKPIs();
    renderPrevisao();
    atualizarHeaderTempo();

    setInterval(atualizarHeaderTempo, 1000);
};
function atualizarKPIs(){

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    if(historico.length < 2) return;

    // ordenar por semana
    historico.sort((a,b) => a.semana.localeCompare(b.semana));

    const carcaca = historico.filter(d => d.tipo === "carcaca");
    const vivo = historico.filter(d => d.tipo === "vivo");

    function calcularVariacao(lista){

        if(lista.length < 2) return null;

        const atual = lista[lista.length - 1].valor;
        const anterior = lista[lista.length - 2].valor;

        const diff = atual - anterior;
        const perc = (diff / anterior) * 100;

        return {
            atual,
            diff,
            perc
        };
    }

    const varCarcaca = calcularVariacao(carcaca);
    const varVivo = calcularVariacao(vivo);

    function formatar(valor){

        const seta = valor.diff > 0 ? "↑" : valor.diff < 0 ? "↓" : "→";
        const cor = valor.diff > 0 ? "#00ff88" : valor.diff < 0 ? "#ff4d4d" : "#aaa";

        return `
            <div>
                <div style="font-size:22px;">${valor.atual.toFixed(2)} €/kg</div>
                <div style="font-size:13px;color:${cor};">
                    ${valor.diff > 0 ? "+" : ""}${valor.diff.toFixed(2)} €
                    (${valor.perc.toFixed(1)}%) ${seta}
                </div>
            </div>
        `;
    }

    if(varCarcaca){
        document.getElementById("precoCarcacaPT").innerHTML = formatar(varCarcaca);
    }

    if(varVivo){
        document.getElementById("precoVivoPT").innerHTML = formatar(varVivo);
    }

}
function renderPrevisao(){

    const previsao = calcularPrevisao();

    if(previsao.length === 0){
        document.getElementById("previsaoFutura").innerText = "Dados insuficientes";
        return;
    }

    let html = "";

    previsao.forEach((valor, i)=>{

        const vivo = valor * contexto.rendimento;

        html += `
            <div>
                W+${i+1} → 
                <b>${valor.toFixed(2)} €/kg</b>
                <span style="color:#888;"> | Vivo: ${vivo.toFixed(2)} €/kg</span>
            </div>
        `;
    });

    document.getElementById("previsaoFutura").innerHTML = html;
}
function atualizarHeaderTempo(){

    const agora = new Date();

    // =====================
    // DATA
    // =====================
    const opcoes = { day: '2-digit', month: 'long', year: 'numeric' };
    const dataFormatada = agora.toLocaleDateString('pt-PT', opcoes);

    document.getElementById("infoData").innerText = dataFormatada;

    // =====================
    // HORA
    // =====================
    const hora = agora.toLocaleTimeString('pt-PT');
    document.getElementById("infoHora").innerText = hora;

    // =====================
    // SEMANA ISO
    // =====================
    const semana = getWeekNumber(agora);
    const ano = agora.getFullYear();

    document.getElementById("infoSemana").innerText = `Semana ${ano}-W${semana}`;
}
function getWeekNumber(date){

    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));

    const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1)/7);

    return String(weekNum).padStart(2, '0');
}
