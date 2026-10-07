import "./Header.css";

import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";

import ReportDocument from "./ReportDocument";
import { useDashboard } from "../../context/dashboardContext";

const LINKS = [
    { to: "/dashboard", rotulo: "Dashboard" },
    { to: "/usuarios", rotulo: "Administração de Usuários" },
    { to: "/metas", rotulo: "Controle de Metas" },
    { to: "/comparativo", rotulo: "Comparativo" }
];

type HeaderProps = {
    onRefresh: () => void;
    onLogout: () => void;
};

export default function Header({ onRefresh, onLogout }: HeaderProps) {
    const { usuario, dados, graficoLoja, isRefreshing } = useDashboard();
    const { pathname } = useLocation();
    const [menuAberto, setMenuAberto] = useState(false);
    const ehAdmin = usuario?.nivel === "ADMIN";

    const pdfDocument = useMemo(
        () => <ReportDocument dados={dados} graficoLoja={graficoLoja} />,
        [dados, graficoLoja]
    );

    useEffect(() => {
        setMenuAberto(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuAberto) return undefined;

        function fecharNoEsc(evento: KeyboardEvent) {
            if (evento.key === "Escape") setMenuAberto(false);
        }

        document.addEventListener("keydown", fecharNoEsc);
        return () => document.removeEventListener("keydown", fecharNoEsc);
    }, [menuAberto]);

    function telaCheia() {
        if (!document.fullscreenElement) {
            void document.documentElement.requestFullscreen();
        } else {
            void document.exitFullscreen();
        }
    }

    return (
        <header className="navbar">
            <div className="navbar-container">
                <NavLink to="/dashboard" className="navbar-logos" aria-label="Ir para o dashboard">
                    <img src="/logo-casas.png" alt="Casas da Mamãe" />
                    <img src="/logo-melhor.png" alt="Melhor das Casas" />
                </NavLink>

                <button
                    type="button"
                    className="navbar-hamburguer"
                    aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuAberto}
                    aria-controls="menu-principal"
                    onClick={() => setMenuAberto((atual) => !atual)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    id="menu-principal"
                    className={menuAberto ? "navbar-painel aberto" : "navbar-painel"}
                >
                    {ehAdmin && (
                        <nav aria-label="Seções">
                            <ul className="navbar-menu">
                                {LINKS.map((link) => (
                                    <li key={link.to}>
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                isActive ? "navbar-link ativo" : "navbar-link"
                                            }
                                        >
                                            {link.rotulo}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    <div className="navbar-acoes">
                        <button
                            type="button"
                            className="navbar-acao"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? "Atualizando…" : "Atualizar"}
                        </button>

                        {dados ? (
                            <PDFDownloadLink
                                document={pdfDocument}
                                fileName={`RELATÓRIO - ${new Date().toLocaleDateString("pt-BR")}.pdf`}
                            >
                                {({ loading }) => (
                                    <button type="button" className="navbar-acao">
                                        {loading ? "Gerando PDF..." : "Exportar PDF"}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        ) : (
                            <button type="button" className="navbar-acao" disabled>
                                Exportar PDF
                            </button>
                        )}

                        <button type="button" className="navbar-acao" onClick={telaCheia}>
                            Tela Cheia
                        </button>
                    </div>

                    <button type="button" className="navbar-sair" onClick={onLogout}>
                        SAIR
                    </button>
                </div>
            </div>
        </header>
    );
}
