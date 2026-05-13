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
const canvas = ctx.getContext("2d");

// ==========================
// GRADIENTE VERDE
// ==========================

const gradienteVerde = canvas.createLinearGradient(0,0,0,400);

gradienteVerde.addColorStop(0,"rgba(0,255,136,0.35)");
gradienteVerde.addColorStop(1,"rgba(0,255,136,0.00)");

// ==========================
// GRADIENTE AZUL
// ==========================

const gradienteAzul = canvas.createLinearGradient(0,0,0,400);

gradienteAzul.addColorStop(0,"rgba(59,130,246,0.35)");
gradienteAzul.addColorStop(1,"rgba(59,130,246,0.00)");
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
                backgroundColor: "rgba(0,255,136,0.12)",
fill: true,
pointRadius: 0,
pointHoverRadius: 6,
borderWidth: 3,
tension: 0.45,
                tension: 0.4,
                fill: true,
backgroundColor: gradienteVerde,
borderWidth: 3,
pointBackgroundColor:"#00ff88",
pointBorderWidth:0,
pointHoverRadius:7
            },

            {
                label: "Vivo €/kg",
                data: vivoData.concat([null,null,null,null]),
                borderColor: "#3b82f6",
                tension: 0.4,
                fill: true,
backgroundColor: gradienteAzul,
borderWidth: 3,
pointBackgroundColor:"#3b82f6",
pointBorderWidth:0,
pointHoverRadius:7
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
