import "./Header.css";

import { useState, useEffect, useMemo } from "react";

import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

import {
    FaUsers,
    FaBullseye,
    FaSignOutAlt
} from "react-icons/fa";

import { useDashboard } from "../../context/DashboardContext";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#FAFAFA",
    fontSize: 12,
    fontFamily: "Helvetica"
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottom: "1px solid #CCC",
    paddingBottom: 10
  },

  logo: {
    width: 110,
    height: "auto"
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333"
  },

  secaoTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: "#444"
  },

  tabela: {
    marginTop: 10,
    border: "1px solid #DDD",
    borderRadius: 6
  },

  linha: {
    flexDirection: "row",
    borderBottom: "1px solid #EEE",
    padding: 5
  },

  colunaTitulo: {
    width: "40%",
    fontWeight: "bold",
    color: "#222"
  },

  colunaValor: {
    width: "60%",
    textAlign: "right",
    color: "#444"
  },

  rodape: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: "center",
    color: "#777",
    borderTop: "1px solid #CCC",
    paddingTop: 10
  }
});

const MeuPDF = ({ dados, graficoLoja }) => {
  const resumo = dados.dashboard;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Cabeçalho com logos */}
        <View style={styles.header}>
          <Image src="/logo-casas.png" style={styles.logo} />
          <Image src="/logo-melhor.png" style={styles.logo} />
        </View>

        {/* Título */}
        <Text style={styles.titulo}>Relatório Oficial — Resumo do Dashboard</Text>

        {/* Seção de resumo */}
        <Text style={styles.secaoTitulo}>Resumo Geral</Text>

        <View style={styles.tabela}>
          <View style={styles.linha}>
            <Text style={styles.colunaTitulo}>Faturamento</Text>
            <Text style={styles.colunaValor}>
              R$ {Number(resumo.faturamento).toLocaleString("pt-BR")}
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.colunaTitulo}>Pedidos</Text>
            <Text style={styles.colunaValor}>{resumo.pedidos}</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.colunaTitulo}>Itens</Text>
            <Text style={styles.colunaValor}>{resumo.itens}</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.colunaTitulo}>Ticket Médio</Text>
            <Text style={styles.colunaValor}>
              R$ {Number(resumo.ticket_medio).toLocaleString("pt-BR")}
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.colunaTitulo}>Maior Venda</Text>
            <Text style={styles.colunaValor}>
              R$ {Number(resumo.maior_venda).toLocaleString("pt-BR")}
            </Text>
          </View>
        </View>

        {graficoLoja && (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.secaoTitulo}>Gráfico — Faturamento por Loja</Text>
            <Image
              src={graficoLoja}
              style={{ width: 500, height: 350, marginTop: 10 }}
            />
          </View>
        )}

        {dados.lojas && (
  <View style={{ marginTop: 190 }}>

    <Text style={styles.secaoTitulo}>Detalhamento — Faturamento por Loja</Text>

    {/* Cabeçalho da tabela */}
    <View style={[styles.linha, { backgroundColor: "#EEE" }]}>
      <Text style={[styles.colunaTitulo, { width: "40%" }]}>Loja</Text>
      <Text style={[styles.colunaTitulo, { width: "30%", textAlign: "right" }]}>Faturamento</Text>
      <Text style={[styles.colunaTitulo, { width: "30%", textAlign: "right" }]}>Pedidos</Text>
    </View>

    {/* Linhas da tabela */}
    <View style={styles.tabela}>
      {dados.lojas.map((item, index) => (
        <View key={index} style={styles.linha}>

          {/* Nome da loja */}
          <Text style={[styles.colunaValor, { width: "40%" }]}>
            {item.loja}
          </Text>

          {/* Faturamento */}
          <Text style={[styles.colunaValor, { width: "30%", textAlign: "right" }]}>
            R$ {Number(item.faturamento).toLocaleString("pt-BR")}
          </Text>

          {/* Pedidos */}
          <Text style={[styles.colunaValor, { width: "30%", textAlign: "right" }]}>
            {item.pedidos}
          </Text>

        </View>
      ))}
    </View>

  </View>
)}

        {/* Rodapé */}
        <Text style={styles.rodape}>
          Documento gerado automaticamente — {new Date().toLocaleDateString("pt-BR")}
        </Text>

      </Page>
    </Document>
  );
};

