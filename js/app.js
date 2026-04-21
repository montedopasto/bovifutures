async function carregarDados(){

    try {

        const proxy = "https://api.allorigins.win/raw?url=";

// página principal
const url = "https://www.confagri.pt/temas/bolsa-do-bovino/";

const res = await fetch(proxy + encodeURIComponent(url));
const html = await res.text();

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");

// apanhar todos os links
const links = [...doc.querySelectorAll("a")];

// encontrar o primeiro link que parece sessão
const linkSessao = links.find(l => 
    l.href.includes("bolsa") || l.textContent.toLowerCase().includes("sess")
);

const urlSessao = linkSessao.href;

console.log("Sessão encontrada:", urlSessao);
const resSessao = await fetch(proxy + encodeURIComponent(urlSessao));
const htmlSessao = await resSessao.text();

const docSessao = parser.parseFromString(htmlSessao, "text/html");

// ver conteúdo para perceber estrutura
console.log(docSessao.body.innerText);
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
