import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login/Login";

export default function App() {

    const token = localStorage.getItem("token");

    if (!token) {

        return <Login />;

    }

    return <Dashboard />;

}