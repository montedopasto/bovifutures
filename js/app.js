async function carregarDados(){

    try {

        const proxy = "https://api.allorigins.win/raw?url=";
        const url = "https://www.confagri.pt/temas/bolsa-do-bovino/";

        // buscar página principal
        const res = await fetch(proxy + encodeURIComponent(url));
        const html = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // encontrar links
        const links = [...doc.querySelectorAll("a")];

        const linksSessao = links.filter(l => 
    l.textContent.toLowerCase().includes("sess")
);

// assume que o primeiro é o mais recente
const linkSessao = linksSessao[0];

        const urlSessao = linkSessao.href;

        console.log("Sessão:", urlSessao);

        // buscar página da sessão
        const resSessao = await fetch(proxy + encodeURIComponent(urlSessao));
        const htmlSessao = await resSessao.text();

        const docSessao = parser.parseFromString(htmlSessao, "text/html");

        const texto = docSessao.body.innerText;

        // procurar linha com Novilho
        const linha = texto.split("\n").find(l => l.includes("Novilho"));

        console.log("Linha:", linha);

        // extrair preço
        let preco = null;

        if(linha){
            const match = linha.match(/(\d+,\d+|\d+\.\d+)/);
            if(match){
                preco = parseFloat(match[0].replace(",", "."));
            }
        }

        console.log("Preço:", preco);

        // MOSTRAR NO KPI
        const el = document.getElementById("precoCarcacaPT");

        if(el){
            el.innerText = preco ? preco.toFixed(2) + " €/kg" : "N/D";
        }

    } catch (err) {
        console.error("ERRO:", err);
    }

}

carregarDados();
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
