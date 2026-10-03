import "../../components/Card/Card.css";
import "./CardTotais.css";
import { formatCurrency, formatNumber } from "../../models/formatters";
import type { Desvio, MetricasPeriodo, PercentualDesvio } from "../../models/types";

type ChaveMetrica = keyof MetricasPeriodo;

type LinhaTotal = {
    rotulo: string;
    chave: ChaveMetrica;
    moeda: boolean;
};

const LINHAS: LinhaTotal[] = [
    { rotulo: "Faturamento", chave: "faturamento", moeda: true },
    { rotulo: "Vendas", chave: "pedidos", moeda: false },
    { rotulo: "Produtos", chave: "quantidade", moeda: false },
    { rotulo: "Ticket médio", chave: "ticket_medio", moeda: true }
];

type CardTotaisProps = {
    anoAnterior: string;
    anoVigente: string;
    total: Desvio;
};

function formatarMetrica(valor: number, moeda: boolean) {
    return moeda ? formatCurrency(valor) : formatNumber(valor);
}

function formatarDesvio(valor: number | null) {
    if (valor === null) return "—";

    return `${valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}%`;
}

function classeDesvio(valor: number | null) {
    if (valor === null || valor === 0) return "neutro";
    return valor > 0 ? "positivo" : "negativo";
}

export default function CardTotais({ anoAnterior, anoVigente, total }: CardTotaisProps) {
    return (
        <section className="comparativo-totais" aria-label="Totais do comparativo">
            <table>
                <thead>
                    <tr>
                        <th scope="col" />
                        <th scope="col">{anoAnterior}</th>
                        <th scope="col">{anoVigente}</th>
                        <th scope="col">Desvio</th>
                    </tr>
                </thead>
                <tbody>
                    {LINHAS.map((linha) => {
                        const percentual = total.percentual[linha.chave as keyof PercentualDesvio];

                        return (
                            <tr key={linha.chave}>
                                <th scope="row">{linha.rotulo}</th>
                                <td>{formatarMetrica(total.anterior[linha.chave], linha.moeda)}</td>
                                <td>{formatarMetrica(total.vigente[linha.chave], linha.moeda)}</td>
                                <td className={classeDesvio(percentual)}>
                                    {formatarDesvio(percentual)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}
