import "./Header.css";

import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaUsers, FaBullseye, FaSignOutAlt } from "react-icons/fa";

import ReportDocument from "./ReportDocument";
import type { OpcaoFiltro, Resumo, UsuarioSessao } from "../../models/types";

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
    onOpenUsuarios: () => void;
    onOpenMetas: () => void;
    onOpenMetasVendedores: () => void;
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
    onOpenUsuarios,
    onOpenMetas,
    onOpenMetasVendedores,
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
                    <label>Data Inicial</label>
                    <input
                        type="date"
                        value={inicio}
                        onChange={(e) => onInicioChange(e.target.value)}
                    />
                </div>

                <div className="campo">
                    <label>Data Final</label>
                    <input
                        type="date"
                        value={fim}
                        onChange={(e) => onFimChange(e.target.value)}
                    />
                </div>

                <div className="campo">
                    <label>Loja</label>
                    <select value={loja} onChange={(e) => onLojaChange(e.target.value)}>
                        {lojas.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Fornecedor</label>
                    <select
                        value={fornecedor}
                        onChange={(e) => onFornecedorChange(e.target.value)}
                    >
                        {fornecedores.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Setor</label>
                    <select
                        value={setor}
                        onChange={(e) => onSetorChange(e.target.value)}
                    >
                        {setores.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="botoes-header">
                    <button onClick={onRefresh}>🔄 Atualizar</button>

                    {ehAdmin && (
                        <>
                            <button onClick={onOpenUsuarios}>
                                <FaUsers />
                                &nbsp;Usuários
                            </button>

                            <button onClick={onOpenMetas}>
                                <FaBullseye />
                                &nbsp;Metas
                            </button>

                            <button onClick={onOpenMetasVendedores}>
                                🎯&nbsp;Metas Vendedores
                            </button>
                        </>
                    )}

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