export default function Header({ graficoLoja }) {

    const {

        dados,
        inicio,
        fim,
        loja,
        lojas,

        fornecedor,
        fornecedores,

        setInicio,
        setFim,
        setLoja,
        setFornecedor,

        atualizar

    } = useDashboard();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const [horaAtual, setHoraAtual] = useState(
    new Date().toLocaleTimeString("pt-BR"));
    useEffect(() => {
    const intervalo = setInterval(() => {
        setHoraAtual(new Date().toLocaleTimeString("pt-BR"));
    }, 1000);

    return () => clearInterval(intervalo);
}, []);

    const ehAdmin = usuario?.nivel === "ADMIN";

    const pdfDocument = useMemo(
    () => <MeuPDF dados={dados} graficoLoja={graficoLoja} />,
    [dados, graficoLoja]
);


    function telaCheia() {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    }

    function abrirUsuarios() {

        window.dispatchEvent(new Event("abrirUsuarios"));

    }

    function abrirMetasVendedores() {

    window.dispatchEvent(

        new Event("abrirMetasVendedores")

    );

}

    function abrirMetas() {

    window.dispatchEvent(new Event("abrirMetas"));

    }

    function sair() {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.reload();

    }

    return (

        <header className="header">

            <div className="header-top">

                <div className="logo">

                    <img
                        src="/logo-casas.png"
                        alt="Casas da Mamãe"
                        className="logo-casas"
                    />

                    <div className="divisor"></div>

                    <img
                        src="/logo-melhor.png"
                        alt="Melhor das Casas"
                        className="logo-melhor"
                    />

                </div>

                <div className="header-info">

                    <span>

                        👤 {usuario?.usuario || "Admin"}

                    </span>

                    <strong>

                        {horaAtual}

                    </strong>

                </div>

            </div>

            <div className="header-filtros">

                <div className="campo">

                    <label>Data Inicial</label>

                    <input
                        type="date"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                    />

                </div>

                <div className="campo">

                    <label>Data Final</label>

                    <input
                        type="date"
                        value={fim}
                        onChange={(e) => setFim(e.target.value)}
                    />

                </div>

                <div className="campo">

                    <label>Loja</label>

                    <select
                        value={loja}
                        onChange={(e) => setLoja(e.target.value)}
                    >

                        {

                            lojas.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {item.nome}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="campo">

                     <label>Fornecedor</label>

                     <select
                         value={fornecedor}
                         onChange={(e) => setFornecedor(e.target.value)}
                     >

                         {

                             fornecedores.map((item) => (

                                 <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {item.nome}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="botoes-header">

                    <button onClick={atualizar}>

                        🔄 Atualizar

                    </button>

{

    ehAdmin && (

        <>

            <button onClick={abrirUsuarios}>

                <FaUsers />

                &nbsp;Usuários

            </button>

            <button onClick={abrirMetas}>

                <FaBullseye />

                &nbsp;Metas

            </button>

        </>

    )

}

{

    ehAdmin && (

        <button onClick={abrirMetasVendedores}>

            🎯&nbsp;Metas Vendedores

        </button>

    )

}

<PDFDownloadLink
        document={pdfDocument}
        fileName={`RELATÓRIO - ${new Date().toLocaleDateString("pt-BR")}.pdf`}
    >
        {({ loading }) => (
            <button className="btn-pdf">
                {loading ? "Gerando PDF..." : "📄 Exportar PDF"}
            </button>
        )}
    </PDFDownloadLink>

                    <button
                        className="btn-fullscreen"
                        onClick={telaCheia}
                    >

                        📺 Tela Cheia

                    </button>

                    <button onClick={sair}>

                        <FaSignOutAlt />

                        &nbsp;Sair

                    </button>

                </div>

            </div>

        </header>

    );

}