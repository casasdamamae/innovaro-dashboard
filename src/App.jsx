import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login/Login";
import DashboardProvider from "./context/DashboardProvider";
import { hasSession } from "./models/session";

export default function App() {
    if (!hasSession()) {
        return <Login />;
    }

    return (
        <DashboardProvider>
            <Dashboard />
        </DashboardProvider>
    );
}
