import "./Dashboard.css";

import { useState, type ReactNode } from "react";
import { useDashboard } from "../../context/dashboardContext";
import { encerrarSessao } from "../../models/session";
import type { Resumo } from "../../models/types";

import Header, { type SecaoPainel } from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import MetaCard from "../../components/MetaCard/MetaCard";
import HoraChart from "../../components/Charts/HoraChart";
import BarChartCard from "../../components/Charts/BarChartCard";
import RankingCard from "../../components/RankingCard/RankingCard";
import MetasModal from "../../components/MetasModal/MetasModal";
import Usuarios from "../Usuarios/Usuarios";
import MetasVendedoresModal from "../../components/MetasVendedoresModal/MetasVendedoresModal";

import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaBoxes,
    FaReceipt,
    FaTags,
    FaGem
} from "react-icons/fa";

function formatarMoeda(valor: number) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

type CardResumo = {
    titulo: string;
    valor: string;
    crescimento?: number;
    icone: ReactNode;
};

type DashboardConteudoProps = {
    dados: Resumo;
    onSnapshotLoja: (imagem: string) => void;
};

function DashboardConteudo({ dados, onSnapshotLoja }: DashboardConteudoProps) {
    const resumo = dados.dashboard;
    const meta = dados.metaDashboard;

    const cards: CardResumo[] = [
        {
            titulo: "Faturamento",
            valor: formatarMoeda(resumo.faturamento),
            crescimento: resumo.crescimento_faturamento,
            icone: <FaMoneyBillWave color="#43A047" />
        },
        {
            titulo: "Vendas",
            valor: Number(resumo.pedidos).toLocaleString("pt-BR"),
            icone: <FaShoppingCart color="#1976D2" />
        },
        {
            titulo: "Produtos",
            valor: Number(resumo.itens).toLocaleString("pt-BR"),
            icone: <FaBoxes color="#FB8C00" />
        },
        {
            titulo: "Ticket Médio",
            valor: formatarMoeda(resumo.ticket_medio),
            icone: <FaReceipt color="#8E24AA" />
        },
        {
            titulo: "Descontos",
            valor: formatarMoeda(resumo.desconto_total),
            icone: <FaTags color="#EF6C00" />
        },
        {
            titulo: "Maior Venda",
            valor: formatarMoeda(resumo.maior_venda),
            icone: <FaGem color="#00ACC1" />
        }
    ];

    return (
        <>
            <div className="cards">
                {cards.map((card) => (
                    <Card
                        key={card.titulo}
                        titulo={card.titulo}
                        valor={card.valor}
                        crescimento={card.crescimento}
                        icone={card.icone}
                    />
                ))}

                <MetaCard meta={meta} />
            </div>

            <HoraChart dados={dados.horas} />

            <div className="grid-charts">
                <BarChartCard
                    titulo="🏪 Faturamento por Loja"
                    dados={dados.lojas}
                    eixo="loja"
                    valor="faturamento"
                    horizontal={true}
                    onSnapshot={onSnapshotLoja}
                />

                <BarChartCard
                    titulo="📦 Top 15 Setores"
                    dados={dados.setores}
                    eixo="nome_subgrupo"
                    valor="faturamento"
                    horizontal={true}
                />
            </div>

            <div className="grid-charts">
                <RankingCard
                    titulo="🏆 Ranking de Vendedores"
                    dados={dados.vendedores}
                    nome="nome_vendedor"
                    valor="faturamento"
                />

                <RankingCard
                    titulo="🏭 Ranking de Fornecedores"
                    dados={dados.fornecedores}
                    nome="nome_fornecedor"
                    valor="faturamento"
                />
            </div>

            <div className="grid-charts">
                <RankingCard
                    titulo="💰 Produtos por Faturamento"
                    dados={dados.produtos}
                    nome="nome_produto"
                    valor="faturamento"
                    extra="quantidade"
                />

                <RankingCard
                    titulo="📦 Produtos por Quantidade"
                    dados={dados.produtosQuantidade}
                    nome="nome_produto"
                    valor="quantidade"
                />
            </div>
        </>
    );
}

export default function Dashboard() {
    const {
        dados,
        isInitialLoading,
        isRefreshing,
        erroInicial,
        usuario,
        inicio,
        fim,
        loja,
        lojas,
        fornecedor,
        fornecedores,
        setor,
        setores,
        graficoLoja,
        metasAberto,
        metasVendedoresAberto,
        setInicio,
        setFim,
        setLoja,
        setFornecedor,
        setSetor,
        atualizar,
        registrarGraficoLoja,
        abrirMetas,
        fecharMetas,
        abrirMetasVendedores,
        fecharMetasVendedores
    } = useDashboard();

    const [secao, setSecao] = useState<SecaoPainel>("dashboard");

    function trocarSecao() {
        setSecao((atual) => (atual === "dashboard" ? "usuarios" : "dashboard"));
    }

    return (
        <>
            <Header
                usuario={usuario}
                dados={dados}
                inicio={inicio}
                fim={fim}
                loja={loja}
                lojas={lojas}
                fornecedor={fornecedor}
                fornecedores={fornecedores}
                setor={setor}
                setores={setores}
                isRefreshing={isRefreshing}
                onInicioChange={setInicio}
                onFimChange={setFim}
                onLojaChange={setLoja}
                onFornecedorChange={setFornecedor}
                onSetorChange={setSetor}
                onRefresh={atualizar}
                secao={secao}
                onTrocarSecao={trocarSecao}
                onOpenMetas={abrirMetas}
                onOpenMetasVendedores={abrirMetasVendedores}
                onLogout={encerrarSessao}
                graficoLoja={graficoLoja}
            />

            <main className="dashboard">
                {secao === "usuarios" ? (
                    <Usuarios />
                ) : isInitialLoading ? (
                    <h2>Carregando dashboard...</h2>
                ) : erroInicial || !dados ? (
                    <div className="dashboard-estado">
                        <h2>Não foi possível carregar o dashboard.</h2>
                        <button type="button" onClick={() => void atualizar()}>
                            Tentar novamente
                        </button>
                    </div>
                ) : (
                    <DashboardConteudo
                        dados={dados}
                        onSnapshotLoja={registrarGraficoLoja}
                    />
                )}
            </main>

            <MetasModal aberto={metasAberto} fechar={fecharMetas} />
            <MetasVendedoresModal
                aberto={metasVendedoresAberto}
                fechar={fecharMetasVendedores}
            />
        </>
    );
}
