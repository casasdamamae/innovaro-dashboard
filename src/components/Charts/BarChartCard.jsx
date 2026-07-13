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
import { useRef, useEffect } from "react";


export default function BarChartCard({
    titulo,
    dados,
    eixo,
    valor,
    horizontal = false
}) {

    const mobile = window.innerWidth <= 768;
    const chartRef = useRef(null);


    function formatarValor(v) {

        if (valor === "faturamento" || valor === "ticket_medio") {

            return Number(v).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        }

        return Number(v).toLocaleString("pt-BR");

    }

    useEffect(() => {
    if (!chartRef.current) return;

    const svg = chartRef.current.querySelector("svg");
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
        ctx.drawImage(img, 0, 0);

        const pngBase64 = canvas.toDataURL("image/png");

        // 👉 Envia o gráfico para o Dashboard
        if (titulo.includes("Faturamento por Loja")) {
    window.dispatchEvent(
        new CustomEvent("graficoFaturamentoLoja", { detail: pngBase64 })
    );
}

        URL.revokeObjectURL(url);
    };

    img.src = url;

}, [dados]);


    return (

        <div className="chart-card">

            <h3>{titulo}</h3>

            <div ref={chartRef}> 
            <ResponsiveContainer
                width="100%"
                height={mobile ? 520 : 380}
            >

                <BarChart
                    data={dados}
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
                                tick={{
                                    fontSize: mobile ? 10 : 12
                                }}
                            />

                        </>

                    ) : (

                        <>

                            <XAxis
                                dataKey={eixo}
                                tick={{
                                    fontSize: mobile ? 10 : 12
                                }}
                            />

                            <YAxis
                                tick={{
                                    fontSize: mobile ? 10 : 12
                                }}
                            />

                        </>

                    )}

                    <Tooltip
                        content={({ active, payload, label }) => {

                            if (!active || !payload || payload.length === 0)
                                return null;

                            const item = payload[0].payload;

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
                                        <strong>Valor:</strong>{" "}
                                        {formatarValor(item[valor])}
                                    </div>

                                    {

                                        item.percentual !== undefined && (

                                            <div style={{ marginBottom: "6px" }}>
                                                <strong>Participação:</strong>{" "}
                                                {Number(item.percentual).toFixed(2)}%
                                            </div>

                                        )

                                    }

                                    {

                                        item.pedidos !== undefined && (

                                            <div>
                                                <strong>Pedidos:</strong>{" "}
                                                {item.pedidos}
                                            </div>

                                        )

                                    }

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