import "./MetaCard.css";
import { formatCurrency, formatPercent, formatStatusLabel } from "../../models/formatters";

export default function MetaCard({ meta }) {
    if (!meta) return null;

    const percentual = Math.min(meta.atingimento, 100);

    let cor = "#43A047";

    if (meta.status === "ABAIXO_META") cor = "#E53935";
    if (meta.status === "NO_RITMO") cor = "#FB8C00";

    return (
        <div className="meta-card">
            <div className="meta-topo">
                <h3>🎯 Meta do Mês</h3>
                <span className="status" style={{ background: cor }}>
                    {formatStatusLabel(meta.status)}
                </span>
            </div>

            <div className="meta-linha">
                <span>Meta</span>
                <strong>{formatCurrency(meta.meta_mensal)}</strong>
            </div>

            <div className="meta-linha">
                <span>Realizado</span>
                <strong>{formatCurrency(meta.faturamento)}</strong>
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

            <div className="percentual">{formatPercent(meta.atingimento)}%</div>

            <hr />

            <div className="meta-linha">
                <span>Meta diária</span>
                <strong>{formatCurrency(meta.meta_diaria)}</strong>
            </div>

            <div className="meta-linha">
                <span>Esperado hoje</span>
                <strong>{formatCurrency(meta.meta_esperada)}</strong>
            </div>

            <div className="meta-linha">
                <span>Faltam</span>
                <strong>{formatCurrency(meta.faltante)}</strong>
            </div>

            <div className="meta-linha">
                <span>Necessário por dia</span>
                <strong>{formatCurrency(meta.necessario_por_dia)}</strong>
            </div>
        </div>
    );
}
