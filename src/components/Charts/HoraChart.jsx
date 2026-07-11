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

export default function HoraChart({ dados }) {

    return (

        <div className="chart-card">

            <h3>📈 Faturamento por Hora</h3>

            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <BarChart data={dados}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="hora_venda" />

                    <YAxis />

                    <Tooltip
                        formatter={(valor) =>
                            valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })
                        }
                    />

                    <Bar
                        dataKey="faturamento"
                        fill="#CF0C0C"
                        radius={[6,6,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}