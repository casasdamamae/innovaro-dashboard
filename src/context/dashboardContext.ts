import { createContext, useContext } from "react";
import type { DashboardController } from "../controllers/useDashboardController";

export const DashboardContext = createContext<DashboardController | null>(null);

export function useDashboard() {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error("useDashboard deve ser usado dentro de DashboardProvider");
    }

    return context;
}
