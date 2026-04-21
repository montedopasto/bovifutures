async function carregarDados(){

    try {

        const res = await fetch("data/market-data.json");
        const data = await res.json();

        console.log("DATA:", data); // DEBUG

        window.marketData = data;

        const precoCarcaca = data.mercadoCarcaca.preco;
        const rendimento = data.rendimento;

        const precoVivoEstimado = precoCarcaca * rendimento;

        // KPIs (só atualiza se existir o elemento)
        if(document.getElementById("precoCarcacaPT")){
            document.getElementById("precoCarcacaPT").innerText =
                precoCarcaca.toFixed(2) + " €/kg";
        }

        if(document.getElementById("precoVivoPT")){
            document.getElementById("precoVivoPT").innerText =
                precoVivoEstimado.toFixed(2) + " €/kg (estimado)";
        }

        if(document.getElementById("infoData")){
            document.getElementById("infoData").innerText =
                "Atualizado: " + data.mercadoCarcaca.data;
        }

        if(document.getElementById("infoFonteKPI")){
            document.getElementById("infoFonteKPI").innerText =
                data.mercadoCarcaca.nome + " | " +
                data.mercadoCarcaca.categoria;
        }

        if(document.getElementById("estadoMercado")){
            const score = calcularScoreMercado(data.fatores);
            const leitura = interpretarMercado(score);

            document.getElementById("estadoMercado").innerText = leitura.estado;
            document.getElementById("scoreMercado").innerText = "Score: " + score;
            document.getElementById("textoMercado").innerText = leitura.texto;
        }

        // GRÁFICO (só se existir e Chart estiver carregado)
        const ctx = document.getElementById('graficoPrecos');

        if(ctx && window.Chart){

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.historico.datas,
                    datasets: [
                        {
                            label: 'Carcaça €/kg',
                            data: data.historico.carcaca,
                            borderColor: '#00ff88',
                            tension: 0.3
                        },
                        {
                            label: 'Vivo €/kg',
                            data: data.historico.vivo,
                            borderColor: '#3b82f6',
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    plugins: {
                        legend: { labels: { color: '#ccc' } }
                    },
                    scales: {
                        x: { ticks: { color: '#aaa' }, grid: { color: '#222' } },
                        y: { ticks: { color: '#aaa' }, grid: { color: '#222' } }
                    }
                }
            });

        }

    } catch (err) {
        console.error("ERRO:", err);
    }

}

carregarDados();
