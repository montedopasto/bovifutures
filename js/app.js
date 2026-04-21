const contexto = {
    // PROCURA
    consumoBase: 100,
    sazonalidade: 1.05,
    rendimento: 0.95,

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
atualizarKPIs();
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
    atualizarKPIs();
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
