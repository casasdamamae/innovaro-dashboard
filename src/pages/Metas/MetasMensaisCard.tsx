import { useCallback, useEffect, useState } from "react";
import { fetchLojas } from "../../services/usersService";
import { fetchMetasMensais, saveMetasMensais } from "../../services/goalsService";
import type { MetaMensalForm } from "../../models/types";
import { formatBRL } from "../../models/formatters";
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

    const totalMeta = metas.reduce((soma, item) => soma + item.meta_mensal, 0);
    const totalSabado = metas.filter((item) => item.abre_sabado === 1).length;
    const totalDomingo = metas.filter((item) => item.abre_domingo === 1).length;
    const totalFeriados = metas.reduce((soma, item) => soma + item.feriados, 0);

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
                            <th className="metas-fim-semana-titulo">Fim de Semana</th>
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
                                    <div className="metas-fim-semana">
                                    <button
                                        type="button"
                                        className={
                                            meta.abre_sabado === 1
                                                ? "metas-dia metas-dia-selecionado"
                                                : "metas-dia"
                                        }
                                        aria-pressed={meta.abre_sabado === 1}
                                        onClick={() =>
                                            atualizarMeta(
                                                index,
                                                "abre_sabado",
                                                meta.abre_sabado === 1 ? 0 : 1
                                            )
                                        }
                                    >
                                        Sábado
                                    </button>
                                    <button
                                        type="button"
                                        className={
                                            meta.abre_domingo === 1
                                                ? "metas-dia metas-dia-selecionado"
                                                : "metas-dia"
                                        }
                                        aria-pressed={meta.abre_domingo === 1}
                                        onClick={() =>
                                            atualizarMeta(
                                                index,
                                                "abre_domingo",
                                                meta.abre_domingo === 1 ? 0 : 1
                                            )
                                        }
                                    >
                                        Domingo
                                    </button>
                                    </div>
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
                    {metas.length > 0 && (
                        <tfoot>
                            <tr className="metas-totais">
                                <td>Total</td>
                                <td>
                                    <span className="metas-total-valor">{formatBRL(totalMeta)}</span>
                                </td>
                                <td>
                                    <div className="metas-fim-semana">
                                        <span className="metas-fim-semana-contagem">{totalSabado}</span>
                                        <span className="metas-fim-semana-contagem">{totalDomingo}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="metas-total-valor">{totalFeriados}</span>
                                </td>
                            </tr>
                        </tfoot>
                    )}
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
