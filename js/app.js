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
                    tension: 0.3,
                    spanGaps: true
                },
                {
                    label: "Vivo €/kg",
                    data: vivoData,
                    borderColor: "#3b82f6",
                    tension: 0.3,
                    spanGaps: true
                }
            ]
        }
    });
}
window.onload = function(){

    carregarGrafico();

};
