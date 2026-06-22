import "./Dashboard.css";

import Header from "../components/Header/Header";
import Card from "../components/Card/Card";

import HoraChart from "../components/Charts/HoraChart";
import BarChartCard from "../components/Charts/BarChartCard";
import RankingCard from "../components/RankingCard/RankingCard";

import { useDashboard } from "../context/DashboardContext";

import { useEffect, useState } from "react";
import UsuariosModal from "../components/UsuariosModal/UsuariosModal";

import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaBoxes,
    FaReceipt,
    FaTags,
    FaGem
} from "react-icons/fa";

export default function Dashboard() {

    const { dados, loading } = useDashboard();
    
    const[usuariosAberto, setUsuariosAberto] = useState(false);

    useEffect(() => {

    function abrir() {

        setUsuariosAberto(true);

    }

    window.addEventListener("abrirUsuarios", abrir);

    return () => {

        window.removeEventListener("abrirUsuarios", abrir);

    };

}, []);


    if (loading || !dados) {

        return (
            <>
                <Header />

                <main className="dashboard">
                    <h2>Carregando dashboard...</h2>
                </main>
            </>
        );

    }

    const resumo = dados.dashboard;

    return (

        <>

            <Header />

            <main className="dashboard">

                {/* Cards */}

                <div className="cards">

                    <Card
                        titulo="Faturamento"
                        valor={Number(resumo.faturamento).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                        crescimento={resumo.crescimento_faturamento}
                        icone={<FaMoneyBillWave color="#43A047" />}
                    />

                    <Card
                        titulo="Vendas"
                        valor={Number(resumo.pedidos).toLocaleString("pt-BR")}
                        icone={<FaShoppingCart color="#1976D2" />}
                    />

                    <Card
                        titulo="Produtos"
                        valor={Number(resumo.itens).toLocaleString("pt-BR")}
                        icone={<FaBoxes color="#FB8C00" />}
                    />

                    <Card
                        titulo="Ticket Médio"
                        valor={Number(resumo.ticket_medio).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                        icone={<FaReceipt color="#8E24AA" />}
                    />

                    <Card
                        titulo="Descontos"
                        valor={Number(resumo.desconto_total).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                        icone={<FaTags color="#EF6C00" />}
                    />

                    <Card
                        titulo="Maior Venda"
                        valor={Number(resumo.maior_venda).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                        icone={<FaGem color="#00ACC1" />}
                    />

                </div>

                {/* Faturamento por Hora */}

                <HoraChart dados={dados.horas} />

                {/* Loja + Setores */}

                <div className="grid-charts">

                    <BarChartCard
                        titulo="🏪 Faturamento por Loja"
                        dados={dados.lojas}
                        eixo="loja"
                        valor="faturamento"
                        horizontal={true}
                    />

                    <BarChartCard
                        titulo="📦 Top 15 Setores"
                        dados={dados.setores}
                        eixo="nome_subgrupo"
                        valor="faturamento"
                        horizontal={true}
                    />

                </div>

                {/* Vendedores + Fornecedores */}

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

                {/* Produtos */}

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

        </main>

        <UsuariosModal
            aberto={usuariosAberto}
            fechar={() => setUsuariosAberto(false)}
        />

        </>

    );

}