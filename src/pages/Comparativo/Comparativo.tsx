import { useEffect, useState } from "react";
import axios from "axios";

import HoraChart from "../../components/Charts/HoraChart";
import BarChartCard from "../../components/Charts/BarChartCard";
import CardTotais from "./CardTotais";
import { fetchComparativo } from "../../services/comparativoService";
import type { Comparativo, Desvio, SerieGrafico } from "../../models/types";

const COR_ANTERIOR = "#CF0C0C";
const COR_VIGENTE = "#197602";
const TOPO = 15;

type ComparativoProps = {
    inicio: string;
    fim: string;
    loja: string;
    versao: number;
};

function anoDe(iso: string) {
    return iso.slice(0, 4);
}

function mensagemErro(error: unknown) {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { erro?: string } | undefined;

        if (typeof data?.erro === "string" && data.erro) return data.erro;
    }

    return "Não foi possível carregar o comparativo.";
}

function seriesDoPeriodo(anoAnterior: string, anoVigente: string): SerieGrafico[] {
    return [
        { chave: "faturamento_anterior", nome: anoAnterior, cor: COR_ANTERIOR },
        { chave: "faturamento_vigente", nome: anoVigente, cor: COR_VIGENTE }
    ];
}

function pontoFaturamento(nome: string, desvio: Desvio) {
    return {
        nome,
        faturamento_anterior: desvio.anterior.faturamento,
        faturamento_vigente: desvio.vigente.faturamento
    };
}

export default function Comparativo({ inicio, fim, loja, versao }: ComparativoProps) {
    const [dados, setDados] = useState<Comparativo | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        setCarregando(true);
        setErro("");

        fetchComparativo({ inicio, fim, loja })
            .then((resposta) => {
                if (!ativo) return;
                setDados(resposta);
            })
            .catch((error: unknown) => {
                if (!ativo) return;
                setDados(null);
                setErro(mensagemErro(error));
            })
            .finally(() => {
                if (ativo) setCarregando(false);
            });

        return () => {
            ativo = false;
        };
    }, [inicio, fim, loja, versao]);

    if (carregando && !dados) {
        return <h2>Carregando comparativo...</h2>;
    }

    if (erro || !dados) {
        return (
            <div className="dashboard-estado">
                <h2>{erro || "Não foi possível carregar o comparativo."}</h2>
            </div>
        );
    }

    const anoAnterior = anoDe(dados.periodo.anterior.inicio);
    const anoVigente = anoDe(dados.periodo.vigente.inicio);
    const series = seriesDoPeriodo(anoAnterior, anoVigente);
    const desvios = dados.desvios;

    return (
        <>
            <CardTotais
                anoAnterior={anoAnterior}
                anoVigente={anoVigente}
                total={desvios.total}
            />

            <HoraChart
                dados={desvios.por_hora.map((item) => ({
                    hora_venda: item.hora,
                    faturamento_anterior: item.anterior.faturamento,
                    faturamento_vigente: item.vigente.faturamento
                }))}
                series={series}
            />

            <div className="grid-charts">
                <BarChartCard
                    titulo="🏪 Faturamento por Loja"
                    dados={desvios.por_loja.map((item) => pontoFaturamento(item.loja, item))}
                    eixo="nome"
                    valor="faturamento"
                    horizontal
                    series={series}
                />

                <BarChartCard
                    titulo="📦 Top 15 Setores"
                    dados={desvios.por_secao
                        .slice(0, TOPO)
                        .map((item) => pontoFaturamento(item.nome_secao, item))}
                    eixo="nome"
                    valor="faturamento"
                    horizontal
                    series={series}
                />
            </div>

            <div className="grid-charts">
                <BarChartCard
                    titulo="🏭 Top 15 Fornecedores"
                    dados={desvios.por_fornecedor
                        .slice(0, TOPO)
                        .map((item) => pontoFaturamento(item.nome_fornecedor, item))}
                    eixo="nome"
                    valor="faturamento"
                    horizontal
                    series={series}
                />

                <BarChartCard
                    titulo="💰 Top 15 Produtos"
                    dados={desvios.por_produto
                        .slice(0, TOPO)
                        .map((item) => pontoFaturamento(item.nome_produto, item))}
                    eixo="nome"
                    valor="faturamento"
                    horizontal
                    series={series}
                />
            </div>
        </>
    );
}
