import "./RankingCard.css";
import { formatCurrency, formatNumber } from "../../models/formatters";

export default function RankingCard({
    titulo,
    dados,
    nome,
    valor,
    extra
}) {

    function corBarra(percentual) {

        if (percentual >= 100)
            return "#22c55e";

        if (percentual >= 80)
            return "#f59e0b";

        return "#ef4444";

    }

    return (

        <div className="ranking-card">

            <h3>{titulo}</h3>

            <div className="ranking-list">

                {dados.map((item, index) => (

                    <div
                        className="ranking-item"
                        key={index}
                    >

                        <div className="ranking-posicao">

    {
        index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : index === 2
            ? "🥉"
            : `${index + 1}º`
    }

</div>

                        <div className="ranking-info">

                            <div className="ranking-nome">

                                {item[nome]}

                            </div>

                            {

                                extra && (

                                    <div className="ranking-extra">

                                        {formatNumber(item[extra])} un.

                                    </div>

                                )

                            }

                            {

                                item.meta && item.meta > 0 && (

                                    <>

                                        <div className="ranking-meta-texto">

                                          🎯 Meta: {formatCurrency(item.meta)}

                                        </div>

                                        <div className="ranking-barra">

                                            <div

                                                className="ranking-barra-preenchida"

                                                style={{

                                                    width: `${Math.min(item.percentual_meta,120)}%`,

                                                    background: corBarra(item.percentual_meta)

                                                }}

                                            />

                                        </div>

                                        <div className="ranking-percentual">

                                            {item.percentual_meta.toFixed(1)}%

                                        </div>

                                      {
    item.meta > item.faturamento && (

        <div className="ranking-faltante">

            Falta {formatCurrency(item.meta - item.faturamento)}

        </div>

    )
}  

                                    </>

                                )

                            }

                            

                        </div>

                        <div className="ranking-valor">

                            {

                                valor === "quantidade"

                                    ? `${formatNumber(item[valor])} un.`

                                    : formatCurrency(item[valor])

                            }

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}