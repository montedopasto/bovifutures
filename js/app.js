async function carregarDados(){

    const res = await fetch("data/market-data.json");
    const data = await res.json();

    window.marketData = data;

    const precoCarcaca = data.mercadoCarcaca.preco;
    const rendimento = data.rendimento;

    // calcular vivo estimado
    const precoVivoEstimado = precoCarcaca * rendimento;

    // KPI principal
    document.getElementById("precoCarcacaPT").innerText =
        precoCarcaca.toFixed(2) + " €/kg";

    document.getElementById("precoVivoPT").innerText =
        precoVivoEstimado.toFixed(2) + " €/kg (estimado)";

    // INFO (topbar)
    document.getElementById("infoData").innerText =
        "Atualizado: " + data.mercadoCarcaca.data;

    document.getElementById("infoFonteKPI").innerText =
        data.mercadoCarcaca.nome + " | " +
        data.mercadoCarcaca.categoria;

    // INTELIGÊNCIA DE MERCADO
    const score = calcularScoreMercado(data.fatores);
    const leitura = interpretarMercado(score);

    document.getElementById("estadoMercado").innerText = leitura.estado;
    document.getElementById("scoreMercado").innerText = "Score: " + score;
    document.getElementById("textoMercado").innerText = leitura.texto;

    // GRÁFICO
    const ctx = document.getElementById('graficoPrecos');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.historico.datas,
            datasets: [
                {
                    label: 'Carcaça €/kg',
                    data: data.historico.carcaca,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0,255,136,0.1)',
                    tension: 0.3
                },
                {
                    label: 'Vivo €/kg',
                    data: data.historico.vivo,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: { color: '#ccc' }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#aaa' },
                    grid: { color: '#222' }
                },
                y: {
                    ticks: { color: '#aaa' },
                    grid: { color: '#222' }
                }
            }
        }
    });

}

carregarDados();
