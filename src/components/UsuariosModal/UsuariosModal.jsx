import { useEffect, useState } from "react";
import api from "../../services/api";
import "./UsuariosModal.css";

export default function UsuariosModal({ aberto, fechar }) {

    const [usuarios, setUsuarios] = useState([]);

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [nivel, setNivel] = useState("CONSULTA");

    async function carregar() {

        const token = localStorage.getItem("token");

        const { data } = await api.get("/usuarios", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        setUsuarios(data);

    }

    async function salvar() {

        if (!usuario || !senha) {

            alert("Informe usuário e senha.");

            return;

        }

        const token = localStorage.getItem("token");

        await api.post(

            "/usuarios",

            {

                usuario,
                senha,
                nivel

            },

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        setUsuario("");
        setSenha("");
        setNivel("CONSULTA");

        carregar();

    }

    async function excluir(id) {

        if (!window.confirm("Excluir usuário?")) return;

        const token = localStorage.getItem("token");

        await api.delete(`/usuarios/${id}`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        carregar();

    }

    useEffect(() => {

        if (aberto) {

            carregar();

        }

    }, [aberto]);

    if (!aberto) return null;

    return (

        <div className="usuarios-overlay">

            <div className="usuarios-modal">

                <div className="usuarios-topo">

                    <h2>👥 Administração de Usuários</h2>

                    <button onClick={fechar}>

                        ✖

                    </button>

                </div>

                <div className="novo-usuario">

                    <input
                        placeholder="Usuário"
                        value={usuario}
                        onChange={(e)=>setUsuario(e.target.value)}
                    />

                    <input
                        placeholder="Senha"
                        value={senha}
                        onChange={(e)=>setSenha(e.target.value)}
                    />

                    <select
                        value={nivel}
                        onChange={(e)=>setNivel(e.target.value)}
                    >

                        <option value="ADMIN">

                            ADMIN

                        </option>

                        <option value="CONSULTA">

                            CONSULTA

                        </option>

                    </select>

                    <button onClick={salvar}>

                        ➕ Criar

                    </button>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Usuário</th>

                            <th>Nível</th>

                            <th>Ativo</th>

                            <th>Ações</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            usuarios.map((u)=>(

                                <tr key={u.id}>

                                    <td>{u.id}</td>

                                    <td>{u.usuario}</td>

                                    <td>{u.nivel}</td>

                                    <td>

                                        {

                                            u.ativo

                                                ? "✅"

                                                : "❌"

                                        }

                                    </td>

                                    <td>

                                        <button
                                            onClick={()=>excluir(u.id)}
                                        >

                                            🗑

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}