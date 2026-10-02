import "./Header.css";

import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaUsers, FaBullseye, FaSignOutAlt, FaChartBar } from "react-icons/fa";

import ReportDocument from "./ReportDocument";
import SeletorData from "./SeletorData";
import SeletorPainel from "../../pages/Metas/SeletorPainel";
import { nomeLojaExibicao } from "../../models/nomeLoja";
import type { OpcaoFiltro, Resumo, UsuarioSessao } from "../../models/types";

export type SecaoPainel = "dashboard" | "usuarios" | "metas";

const DESTINOS: Record<SecaoPainel, SecaoPainel[]> = {
    dashboard: ["usuarios", "metas"],
    usuarios: ["dashboard", "metas"],
    metas: ["usuarios", "dashboard"]
};

type HeaderProps = {
    usuario: UsuarioSessao | null;
    dados: Resumo | null;
    graficoLoja: string | null;
    inicio: string;
    fim: string;
    loja: string;
    lojas: OpcaoFiltro[];
    fornecedor: string;
    fornecedores: OpcaoFiltro[];
    setor: string;
    setores: OpcaoFiltro[];
    onInicioChange: (valor: string) => void;
    onFimChange: (valor: string) => void;
    onLojaChange: (valor: string) => void;
    onFornecedorChange: (valor: string) => void;
    onSetorChange: (valor: string) => void;
    isRefreshing?: boolean;
    onRefresh: () => void;
    secao: SecaoPainel;
    onSelecionarSecao: (secao: SecaoPainel) => void;
    onLogout: () => void;
};

export default function Header({
    usuario,
    dados,
    graficoLoja,
    inicio,
    fim,
    loja,
    lojas,
    fornecedor,
    fornecedores,
    setor,
    setores,
    onInicioChange,
    onFimChange,
    onLojaChange,
    onFornecedorChange,
    onSetorChange,
    isRefreshing = false,
    onRefresh,
    secao,
    onSelecionarSecao,
    onLogout
}: HeaderProps) {
    const [horaAtual, setHoraAtual] = useState(
        new Date().toLocaleTimeString("pt-BR")
    );

    useEffect(() => {
        const intervalo = setInterval(() => {
            setHoraAtual(new Date().toLocaleTimeString("pt-BR"));
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    const ehAdmin = usuario?.nivel === "ADMIN";

    const pdfDocument = useMemo(
        () => <ReportDocument dados={dados} graficoLoja={graficoLoja} />,
        [dados, graficoLoja]
    );

    function telaCheia() {
        if (!document.fullscreenElement) {
            void document.documentElement.requestFullscreen();
        } else {
            void document.exitFullscreen();
        }
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
                    <span>👤 {usuario?.usuario || "Admin"}</span>
                    <strong>{horaAtual}</strong>
                    {isRefreshing && (
                        <span className="header-atualizando">Atualizando…</span>
                    )}
                </div>
            </div>

            <div className="header-filtros">
                <div className="campo">
                    <label htmlFor="filtro-inicio">Data Inicial</label>
                    <SeletorData
                        id="filtro-inicio"
                        valor={inicio}
                        ariaLabel="Data Inicial"
                        onChange={onInicioChange}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="filtro-fim">Data Final</label>
                    <SeletorData
                        id="filtro-fim"
                        valor={fim}
                        ariaLabel="Data Final"
                        onChange={onFimChange}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="filtro-loja">Loja</label>
                    <SeletorPainel
                        id="filtro-loja"
                        rotulo={nomeLojaExibicao(
                            lojas.find((item) => item.id === loja)?.nome ?? ""
                        )}
                        ariaLabel="Loja"
                        layout="lista"
                        compacto
                        larguraCheia
                        selecionado={loja}
                        onChange={onLojaChange}
                        opcoes={lojas.map((item) => ({
                            id: item.id,
                            rotulo: nomeLojaExibicao(item.nome)
                        }))}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="filtro-fornecedor">Fornecedor</label>
                    <SeletorPainel
                        id="filtro-fornecedor"
                        rotulo={
                            fornecedores.find((item) => item.id === fornecedor)?.nome ?? ""
                        }
                        ariaLabel="Fornecedor"
                        layout="lista"
                        compacto
                        larguraCheia
                        selecionado={fornecedor}
                        onChange={onFornecedorChange}
                        opcoes={fornecedores.map((item) => ({
                            id: item.id,
                            rotulo: item.nome
                        }))}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="filtro-setor">Setor</label>
                    <SeletorPainel
                        id="filtro-setor"
                        rotulo={setores.find((item) => item.id === setor)?.nome ?? ""}
                        ariaLabel="Setor"
                        layout="lista"
                        compacto
                        larguraCheia
                        selecionado={setor}
                        onChange={onSetorChange}
                        opcoes={setores.map((item) => ({
                            id: item.id,
                            rotulo: item.nome
                        }))}
                    />
                </div>

                <div className="botoes-header">
                    <button onClick={onRefresh}>🔄 Atualizar</button>

                    {ehAdmin &&
                        DESTINOS[secao].map((destino) => (
                            <button
                                key={destino}
                                type="button"
                                onClick={() => onSelecionarSecao(destino)}
                            >
                                {destino === "dashboard" && (
                                    <>
                                        <FaChartBar />
                                        &nbsp;Dashboard
                                    </>
                                )}
                                {destino === "usuarios" && (
                                    <>
                                        <FaUsers />
                                        &nbsp;Administração de Usuários
                                    </>
                                )}
                                {destino === "metas" && (
                                    <>
                                        <FaBullseye />
                                        &nbsp;Controle de Metas
                                    </>
                                )}
                            </button>
                        ))}

                    {dados && (
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
                    )}

                    <button className="btn-fullscreen" onClick={telaCheia}>
                        📺 Tela Cheia
                    </button>

                    <button onClick={onLogout}>
                        <FaSignOutAlt />
                        &nbsp;Sair
                    </button>
                </div>
            </div>
        </header>
    );
}
