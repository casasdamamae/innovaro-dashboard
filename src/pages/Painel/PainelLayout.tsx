import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";
import Filtros from "../../components/Header/Filtros";
import { useDashboard } from "../../context/dashboardContext";
import { encerrarSessao } from "../../models/session";

export type ContextoPainel = {
    versaoComparativo: number;
};

export default function PainelLayout() {
    const { atualizar } = useDashboard();
    const [versaoComparativo, setVersaoComparativo] = useState(0);

    return (
        <>
            <Header
                onRefresh={() => {
                    void atualizar();
                    setVersaoComparativo((atual) => atual + 1);
                }}
                onLogout={encerrarSessao}
            />

            <main className="painel">
                <Filtros />
                <div className="dashboard">
                    <Outlet context={{ versaoComparativo } satisfies ContextoPainel} />
                </div>
            </main>
        </>
    );
}
