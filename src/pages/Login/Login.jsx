import { useState } from "react";
import api from "../../services/api";
import "./Login.css";

export default function Login() {

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function entrar(e) {

        e.preventDefault();

        setErro("");

        try {

            const { data } = await api.post("/auth/login", {

                usuario,
                senha

            });

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
    
            window.location.reload();

        } catch {

            setErro("Usuário ou senha inválidos.");

        }

    }

    return (

        <div className="login">

            <form
                className="login-box"
                onSubmit={entrar}
            >

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

                {

                    erro && (

                        <span className="erro">

                            {erro}

                        </span>

                    )

                }

                <button>

                    Entrar

                </button>

            </form>

        </div>

    );

}