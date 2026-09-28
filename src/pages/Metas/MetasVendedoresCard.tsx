import { useCallback, useEffect, useState } from "react";
import { fetchLojas } from "../../services/usersService";
import { fetchMetasVendedores, saveMetasVendedores } from "../../services/goalsService";
import {
    fetchVendedoresPorLoja,
    LIMITE_VENDEDORES
} from "../../services/vendedoresService";
import type { Loja, MetaVendedorForm } from "../../models/types";
import ConfirmacaoModal from "../../components/ConfirmacaoModal/ConfirmacaoModal";
import NavegacaoMes, { ANO_METAS } from "./NavegacaoMes";

type Pendencia =
    | { tipo: "mes"; mes: number }
    | { tipo: "pagina"; pagina: number }
    | { tipo: "loja"; loja: string };

function assinatura(lista: MetaVendedorForm[]) {
    return lista.map((item) => `${item.codigo_vendedor}:${item.meta}`).join("|");
}

export default function MetasVendedoresCard() {
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [lojas, setLojas] = useState<Loja[]>([]);
    const [loja, setLoja] = useState("");
    const [vendedores, setVendedores] = useState<MetaVendedorForm[]>([]);
    const [base, setBase] = useState("");
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [listaCarregada, setListaCarregada] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [pendencia, setPendencia] = useState<Pendencia | null>(null);
    const alterado = assinatura(vendedores) !== base;

    const carregarLojas = useCallback(async () => {
        const data = await fetchLojas();
        const todas = data.filter((item) => item.id === "TODAS");
        const demais = data.filter((item) => item.id !== "TODAS");

        setLojas([...demais, ...todas]);
        setLoja((atual) => atual || data[0]?.id || "");
    }, []);

    const carregarVendedores = useCallback(async () => {
        if (!loja) return;

        const [paginaVendedores, metasData] = await Promise.all([
            fetchVendedoresPorLoja(loja, pagina, LIMITE_VENDEDORES),
            fetchMetasVendedores({ ano: ANO_METAS, mes, loja })
        ]);

        const lista = paginaVendedores.dados.map((vendedor) => {
            const meta = metasData.find(
                (item) => item.codigo_vendedor === vendedor.codigo_vendedor
            );

            return {
                ano: ANO_METAS,
                mes,
                codigo_loja: loja,
                codigo_vendedor: vendedor.codigo_vendedor,
                nome_vendedor: vendedor.nome_vendedor,
                meta: meta?.meta || 0
            };
        });

        setVendedores(lista);
        setBase(assinatura(lista));
        setTotal(paginaVendedores.total);
        setTotalPaginas(paginaVendedores.totalPaginas);
        setListaCarregada(true);
    }, [mes, loja, pagina]);

    async function salvar() {
        setSalvando(true);

        try {
            await saveMetasVendedores(vendedores);
            setBase(assinatura(vendedores));
            alert("Metas salvas com sucesso.");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao salvar metas.");
        } finally {
            setSalvando(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            void carregarLojas().catch((erro) => {
                console.error(erro);
                alert("Erro ao carregar metas.");
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [carregarLojas]);

    useEffect(() => {
        if (!loja) return undefined;

        const timer = setTimeout(() => {
            void carregarVendedores().catch((erro) => {
                console.error(erro);
                alert("Erro ao carregar metas.");
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [loja, carregarVendedores]);

    function atualizarMeta(index: number, valor: number) {
        setVendedores((lista) =>
            lista.map((item, itemIndex) =>
                itemIndex === index ? { ...item, meta: valor } : item
            )
        );
    }

    function aplicar(acao: Pendencia) {
        if (acao.tipo === "mes") setMes(acao.mes);
        if (acao.tipo === "pagina") setPagina(acao.pagina);
        if (acao.tipo === "loja") {
            setLoja(acao.loja);
            setPagina(1);
        }
    }

    function solicitar(acao: Pendencia) {
        if (alterado) {
            setPendencia(acao);
            return;
        }

        aplicar(acao);
    }

    function confirmarPendencia() {
        if (!pendencia) return;

        aplicar(pendencia);
        setPendencia(null);
    }

    return (
        <article className="metas-card">
            <div className="metas-card-topo">
                <h3>👤 Metas Vendedores</h3>

                <div className="metas-paginacao">
                    <p>
                        {total} vendedores · Página {Math.max(pagina, 1)} de{" "}
                        {Math.max(totalPaginas, 1)}
                    </p>
                    <div className="metas-paginacao-botoes">
                        <button
                            type="button"
                            onClick={() => solicitar({ tipo: "pagina", pagina: pagina - 1 })}
                            disabled={pagina <= 1}
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            onClick={() => solicitar({ tipo: "pagina", pagina: pagina + 1 })}
                            disabled={pagina >= totalPaginas}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>

            <NavegacaoMes mes={mes} onChange={(novoMes) => solicitar({ tipo: "mes", mes: novoMes })} />

            <label className="metas-loja">
                Loja
                <select
                    value={loja}
                    onChange={(e) => solicitar({ tipo: "loja", loja: e.target.value })}
                >
                    {lojas.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.nome}
                        </option>
                    ))}
                </select>
            </label>

            <div className="metas-tabela">
                <table>
                    <thead>
                        <tr>
                            <th>Vendedor</th>
                            <th>Meta Mensal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaCarregada && vendedores.length === 0 ? (
                            <tr>
                                <td colSpan={2}>Nenhum vendedor nesta página.</td>
                            </tr>
                        ) : (
                            vendedores.map((vendedor, index) => (
                                <tr key={vendedor.codigo_vendedor}>
                                    <td>{vendedor.nome_vendedor}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={vendedor.meta}
                                            onChange={(e) =>
                                                atualizarMeta(index, Number(e.target.value))
                                            }
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="metas-salvar">
                <button type="button" onClick={() => void salvar()} disabled={salvando}>
                    💾 Salvar Alterações
                </button>
            </div>

            <ConfirmacaoModal
                aberto={pendencia !== null}
                titulo="Alterações não salvas"
                mensagem="Há alterações não salvas. Se continuar, elas serão descartadas."
                textoConfirmar="Continuar"
                onConfirmar={confirmarPendencia}
                onCancelar={() => setPendencia(null)}
            />
        </article>
    );
}
