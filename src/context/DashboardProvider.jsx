import { DashboardContext } from "./dashboardContext";
import { useDashboardController } from "../controllers/useDashboardController";

export default function DashboardProvider({ children }) {
    const controller = useDashboardController();

    return (
        <DashboardContext.Provider value={controller}>
            {children}
        </DashboardContext.Provider>
    );
}