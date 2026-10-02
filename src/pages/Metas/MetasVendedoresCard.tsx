import { useCallback, useEffect, useState } from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchLojas } from "../../services/usersService";
import { fetchMetasVendedores, saveMetasVendedores } from "../../services/goalsService";
import {
    fetchVendedoresPorLoja,
    LIMITE_VENDEDORES
} from "../../services/vendedoresService";
import { nomeLojaExibicao, ordenarLojas } from "../../models/nomeLoja";
import type { Loja, MetaVendedorForm } from "../../models/types";
import ConfirmacaoModal from "../../components/ConfirmacaoModal/ConfirmacaoModal";
import { CampoMoeda } from "./CampoValor";
import NavegacaoMes, { ANO_METAS, mesEditavel } from "./NavegacaoMes";
import SeletorPainel from "./SeletorPainel";

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
    const [listaCarregada, setListaCarregada] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [pendencia, setPendencia] = useState<Pendencia | null>(null);
    const alterado = assinatura(vendedores) !== base;
    const somenteLeitura = !mesEditavel(mes);
    const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_VENDEDORES));
    const paginaAtual = Math.min(Math.max(pagina, 1), totalPaginas);
    const naPrimeira = paginaAtual <= 1;
    const naUltima = paginaAtual >= totalPaginas;

    const carregarLojas = useCallback(async () => {
        const data = await fetchLojas();
        setLojas(ordenarLojas(data));
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
        setListaCarregada(true);
    }, [mes, loja, pagina]);

    async function salvar() {
        if (!mesEditavel(mes)) return;

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
        if (!mesEditavel(mes)) return;

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
            <div className="metas-cabeca">
            <div className="metas-card-topo">
                <div className="metas-card-titulo">
                    <h3>👤 Metas Vendedores</h3>
                    <p className="metas-total">Total: {total}</p>
                </div>

                <div className="metas-paginacao">
                    <button
                        type="button"
                        aria-label="Primeira página"
                        disabled={naPrimeira}
                        onClick={() => solicitar({ tipo: "pagina", pagina: 1 })}
                    >
                        <ChevronFirst size={18} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        aria-label="Página anterior"
                        disabled={naPrimeira}
                        onClick={() => solicitar({ tipo: "pagina", pagina: paginaAtual - 1 })}
                    >
                        <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <span className="metas-pagina-indicador">
                        {paginaAtual} de {totalPaginas}
                    </span>
                    <button
                        type="button"
                        aria-label="Próxima página"
                        disabled={naUltima}
                        onClick={() => solicitar({ tipo: "pagina", pagina: paginaAtual + 1 })}
                    >
                        <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        aria-label="Última página"
                        disabled={naUltima}
                        onClick={() => solicitar({ tipo: "pagina", pagina: totalPaginas })}
                    >
                        <ChevronLast size={18} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="metas-linha-mes">
                <div className="metas-linha-mes-lado" />
                <NavegacaoMes
                    mes={mes}
                    onChange={(novoMes) => solicitar({ tipo: "mes", mes: novoMes })}
                />
                <div className="metas-linha-mes-lado">
                    <SeletorPainel
                        rotulo={nomeLojaExibicao(
                            lojas.find((item) => item.id === loja)?.nome ?? ""
                        )}
                        ariaLabel="Selecionar loja"
                        layout="lista"
                        compacto
                        ancora="direita"
                        selecionado={loja}
                        onChange={(id) => solicitar({ tipo: "loja", loja: id })}
                        opcoes={lojas.map((item) => ({
                            id: item.id,
                            rotulo: nomeLojaExibicao(item.nome)
                        }))}
                    />
                </div>
            </div>
            </div>

            <div className="metas-resto">
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
                                        <CampoMoeda
                                            valor={vendedor.meta}
                                            desabilitado={somenteLeitura}
                                            onChange={(valor) => atualizarMeta(index, valor)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="metas-salvar">
                <button
                    type="button"
                    onClick={() => void salvar()}
                    disabled={salvando || somenteLeitura}
                >
                    💾 Salvar Alterações
                </button>
            </div>
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
