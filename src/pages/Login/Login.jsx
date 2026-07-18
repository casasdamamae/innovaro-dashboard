import { useState } from "react";
import { useAuthController } from "../../controllers/useAuthController";
import "./Login.css";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    const { entrar, erro, loading } = useAuthController();

    async function handleSubmit(e) {
        e.preventDefault();

        const autenticado = await entrar({
            usuario,
            senha
        });

        if (autenticado) {
            window.location.reload();
        }
    }

    return (
        <div className="login">
            <form className="login-box" onSubmit={handleSubmit}>
                <div className="login-logo">
                    <img
                        src="/logo-casas.png"
                        alt="Casas da Mamãe"
                        className="login-logo-casas"
                    />

                    <div className="login-divisor"></div>

                    <img
                        src="/logo-melhor.png"
                        alt="Melhor das Casas"
                        className="login-logo-melhor"
                    />
                </div>

                <h2>Business Intelligence</h2>

                <input
                    placeholder="Usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                {erro && <span className="erro">{erro}</span>}

                <button type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}
