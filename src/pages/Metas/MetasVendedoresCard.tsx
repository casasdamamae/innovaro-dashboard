import { useCallback, useEffect, useState } from "react";
import { fetchLojas } from "../../services/usersService";
import { fetchMetasVendedores, saveMetasVendedores } from "../../services/goalsService";
import {
    fetchVendedoresPorLoja,
    LIMITE_VENDEDORES
} from "../../services/vendedoresService";
import type { Loja, MetaVendedorForm } from "../../models/types";
import NavegacaoMes from "./NavegacaoMes";

export default function MetasVendedoresCard() {
    const hoje = new Date();
    const [ano, setAno] = useState(hoje.getFullYear());
    const [mes, setMes] = useState(hoje.getMonth() + 1);
    const [lojas, setLojas] = useState<Loja[]>([]);
    const [loja, setLoja] = useState("");
    const [vendedores, setVendedores] = useState<MetaVendedorForm[]>([]);
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [listaCarregada, setListaCarregada] = useState(false);
    const [salvando, setSalvando] = useState(false);

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
            fetchMetasVendedores({ ano, mes, loja })
        ]);

        const lista = paginaVendedores.dados.map((vendedor) => {
            const meta = metasData.find(
                (item) => item.codigo_vendedor === vendedor.codigo_vendedor
            );

            return {
                ano,
                mes,
                codigo_loja: loja,
                codigo_vendedor: vendedor.codigo_vendedor,
                nome_vendedor: vendedor.nome_vendedor,
                meta: meta?.meta || 0
            };
        });

        setVendedores(lista);
        setTotal(paginaVendedores.total);
        setTotalPaginas(paginaVendedores.totalPaginas);
        setListaCarregada(true);
    }, [ano, mes, loja, pagina]);

    async function salvar() {
        setSalvando(true);

        try {
            await saveMetasVendedores(vendedores);
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

    return (
        <article className="metas-card">
            <h3>👤 Metas Vendedores</h3>

            <NavegacaoMes
                ano={ano}
                mes={mes}
                onChange={(novoAno, novoMes) => {
                    setAno(novoAno);
                    setMes(novoMes);
                }}
            />

            <label className="metas-loja">
                Loja
                <select
                    value={loja}
                    onChange={(e) => {
                        setLoja(e.target.value);
                        setPagina(1);
                    }}
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

            <div className="metas-paginacao">
                <p>
                    {total} vendedores · Página {Math.max(pagina, 1)} de{" "}
                    {Math.max(totalPaginas, 1)}
                </p>
                <div className="metas-paginacao-botoes">
                    <button
                        type="button"
                        onClick={() => setPagina((atual) => atual - 1)}
                        disabled={pagina <= 1}
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        onClick={() => setPagina((atual) => atual + 1)}
                        disabled={pagina >= totalPaginas}
                    >
                        Próxima
                    </button>
                </div>
            </div>

            <div className="metas-salvar">
                <button type="button" onClick={() => void salvar()} disabled={salvando}>
                    💾 Salvar Alterações
                </button>
            </div>
        </article>
    );
}
