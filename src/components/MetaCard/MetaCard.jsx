import "./MetaCard.css";

export default function MetaCard({ meta }) {

    if (!meta) return null;

    const percentual = Math.min(meta.atingimento, 100);

    let cor = "#43A047";

    if (meta.status === "ABAIXO_META")
        cor = "#E53935";

    if (meta.status === "NO_RITMO")
        cor = "#FB8C00";

    return (

        <div className="meta-card">

            <div className="meta-topo">

                <h3>🎯 Meta do Mês</h3>

                <span
                    className="status"
                    style={{ background: cor }}
                >

                    {meta.status.replaceAll("_", " ")}

                </span>

            </div>

            <div className="meta-linha">

                <span>Meta</span>

                <strong>

                    {meta.meta_mensal.toLocaleString("pt-BR", {

                        style: "currency",
                        currency: "BRL"

                    })}

                </strong>

            </div>

            <div className="meta-linha">

                <span>Realizado</span>

                <strong>

                    {meta.faturamento.toLocaleString("pt-BR", {

                        style: "currency",
                        currency: "BRL"

                    })}

                </strong>

            </div>

            <div className="barra">

                <div

                    className="barra-preenchimento"

                    style={{

                        width: `${percentual}%`,
                        background: cor

                    }}

                />

            </div>

            <div className="percentual">

                {meta.atingimento.toFixed(2)}%

            </div>

            <hr />

            <div className="meta-linha">

                <span>Meta diária</span>

                <strong>

                    {meta.meta_diaria.toLocaleString("pt-BR", {

                        style: "currency",
                        currency: "BRL"

                    })}

                </strong>

            </div>

            <div className="meta-linha">

                <span>Esperado hoje</span>

                <strong>

                    {meta.meta_esperada.toLocaleString("pt-BR", {

                        style: "currency",
                        currency: "BRL"

                    })}

                </strong>

            </div>

            <div className="meta-linha">

                <span>Faltam</span>

                <strong>

                    {meta.faltante.toLocaleString("pt-BR", {

                        style: "currency",
                        currency: "BRL"

                    })}

                </strong>

            </div>

            <div className="meta-linha">

                <span>Necessário por dia</span>

                <strong>

                    {meta.necessario_por_dia.toLocaleString("pt-BR", {

                        style: "currency",
                        currency: "BRL"

                    })}

                </strong>

            </div>

        </div>

    );

}