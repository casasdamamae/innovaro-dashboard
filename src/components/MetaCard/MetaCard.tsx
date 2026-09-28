import "./MetaCard.css";
import { formatCurrency, formatPercent } from "../../models/formatters";
import type { MetaDashboard, StatusMeta } from "../../models/types";

type MetaCardProps = {
    meta?: MetaDashboard | null;
};

const STATUS_META: Record<StatusMeta, { rotulo: string; cor: string }> = {
    ACIMA_META: { rotulo: "ACIMA DA META", cor: "#43A047" },
    NO_RITMO: { rotulo: "NO RITMO", cor: "#FB8C00" },
    ABAIXO_META: { rotulo: "ABAIXO DA META", cor: "#E53935" }
};

export default function MetaCard({ meta }: MetaCardProps) {
    if (!meta) return null;

    const percentual = Math.min(meta.atingimento, 100);
    const { rotulo, cor } = STATUS_META[meta.status];

    return (
        <div className="meta-card">
            <div className="meta-topo">
                <h3>🎯 Meta do Mês</h3>
                <span className="status" style={{ background: cor }}>
                    {rotulo}
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
