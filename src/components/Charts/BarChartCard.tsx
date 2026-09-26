import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import { useEffect, useRef } from "react";
import "./Chart.css";

type LinhaGrafico = {
    percentual?: number;
    pedidos?: number;
    [key: string]: string | number | undefined;
};

type BarChartCardProps = {
    titulo: string;
    dados: readonly LinhaGrafico[];
    eixo: string;
    valor: string;
    horizontal?: boolean;
    onSnapshot?: (imagem: string) => void;
};

export default function BarChartCard({
    titulo,
    dados,
    eixo,
    valor,
    horizontal = false,
    onSnapshot
}: BarChartCardProps) {
    const mobile = window.innerWidth <= 768;
    const chartRef = useRef<HTMLDivElement>(null);

    function formatarValor(v: string | number | undefined) {
        if (valor === "faturamento" || valor === "ticket_medio") {
            return Number(v).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }

        return Number(v).toLocaleString("pt-BR");
    }

    useEffect(() => {
        const container = chartRef.current;
        if (!onSnapshot || !container) return;

        const timeout = setTimeout(() => {
            const svg = container.querySelector("svg");
            if (!svg) return;

            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = svg.clientWidth;
                canvas.height = svg.clientHeight;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.drawImage(img, 0, 0);

                onSnapshot(canvas.toDataURL("image/png"));
                URL.revokeObjectURL(url);
            };

            img.src = url;
        }, 300);

        return () => clearTimeout(timeout);
    }, [dados, onSnapshot]);

    return (
        <div className="chart-card">
            <h3>{titulo}</h3>
            <div ref={chartRef}>
                <ResponsiveContainer width="100%" height={mobile ? 520 : 380}>
                    <BarChart
                        data={[...dados]}
                        layout={horizontal ? "vertical" : "horizontal"}
                        margin={{
                            top: 10,
                            right: mobile ? 10 : 20,
                            left: mobile ? 5 : 40,
                            bottom: 10
                        }}
                        barCategoryGap={mobile ? "18%" : "30%"}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        {horizontal ? (
                            <>
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: mobile ? 10 : 12 }}
                                />

                                <YAxis
                                    type="category"
                                    dataKey={eixo}
                                    width={mobile ? 120 : 220}
                                    interval={0}
                                    tick={{ fontSize: mobile ? 10 : 12 }}
                                />
                            </>
                        ) : (
                            <>
                                <XAxis
                                    dataKey={eixo}
                                    tick={{ fontSize: mobile ? 10 : 12 }}
                                />

                                <YAxis tick={{ fontSize: mobile ? 10 : 12 }} />
                            </>
                        )}

                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (!active || !payload || payload.length === 0) return null;

                                const item = payload[0].payload as LinhaGrafico;

                                return (
                                    <div
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            padding: "12px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,.15)"
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "15px",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            {label}
                                        </div>

                                        <div style={{ marginBottom: "6px" }}>
                                            <strong>Valor:</strong> {formatarValor(item[valor])}
                                        </div>

                                        {item.percentual !== undefined && (
                                            <div style={{ marginBottom: "6px" }}>
                                                <strong>Participação:</strong> {Number(item.percentual).toFixed(2)}%
                                            </div>
                                        )}

                                        {item.pedidos !== undefined && (
                                            <div>
                                                <strong>Pedidos:</strong> {item.pedidos}
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                        />

                        <Bar
                            dataKey={valor}
                            fill="#197602"
                            radius={[6, 6, 6, 6]}
                            barSize={mobile ? 16 : 24}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
