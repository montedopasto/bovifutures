function guardarPreco(){

    const semana = document.getElementById("semana").value;
    const tipo = document.getElementById("tipoPreco").value;
    const valor = parseFloat(document.getElementById("valorPreco").value);

    if(!semana || !valor){
        alert("Preenche todos os campos");
        return;
    }

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    historico.push({
    semana: semana,
    tipo: tipo,
    valor: valor
});

    localStorage.setItem("precos", JSON.stringify(historico));

    alert("Preço guardado com sucesso!");

    carregarGrafico();
}
function carregarGrafico(){

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    // ordenar por semana
    historico.sort((a,b) => a.semana.localeCompare(b.semana));

    // semanas únicas
    const labels = [...new Set(historico.map(d => d.semana))];

    const carcacaData = labels.map(semana => {
        const reg = historico.find(d => d.semana === semana && d.tipo === "carcaca");
        return reg ? reg.valor : null;
    });

    const vivoData = labels.map(semana => {
        const reg = historico.find(d => d.semana === semana && d.tipo === "vivo");
        return reg ? reg.valor : null;
    });

    const ctx = document.getElementById("graficoPrecos");

    if(!ctx) return;

    if(window.chart) window.chart.destroy();

    window.chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [
            {
                label: "Carcaça €/kg",
                data: carcacaData,
                borderColor: "#00ff88",
                backgroundColor: "rgba(0,255,136,0.08)",
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 6,
                fill: true,
                spanGaps: true
            },
            {
                label: "Vivo €/kg",
                data: vivoData,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.08)",
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 6,
                fill: true,
                spanGaps: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        plugins: {
            legend: {
                labels: {
                    color: "#888",
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: "#0b0f14",
                borderColor: "#222",
                borderWidth: 1,
                titleColor: "#fff",
                bodyColor: "#ccc",
                padding: 10
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "#555",
                    maxRotation: 0
                },
                grid: {
                    color: "rgba(255,255,255,0.03)"
                }
            },
            y: {
                ticks: {
                    color: "#555"
                },
                grid: {
                    color: "rgba(255,255,255,0.03)"
                }
            }
        }
    }
});
}
window.onload = function(){

    carregarGrafico();

};
