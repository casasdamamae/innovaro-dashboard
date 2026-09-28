import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import {
    createUsuario,
    deleteUsuario,
    fetchLojas,
    fetchUsuarios,
    LIMITE_USUARIOS,
    updateUsuario
} from "../../services/usersService";
import { nomeLojaExibicao, ordenarLojas } from "../../models/nomeLoja";
import SeletorPainel from "../Metas/SeletorPainel";
import { getStoredUser } from "../../models/session";
import type {
    AtualizarUsuario,
    ErroApi,
    Loja,
    PaginaUsuarios,
    UsuarioAdmin
} from "../../models/types";
import ConfirmacaoModal from "../../components/ConfirmacaoModal/ConfirmacaoModal";
import "../../components/UsuariosModal/UsuariosModal.css";
import "./Usuarios.css";

function rotuloNivel(nivel: string) {
    if (nivel === "ADMIN") return "Administrador";
    if (nivel === "CONSULTA") return "Apenas Consulta";
    return nivel;
}

function rotuloLoja(codigo: string, lista: Loja[]) {
    const encontrada = lista.find((item) => item.id === codigo);
    if (encontrada) return encontrada.nome;
    if (codigo === "TODAS") return "Todas as Lojas";
    return codigo;
}

export default function Usuarios() {
    const [lojas, setLojas] = useState<Loja[]>([]);
    const [loja, setLoja] = useState("TODAS");

    const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [nivel, setNivel] = useState("CONSULTA");
    const [ativo, setAtivo] = useState<0 | 1>(1);
    const [editandoId, setEditandoId] = useState<string | number | null>(null);

    const [salvando, setSalvando] = useState(false);
    const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<UsuarioAdmin | null>(null);
    const [excluindo, setExcluindo] = useState(false);

    const usuarioLogado = getStoredUser()?.usuario;
    const editandoASiMesmo = editandoId !== null && usuario === usuarioLogado;

    function limparFormulario() {
        setUsuario("");
        setSenha("");
        setNivel("CONSULTA");
        setLoja("TODAS");
        setAtivo(1);
        setEditandoId(null);
    }

    const aplicarPagina = useCallback((resposta: PaginaUsuarios) => {
        setUsuarios(resposta.dados);
        setTotal(resposta.total);
    }, []);

    const carregarUsuarios = useCallback(
        async (paginaAlvo: number) => {
            const resposta = await fetchUsuarios(paginaAlvo, LIMITE_USUARIOS);
            aplicarPagina(resposta);
            return resposta;
        },
        [aplicarPagina]
    );

    function editar(item: UsuarioAdmin) {
        setEditandoId(item.id);
        setUsuario(item.usuario);
        setSenha("");
        setNivel(item.nivel);
        setLoja(item.nivel === "ADMIN" ? "TODAS" : item.loja);
        setAtivo(item.ativo ? 1 : 0);
    }

    async function salvar() {
        if (!editandoId && !usuario.trim()) {
            alert("Informe usuário e senha.");
            return;
        }

        if (!editandoId && !senha.trim()) {
            alert("Informe usuário e senha.");
            return;
        }

        if (editandoASiMesmo && !senha.trim()) {
            alert("Informe a nova senha.");
            return;
        }

        const atualizando = editandoId !== null;

        try {
            setSalvando(true);

            if (editandoId) {
                const payload: AtualizarUsuario = editandoASiMesmo
                    ? { senha: senha.trim() }
                    : { ativo, loja, nivel };
                if (!editandoASiMesmo && senha.trim()) payload.senha = senha.trim();
                await updateUsuario(editandoId, payload);
            } else {
                await createUsuario({
                    usuario,
                    senha,
                    nivel,
                    loja
                });
            }

            limparFormulario();
            await carregarUsuarios(pagina);
            alert(atualizando ? "Usuário atualizado com sucesso." : "Usuário criado com sucesso.");
        } catch (erro) {
            console.error(erro);
            const mensagem = axios.isAxiosError<ErroApi>(erro)
                ? erro.response?.data?.erro
                : undefined;
            alert(
                mensagem ||
                    (atualizando ? "Erro ao atualizar usuário." : "Erro ao criar usuário.")
            );
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!usuarioParaExcluir) return;

        try {
            setExcluindo(true);
            await deleteUsuario(usuarioParaExcluir.id);
            if (editandoId === usuarioParaExcluir.id) limparFormulario();
            setUsuarioParaExcluir(null);
            const resposta = await carregarUsuarios(pagina);

            if (resposta.dados.length === 0 && pagina > 1) {
                setPagina(pagina - 1);
            }
        } catch (erro) {
            console.error(erro);
            alert("Erro ao excluir usuário.");
        } finally {
            setExcluindo(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchLojas()
                .then((data) => setLojas(ordenarLojas(data)))
                .catch((erro) => {
                    console.error(erro);
                    alert("Erro ao carregar lojas.");
                });
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            void carregarUsuarios(pagina).catch((erro) => {
                console.error(erro);
                alert("Erro ao carregar usuários.");
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [pagina, carregarUsuarios]);

    const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_USUARIOS));
    const paginaAtual = Math.min(Math.max(pagina, 1), totalPaginas);
    const naPrimeira = paginaAtual <= 1;
    const naUltima = paginaAtual >= totalPaginas;

    return (
        <section className="usuarios-pagina">
            <h2>👥 Administração de Usuários</h2>

            <div className="usuarios-colunas">
                <div className="usuarios-card usuarios-listagem">
                    <div className="usuarios-paginacao">
                        <p className="usuarios-total">Total: {total}</p>
                        <div className="usuarios-paginacao-controles">
                            <button
                                type="button"
                                aria-label="Primeira página"
                                disabled={naPrimeira}
                                onClick={() => setPagina(1)}
                            >
                                <ChevronFirst size={18} strokeWidth={2.5} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Página anterior"
                                disabled={naPrimeira}
                                onClick={() => setPagina(paginaAtual - 1)}
                            >
                                <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
                            </button>
                            <span className="usuarios-pagina-indicador">
                                {paginaAtual} de {totalPaginas}
                            </span>
                            <button
                                type="button"
                                aria-label="Próxima página"
                                disabled={naUltima}
                                onClick={() => setPagina(paginaAtual + 1)}
                            >
                                <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                aria-label="Última página"
                                disabled={naUltima}
                                onClick={() => setPagina(totalPaginas)}
                            >
                                <ChevronLast size={18} strokeWidth={2.5} aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="usuarios-tabela">
                    <table>
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Nível de Acesso</th>
                                <th>Visibilidade</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.usuario}</td>
                                    <td>{rotuloNivel(u.nivel)}</td>
                                    <td>{rotuloLoja(u.loja, lojas)}</td>
                                    <td>{u.ativo ? "Ativo" : "Inativo"}</td>
                                    <td className="usuarios-acoes">
                                        <button
                                            type="button"
                                            className="usuarios-editar"
                                            onClick={() => editar(u)}
                                        >
                                            ✎
                                        </button>
                                        {u.usuario !== usuarioLogado && (
                                            <button
                                                type="button"
                                                onClick={() => setUsuarioParaExcluir(u)}
                                            >
                                                🗑
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="usuarios-card">
                    <form
                        className="usuarios-formulario"
                        onSubmit={(evento) => {
                            evento.preventDefault();
                            void salvar();
                        }}
                    >
                        <div className="usuarios-campo">
                            <span className="usuarios-campo-titulo">Dados de Login</span>
                            <div className="usuarios-login">
                                <input
                                    placeholder="Nome de Usuário"
                                    value={usuario}
                                    readOnly={editandoId !== null}
                                    onChange={(e) => setUsuario(e.target.value)}
                                />

                                <input
                                    type="password"
                                    placeholder={editandoId ? "Nova senha" : "Senha"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="usuarios-campo">
                            <span className="usuarios-campo-titulo">Nível de Acesso</span>
                            <div className="usuarios-niveis">
                                <label className="usuarios-pilula usuarios-pilula-admin">
                                    <input
                                        type="radio"
                                        name="nivel"
                                        value="ADMIN"
                                        checked={nivel === "ADMIN"}
                                        disabled={editandoASiMesmo}
                                        onChange={() => {
                                            setNivel("ADMIN");
                                            setLoja("TODAS");
                                        }}
                                    />
                                    Administrador
                                </label>
                                <label className="usuarios-pilula usuarios-pilula-consulta">
                                    <input
                                        type="radio"
                                        name="nivel"
                                        value="CONSULTA"
                                        checked={nivel === "CONSULTA"}
                                        disabled={editandoASiMesmo}
                                        onChange={() => setNivel("CONSULTA")}
                                    />
                                    Apenas Consulta
                                </label>
                            </div>
                        </div>

                        <div className="usuarios-campo">
                            <label className="usuarios-campo-titulo" htmlFor="visibilidade">
                                Visibilidade
                            </label>
                            <SeletorPainel
                                id="visibilidade"
                                rotulo={nomeLojaExibicao(
                                    lojas.find((item) => item.id === loja)?.nome ?? ""
                                )}
                                ariaLabel="Visibilidade"
                                layout="lista"
                                compacto
                                larguraCheia
                                desabilitado={nivel === "ADMIN" || editandoASiMesmo}
                                selecionado={loja}
                                onChange={setLoja}
                                opcoes={lojas.map((item) => ({
                                    id: item.id,
                                    rotulo: nomeLojaExibicao(item.nome)
                                }))}
                            />
                        </div>

                        {editandoId !== null && (
                            <div className="usuarios-campo">
                                <span className="usuarios-campo-titulo">Status</span>
                                <div className="usuarios-niveis">
                                    <label className="usuarios-pilula usuarios-pilula-ativo">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="1"
                                            checked={ativo === 1}
                                            disabled={editandoASiMesmo}
                                            onChange={() => setAtivo(1)}
                                        />
                                        Ativo
                                    </label>
                                    <label className="usuarios-pilula usuarios-pilula-inativo">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="0"
                                            checked={ativo === 0}
                                            disabled={editandoASiMesmo}
                                            onChange={() => setAtivo(0)}
                                        />
                                        Inativo
                                    </label>
                                </div>
                            </div>
                        )}

                        {editandoId !== null ? (
                            <div className="usuarios-acoes-form">
                                <button type="submit" disabled={salvando}>
                                    {salvando ? "Salvando..." : "Salvar Alterações"}
                                </button>
                                <button
                                    type="button"
                                    className="usuarios-cancelar"
                                    onClick={limparFormulario}
                                    disabled={salvando}
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <button type="submit" disabled={salvando}>
                                {salvando ? "Salvando..." : "➕ Criar Usuário"}
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <ConfirmacaoModal
                aberto={usuarioParaExcluir !== null}
                titulo="Confirmar exclusão"
                mensagem={`Deseja realmente excluir o usuário ${usuarioParaExcluir?.usuario ?? ""}?`}
                textoConfirmar="Excluir"
                confirmando={excluindo}
                onConfirmar={() => void confirmarExclusao()}
                onCancelar={() => {
                    if (!excluindo) setUsuarioParaExcluir(null);
                }}
            />
        </section>
    );
}
