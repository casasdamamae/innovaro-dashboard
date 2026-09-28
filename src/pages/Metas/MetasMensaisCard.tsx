import { useCallback, useEffect, useState } from "react";
import { fetchLojas } from "../../services/usersService";
import { fetchMetasMensais, saveMetasMensais } from "../../services/goalsService";
import type { MetaMensalForm } from "../../models/types";
import NavegacaoMes from "./NavegacaoMes";

export default function MetasMensaisCard() {
    const hoje = new Date();
    const [metas, setMetas] = useState<MetaMensalForm[]>([]);
    const [ano, setAno] = useState(hoje.getFullYear());
    const [mes, setMes] = useState(hoje.getMonth() + 1);
    const [salvando, setSalvando] = useState(false);

    const carregar = useCallback(async () => {
        try {
            const [lojasData, metasData] = await Promise.all([
                fetchLojas(),
                fetchMetasMensais({ ano, mes })
            ]);

            const lista = lojasData
                .filter((loja) => loja.id !== "TODAS")
                .map((loja) => {
                    const meta = metasData.find((item) => item.loja === loja.id);

                    return {
                        loja: loja.id,
                        nome: loja.nome,
                        ano,
                        mes,
                        meta_mensal: meta?.meta_mensal || 0,
                        abre_sabado: meta?.abre_sabado ?? 1,
                        abre_domingo: meta?.abre_domingo ?? 1,
                        feriados: meta?.feriados ?? 0
                    };
                });

            setMetas(lista);
        } catch (erro) {
            console.error(erro);
            alert("Erro ao carregar metas.");
        }
    }, [ano, mes]);

    async function salvar() {
        setSalvando(true);

        try {
            await saveMetasMensais(metas);
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
            void carregar();
        }, 0);

        return () => clearTimeout(timer);
    }, [carregar]);

    function atualizarMeta(
        index: number,
        campo: "meta_mensal" | "abre_sabado" | "abre_domingo" | "feriados",
        valor: number
    ) {
        setMetas((lista) =>
            lista.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [campo]: valor } : item
            )
        );
    }

    return (
        <article className="metas-card">
            <h3>🎯 Metas Mensais</h3>

            <NavegacaoMes
                ano={ano}
                mes={mes}
                onChange={(novoAno, novoMes) => {
                    setAno(novoAno);
                    setMes(novoMes);
                }}
            />

            <div className="metas-tabela">
                <table>
                    <thead>
                        <tr>
                            <th>Loja</th>
                            <th>Meta Mensal</th>
                            <th>Sábado</th>
                            <th>Domingo</th>
                            <th>Feriados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metas.map((meta, index) => (
                            <tr key={meta.loja}>
                                <td>{meta.nome}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={meta.meta_mensal}
                                        onChange={(e) =>
                                            atualizarMeta(
                                                index,
                                                "meta_mensal",
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={meta.abre_sabado === 1}
                                        onChange={(e) =>
                                            atualizarMeta(
                                                index,
                                                "abre_sabado",
                                                e.target.checked ? 1 : 0
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={meta.abre_domingo === 1}
                                        onChange={(e) =>
                                            atualizarMeta(
                                                index,
                                                "abre_domingo",
                                                e.target.checked ? 1 : 0
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={meta.feriados}
                                        onChange={(e) =>
                                            atualizarMeta(
                                                index,
                                                "feriados",
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="metas-salvar">
                <button type="button" onClick={() => void salvar()} disabled={salvando}>
                    💾 Salvar Alterações
                </button>
            </div>
        </article>
    );
}
