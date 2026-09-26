import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import "./Chart.css";
import { formatCurrency } from "../../models/formatters";
import type { HoraVenda } from "../../models/types";

type HoraChartProps = {
    dados: HoraVenda[];
};

export default function HoraChart({ dados }: HoraChartProps) {
    return (
        <div className="chart-card">
            <h3>📈 Faturamento por Hora</h3>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora_venda" />
                    <YAxis />
                    <Tooltip formatter={(valor) => formatCurrency(Number(valor))} />
                    <Bar dataKey="faturamento" fill="#CF0C0C" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
