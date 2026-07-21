import { useCallback, useEffect, useState } from "react";
import {
    createUsuario,
    deleteUsuario,
    fetchLojas,
    fetchUsuarios
} from "../../services/usersService";
import "./UsuariosModal.css";

export default function UsuariosModal({ aberto, fechar }) {
    const [lojas, setLojas] = useState([]);
    const [loja, setLoja] = useState("TODAS");

    const [usuarios, setUsuarios] = useState([]);

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [nivel, setNivel] = useState("CONSULTA");

    const [salvando, setSalvando] = useState(false);

    const carregar = useCallback(async () => {
        try {
            const [usuariosData, lojasData] = await Promise.all([
                fetchUsuarios(),
                fetchLojas()
            ]);

            setUsuarios(usuariosData);
            setLojas(lojasData);
        } catch (erro) {
            console.error(erro);
            alert("Erro ao carregar usuários.");
        }
    }, []);

    async function salvar() {
        if (!usuario.trim() || !senha.trim()) {
            alert("Informe usuário e senha.");
            return;
        }

        try {
            setSalvando(true);

            await createUsuario({
                usuario,
                senha,
                nivel,
                loja
            });

            setUsuario("");
            setSenha("");
            setNivel("CONSULTA");
            setLoja("TODAS");

            await carregar();
            alert("Usuário criado com sucesso.");
        } catch (erro) {
            console.error(erro);
            alert(erro.response?.data?.erro || "Erro ao criar usuário.");
        } finally {
            setSalvando(false);
        }
    }

    async function excluir(id) {
        if (!window.confirm("Deseja realmente excluir este usuário?")) {
            return;
        }

        try {
            await deleteUsuario(id);
            await carregar();
        } catch (erro) {
            console.error(erro);
            alert("Erro ao excluir usuário.");
        }
    }

    useEffect(() => {
        if (!aberto) return undefined;

        const timer = setTimeout(() => {
            void carregar();
        }, 0);

        return () => clearTimeout(timer);
    }, [aberto, carregar]);

    if (!aberto) return null;

    return (
        <div className="usuarios-overlay">
            <div className="usuarios-modal">
                <div className="usuarios-topo">
                    <h2>👥 Administração de Usuários</h2>
                    <button onClick={fechar}>✖</button>
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

                    <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                        <option value="ADMIN">ADMIN</option>
                        <option value="CONSULTA">CONSULTA</option>
                    </select>

                    <select value={loja} onChange={(e) => setLoja(e.target.value)}>
                        <option value="TODAS">TODAS</option>
                        {lojas.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.nome}
                            </option>
                        ))}
                    </select>

                    <button onClick={salvar} disabled={salvando}>
                        {salvando ? "Salvando..." : "➕ Criar"}
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuário</th>
                            <th>Nível</th>
                            <th>Loja</th>
                            <th>Ativo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.usuario}</td>
                                <td>{u.nivel}</td>
                                <td>{u.loja}</td>
                                <td>{u.ativo ? "✅" : "❌"}</td>
                                <td>
                                    <button onClick={() => excluir(u.id)}>🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
