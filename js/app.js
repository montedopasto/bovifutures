function guardarPreco(){

    const data = document.getElementById("dataSemana").value;
    const tipo = document.getElementById("tipoPreco").value;
    const valor = parseFloat(document.getElementById("valorPreco").value);

    if(!data || !valor){
        alert("Preenche todos os campos");
        return;
    }

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    historico.push({
        data: data,
        tipo: tipo,
        valor: valor
    });

    localStorage.setItem("precos", JSON.stringify(historico));

    alert("Preço guardado com sucesso!");

    carregarGrafico();
}
function carregarGrafico(){

    let historico = JSON.parse(localStorage.getItem("precos")) || [];

    const carcaca = historico.filter(d => d.tipo === "carcaca");
    const vivo = historico.filter(d => d.tipo === "vivo");

    const labels = carcaca.map(d => d.data);

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
                    data: carcaca.map(d => d.valor),
                    borderColor: "#00ff88",
                    tension: 0.3
                },
                {
                    label: "Vivo €/kg",
                    data: vivo.map(d => d.valor),
                    borderColor: "#3b82f6",
                    tension: 0.3
                }
            ]
        }
    });
}
