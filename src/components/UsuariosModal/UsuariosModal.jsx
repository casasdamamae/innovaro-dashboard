import { useEffect, useState } from "react";
import api from "../../services/api";
import "./UsuariosModal.css";

export default function UsuariosModal({ aberto, fechar }) {

    const [lojas, setLojas] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [lojasSelecionadas, setLojasSelecionadas] = useState([]);
    
    const [usuarios, setUsuarios] = useState([]);

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [nivel, setNivel] = useState("CONSULTA");

    const [salvando, setSalvando] = useState(false);

    async function carregar() {

        try {

            const token = localStorage.getItem("token");

            const { data } = await api.get("/usuarios", {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            setUsuarios(data);

        } catch (erro) {

            console.error(erro);

            alert("Erro ao carregar usuários.");

        }

    }

    async function salvar() {

        if (!usuario.trim() || !senha.trim()) {

            alert("Informe usuário e senha.");

            return;

        }

        try {

            setSalvando(true);

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

            await carregar();

            alert("Usuário criado com sucesso.");

        } catch (erro) {

            console.error(erro);

            alert(

                erro.response?.data?.erro ||

                "Erro ao criar usuário."

            );

        } finally {

            setSalvando(false);

        }

    }

    async function excluir(id) {

        if (!window.confirm("Deseja realmente excluir este usuário?")) {

            return;

        }

        try {

            const token = localStorage.getItem("token");

            await api.delete(

                `/usuarios/${id}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            await carregar();

        } catch (erro) {

            console.error(erro);

            alert("Erro ao excluir usuário.");

        }

    }

    async function carregarLojas() {

    const token = localStorage.getItem("token");

    const { data } = await api.get("/lojas", {

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

    setLojas(data);

}

async function abrirPermissoes(usuario) {

    const token = localStorage.getItem("token");

    const { data } = await api.get(

        `/usuarios/${usuario.id}/lojas`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    setUsuarioSelecionado(usuario);

    setLojasSelecionadas(data);

}

function marcarLoja(id) {

    if(lojasSelecionadas.includes(id)){

        setLojasSelecionadas(

            lojasSelecionadas.filter(x=>x!==id)

        );

    }else{

        setLojasSelecionadas(

            [...lojasSelecionadas,id]

        );

    }

}

async function salvarPermissoes(){

    const token = localStorage.getItem("token");

    await api.put(

        `/usuarios/${usuarioSelecionado.id}/lojas`,

        {

            lojas: lojasSelecionadas

        },

        {

            headers:{

                Authorization:`Bearer ${token}`

            }

        }

    );

    alert("Permissões salvas.");

}

    useEffect(() => {

        if (aberto) {

            carregar();
            carregarLojas();

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

                        onChange={(e) => setUsuario(e.target.value)}

                    />

                    <input

                        type="password"

                        placeholder="Senha"

                        value={senha}

                        onChange={(e) => setSenha(e.target.value)}

                    />

                    <select

                        value={nivel}

                        onChange={(e) => setNivel(e.target.value)}

                    >

                        <option value="ADMIN">

                            ADMIN

                        </option>

                        <option value="CONSULTA">

                            CONSULTA

                        </option>

                    </select>

                    <button

                        onClick={salvar}

                        disabled={salvando}

                    >

                        {

                            salvando

                                ? "Salvando..."

                                : "➕ Criar"

                        }

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

                            usuarios.map((u) => (

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

                                            onClick={() => abrirPermissoes(u)}

                                        >

                                            🏪 Lojas

                                        </button>

                                        <button
                                           onClick={() => excluir(u.id)}
                                        
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