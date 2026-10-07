import { Navigate, Outlet, Route, Routes, useOutletContext } from "react-router-dom";

import DashboardProvider from "./context/DashboardProvider";
import { useDashboard } from "./context/dashboardContext";
import { hasSession } from "./models/session";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Usuarios from "./pages/Usuarios/Usuarios";
import ControleMetas from "./pages/Metas/ControleMetas";
import Comparativo from "./pages/Comparativo/Comparativo";
import PainelLayout, { type ContextoPainel } from "./pages/Painel/PainelLayout";

function RedirecionarRaiz() {
    return <Navigate to={hasSession() ? "/dashboard" : "/login"} replace />;
}

function AreaAutenticada() {
    if (!hasSession()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardProvider>
            <Outlet />
        </DashboardProvider>
    );
}

function RotaAdmin() {
    const { usuario } = useDashboard();
    const contexto = useOutletContext<ContextoPainel>();

    if (usuario?.nivel !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet context={contexto} />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<AreaAutenticada />}>
                <Route element={<PainelLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route element={<RotaAdmin />}>
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/metas" element={<ControleMetas />} />
                        <Route path="/comparativo" element={<Comparativo />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<RedirecionarRaiz />} />
        </Routes>
    );
}
