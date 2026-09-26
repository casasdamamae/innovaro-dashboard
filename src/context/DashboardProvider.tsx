import type { ReactNode } from "react";
import { DashboardContext } from "./dashboardContext";
import { useDashboardController } from "../controllers/useDashboardController";

type DashboardProviderProps = {
    children: ReactNode;
};

export default function DashboardProvider({ children }: DashboardProviderProps) {
    const controller = useDashboardController();

    return (
        <DashboardContext.Provider value={controller}>
            {children}
        </DashboardContext.Provider>
    );
}
