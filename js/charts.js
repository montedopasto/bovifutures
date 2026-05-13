function carregarGrafico(){

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    // ordenar por semana
    historico.sort((a,b) => a.semana.localeCompare(b.semana));

    // semanas reais (histórico)
const baseLabels = [...new Set(historico.map(d => d.semana))]
.sort((a,b)=>{

    const numA = parseInt(a.replace("W",""));
    const numB = parseInt(b.replace("W",""));

    return numA - numB;
});

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
window.onload = async function(){

    await carregarDados();

    atualizarHeaderTempo();

    setInterval(atualizarHeaderTempo, 1000);
};
