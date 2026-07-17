import { createContext, useContext } from "react";

export const DashboardContext = createContext(null);

export function useDashboard() {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error("useDashboard deve ser usado dentro de DashboardProvider");
    }

    return context;
}
