import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

import { useDashboard } from "../../context/dashboardContext";
import type { ContextoPainel } from "../Painel/PainelLayout";

import HoraChart from "../../components/Charts/HoraChart";
import BarChartCard from "../../components/Charts/BarChartCard";
import CardTotais from "./CardTotais";
import ListaQuantidade from "./ListaQuantidade";
import { nomeLojaExibicao } from "../../models/nomeLoja";
import "./Comparativo.css";
import {
    fetchComparativo,
    type ModoComparativo
} from "../../services/comparativoService";
import type { Comparativo, Desvio, SerieGrafico } from "../../models/types";

const COR_ANTERIOR = "#CF0C0C";
const COR_VIGENTE = "#197602";
const TOPO = 15;

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

function topDoAno<T extends Desvio>(
    itens: readonly T[],
    lado: "anterior" | "vigente",
    nomeDe: (item: T) => string
) {
    return itens
        .filter((item) => item[lado].faturamento > 0)
        .sort((a, b) => b[lado].faturamento - a[lado].faturamento)
        .slice(0, TOPO)
        .map((item) => ({
            nome: nomeDe(item),
            faturamento: item[lado].faturamento
        }));
}

export default function Comparativo() {
    const { loja } = useDashboard();
    const { versaoComparativo } = useOutletContext<ContextoPainel>();
    const [modo, setModo] = useState<ModoComparativo>("dia");
    const [dados, setDados] = useState<Comparativo | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        setCarregando(true);
        setErro("");

        fetchComparativo({ modo, loja })
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
    }, [modo, loja, versaoComparativo]);

    function escolherModo(proximo: ModoComparativo) {
        setModo((atual) => (atual === proximo ? atual : proximo));
    }

    const botaoModo = (
        <div className="comparativo-modo" role="group" aria-label="Período do comparativo">
            <button
                type="button"
                className={modo === "dia" ? "pressionado" : undefined}
                aria-pressed={modo === "dia"}
                onClick={() => escolherModo("dia")}
            >
                Hoje
            </button>
            <button
                type="button"
                className={modo === "acumulado" ? "pressionado" : undefined}
                aria-pressed={modo === "acumulado"}
                onClick={() => escolherModo("acumulado")}
            >
                Acumulado do Mês
            </button>

            {carregando && (
                <span className="comparativo-carregando" role="status" aria-live="polite">
                    <span className="comparativo-carregando-circulo" aria-hidden="true" />
                    Carregando…
                </span>
            )}
        </div>
    );

    if (carregando && !dados) {
        return (
            <>
                {botaoModo}
                <h2>Carregando comparativo...</h2>
            </>
        );
    }

    if (erro || !dados) {
        return (
            <>
                {botaoModo}
                <div className="dashboard-estado">
                    <h2>{erro || "Não foi possível carregar o comparativo."}</h2>
                </div>
            </>
        );
    }

    const anoAnterior = anoDe(dados.periodo.anterior.inicio);
    const anoVigente = anoDe(dados.periodo.vigente.inicio);
    const series = seriesDoPeriodo(anoAnterior, anoVigente);
    const desvios = dados.desvios;

    return (
        <>
            {botaoModo}

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

            <BarChartCard
                titulo="🏪 Faturamento por Loja"
                dados={desvios.por_loja.map((item) =>
                    pontoFaturamento(nomeLojaExibicao(item.loja), item)
                )}
                eixo="nome"
                valor="faturamento"
                altura={350}
                series={series}
            />

            <div className="grid-charts">
                <ListaQuantidade
                    titulo="📦 Top 15 Setores"
                    anoAnterior={anoAnterior}
                    anoVigente={anoVigente}
                    anteriores={topDoAno(
                        desvios.por_subgrupo,
                        "anterior",
                        (item) => item.nome_subgrupo
                    )}
                    vigentes={topDoAno(
                        desvios.por_subgrupo,
                        "vigente",
                        (item) => item.nome_subgrupo
                    )}
                />

                <ListaQuantidade
                    titulo="🏭 Top 15 Fornecedores"
                    anoAnterior={anoAnterior}
                    anoVigente={anoVigente}
                    anteriores={topDoAno(
                        desvios.por_fornecedor,
                        "anterior",
                        (item) => item.nome_fornecedor
                    )}
                    vigentes={topDoAno(
                        desvios.por_fornecedor,
                        "vigente",
                        (item) => item.nome_fornecedor
                    )}
                />

                <ListaQuantidade
                    titulo="💰 Top 15 Produtos"
                    anoAnterior={anoAnterior}
                    anoVigente={anoVigente}
                    anteriores={topDoAno(
                        desvios.por_produto,
                        "anterior",
                        (item) => item.nome_produto
                    )}
                    vigentes={topDoAno(
                        desvios.por_produto,
                        "vigente",
                        (item) => item.nome_produto
                    )}
                />
            </div>
        </>
    );
}
