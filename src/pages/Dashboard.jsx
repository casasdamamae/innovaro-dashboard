import "./Dashboard.css";

import { useDashboard } from "../context/dashboardContext";
import { clearSession } from "../models/session";

import Header from "../components/Header/Header";
import Card from "../components/Card/Card";
import MetaCard from "../components/MetaCard/MetaCard";
import HoraChart from "../components/Charts/HoraChart";
import BarChartCard from "../components/Charts/BarChartCard";
import RankingCard from "../components/RankingCard/RankingCard";
import UsuariosModal from "../components/UsuariosModal/UsuariosModal";
import MetasModal from "../components/MetasModal/MetasModal";
import MetasVendedoresModal from "../components/MetasVendedoresModal/MetasVendedoresModal";

import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaBoxes,
    FaReceipt,
    FaTags,
    FaGem
} from "react-icons/fa";

export default function Dashboard() {
    const {
        dados,
        loading,
        usuario,
        inicio,
        fim,
        loja,
        lojas,
        fornecedor,
        fornecedores,
        graficoLoja,
        usuariosAberto,
        metasAberto,
        metasVendedoresAberto,
        setInicio,
        setFim,
        setLoja,
        setFornecedor,
        atualizar,
        registrarGraficoLoja,
        abrirUsuarios,
        fecharUsuarios,
        abrirMetas,
        fecharMetas,
        abrirMetasVendedores,
        fecharMetasVendedores
    } = useDashboard();

    function sair() {
        clearSession();
        window.location.reload();
    }

    if (loading || !dados) {
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
                    onInicioChange={setInicio}
                    onFimChange={setFim}
                    onLojaChange={setLoja}
                    onFornecedorChange={setFornecedor}
                    onRefresh={atualizar}
                    onOpenUsuarios={abrirUsuarios}
                    onOpenMetas={abrirMetas}
                    onOpenMetasVendedores={abrirMetasVendedores}
                    onLogout={sair}
                    graficoLoja={graficoLoja}
                />
                <main className="dashboard">
                    <h2>Carregando dashboard...</h2>
                </main>
            </>
        );
    }

    const resumo = dados.dashboard;
    const meta = dados.metaDashboard;

    const cards = [
        {
            titulo: "Faturamento",
            valor: Number(resumo.faturamento).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }),
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
            valor: Number(resumo.ticket_medio).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }),
            icone: <FaReceipt color="#8E24AA" />
        },
        {
            titulo: "Descontos",
            valor: Number(resumo.desconto_total).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }),
            icone: <FaTags color="#EF6C00" />
        },
        {
            titulo: "Maior Venda",
            valor: Number(resumo.maior_venda).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }),
            icone: <FaGem color="#00ACC1" />
        }
    ];

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
                onInicioChange={setInicio}
                onFimChange={setFim}
                onLojaChange={setLoja}
                onFornecedorChange={setFornecedor}
                onRefresh={atualizar}
                onOpenUsuarios={abrirUsuarios}
                onOpenMetas={abrirMetas}
                onOpenMetasVendedores={abrirMetasVendedores}
                onLogout={sair}
                graficoLoja={graficoLoja}
            />

            <main className="dashboard">
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
                        onSnapshot={registrarGraficoLoja}
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
            </main>

            <UsuariosModal aberto={usuariosAberto} fechar={fecharUsuarios} />
            <MetasModal aberto={metasAberto} fechar={fecharMetas} />
            <MetasVendedoresModal
                aberto={metasVendedoresAberto}
                fechar={fecharMetasVendedores}
            />
        </>
    );
}
