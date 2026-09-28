import { useCallback, useEffect, useState } from "react";
import { fetchLojas } from "../../services/usersService";
import { fetchMetasMensais, saveMetasMensais } from "../../services/goalsService";
import type { MetaMensalForm } from "../../models/types";
import { nomeLojaExibicao } from "../../models/nomeLoja";
import ConfirmacaoModal from "../../components/ConfirmacaoModal/ConfirmacaoModal";
import { CampoInteiro, CampoMoeda } from "./CampoValor";
import NavegacaoMes, { ANO_METAS } from "./NavegacaoMes";

function assinatura(lista: MetaMensalForm[]) {
    return lista
        .map(
            (item) =>
                `${item.loja}:${item.meta_mensal}:${item.abre_sabado}:${item.abre_domingo}:${item.feriados}`
        )
        .join("|");
}

export default function MetasMensaisCard() {
    const [metas, setMetas] = useState<MetaMensalForm[]>([]);
    const [base, setBase] = useState("");
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [mesPendente, setMesPendente] = useState<number | null>(null);
    const [salvando, setSalvando] = useState(false);
    const alterado = assinatura(metas) !== base;

    const carregar = useCallback(async () => {
        try {
            const [lojasData, metasData] = await Promise.all([
                fetchLojas(),
                fetchMetasMensais({ ano: ANO_METAS, mes })
            ]);

            const lista = lojasData
                .filter((loja) => loja.id !== "TODAS")
                .map((loja) => {
                    const meta = metasData.find((item) => item.loja === loja.id);

                    return {
                        loja: loja.id,
                        nome: loja.nome,
                        ano: ANO_METAS,
                        mes,
                        meta_mensal: meta?.meta_mensal || 0,
                        abre_sabado: meta?.abre_sabado ?? 1,
                        abre_domingo: meta?.abre_domingo ?? 1,
                        feriados: meta?.feriados ?? 0
                    };
                });

            setMetas(lista);
            setBase(assinatura(lista));
        } catch (erro) {
            console.error(erro);
            alert("Erro ao carregar metas.");
        }
    }, [mes]);

    async function salvar() {
        setSalvando(true);

        try {
            await saveMetasMensais(metas);
            setBase(assinatura(metas));
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

    function pedirMes(novoMes: number) {
        if (alterado) {
            setMesPendente(novoMes);
            return;
        }

        setMes(novoMes);
    }

    function confirmarMes() {
        if (mesPendente === null) return;

        setMes(mesPendente);
        setMesPendente(null);
    }

    return (
        <article className="metas-card">
            <div className="metas-cabeca">
                <h3>🎯 Metas Mensais</h3>
                <NavegacaoMes mes={mes} onChange={pedirMes} />
            </div>

            <div className="metas-resto">
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
                                <td className="metas-loja-nome">{nomeLojaExibicao(meta.nome)}</td>
                                <td>
                                    <CampoMoeda
                                        valor={meta.meta_mensal}
                                        onChange={(valor) =>
                                            atualizarMeta(index, "meta_mensal", valor)
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
                                    <CampoInteiro
                                        valor={meta.feriados}
                                        onChange={(valor) =>
                                            atualizarMeta(index, "feriados", valor)
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
            </div>

            <ConfirmacaoModal
                aberto={mesPendente !== null}
                titulo="Alterações não salvas"
                mensagem="Há alterações não salvas. Se continuar, elas serão descartadas."
                textoConfirmar="Continuar"
                onConfirmar={confirmarMes}
                onCancelar={() => setMesPendente(null)}
            />
        </article>
    );
}
