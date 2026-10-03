import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import "./Chart.css";
import { formatCurrency } from "../../models/formatters";
import type { SerieGrafico } from "../../models/types";

type PontoHora = {
    hora_venda: string | number;
    faturamento?: number;
};

type HoraChartProps = {
    dados: readonly PontoHora[];
    series?: readonly SerieGrafico[];
};

export default function HoraChart({ dados, series }: HoraChartProps) {
    return (
        <div className="chart-card">
            <h3>📈 Faturamento por Hora</h3>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={[...dados]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora_venda" />
                    <YAxis />
                    <Tooltip formatter={(valor) => formatCurrency(Number(valor))} />
                    {series && <Legend />}
                    {series ? (
                        series.map((serie) => (
                            <Bar
                                key={serie.chave}
                                dataKey={serie.chave}
                                name={serie.nome}
                                fill={serie.cor}
                                radius={[6, 6, 0, 0]}
                            />
                        ))
                    ) : (
                        <Bar dataKey="faturamento" fill="#CF0C0C" radius={[6, 6, 0, 0]} />
                    )}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
