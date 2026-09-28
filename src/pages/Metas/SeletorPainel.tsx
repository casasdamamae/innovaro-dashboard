import { useEffect, useId, useRef, useState } from "react";

export type OpcaoSeletor = {
    id: string;
    rotulo: string;
};

type SeletorPainelProps = {
    rotulo: string;
    ariaLabel: string;
    layout: "grade" | "lista";
    opcoes: OpcaoSeletor[];
    selecionado: string;
    onChange: (id: string) => void;
    compacto?: boolean;
    ancora?: "centro" | "direita";
};

export default function SeletorPainel({
    rotulo,
    ariaLabel,
    layout,
    opcoes,
    selecionado,
    onChange,
    compacto = false,
    ancora = "centro"
}: SeletorPainelProps) {
    const [aberto, setAberto] = useState(false);
    const raiz = useRef<HTMLDivElement>(null);
    const painelId = useId();

    useEffect(() => {
        if (!aberto) return undefined;

        function fecharNoClique(evento: MouseEvent) {
            if (!raiz.current?.contains(evento.target as Node)) {
                setAberto(false);
            }
        }

        function fecharNoEsc(evento: KeyboardEvent) {
            if (evento.key === "Escape") setAberto(false);
        }

        document.addEventListener("mousedown", fecharNoClique);
        document.addEventListener("keydown", fecharNoEsc);

        return () => {
            document.removeEventListener("mousedown", fecharNoClique);
            document.removeEventListener("keydown", fecharNoEsc);
        };
    }, [aberto]);

    function escolher(id: string) {
        setAberto(false);
        if (id !== selecionado) onChange(id);
    }

    const classePainel = [
        "metas-mes-painel",
        layout === "lista" ? "metas-mes-painel-lista" : "",
        ancora === "direita" ? "metas-mes-painel-direita" : ""
    ]
        .filter(Boolean)
        .join(" ");

    const classeRaiz = ancora === "direita" ? "metas-mes metas-mes-direita" : "metas-mes";
    const classeBotao = compacto ? "metas-mes-botao metas-mes-botao-compacto" : "metas-mes-botao";

    return (
        <div className={classeRaiz} ref={raiz}>
            <button
                type="button"
                className={classeBotao}
                title={compacto ? rotulo : undefined}
                aria-expanded={aberto}
                aria-haspopup="dialog"
                aria-controls={painelId}
                onClick={() => setAberto((atual) => !atual)}
            >
                {compacto ? (
                    <>
                        <span className="metas-mes-botao-rotulo">{rotulo}</span>
                        <span className="metas-mes-botao-caret" aria-hidden="true">
                            ▼
                        </span>
                    </>
                ) : (
                    rotulo
                )}
            </button>

            {aberto && (
                <div className={classePainel} id={painelId} role="dialog" aria-label={ariaLabel}>
                    {opcoes.map((opcao) => {
                        const ativo = opcao.id === selecionado;

                        return (
                            <button
                                key={opcao.id}
                                type="button"
                                className={
                                    ativo
                                        ? "metas-mes-opcao metas-mes-opcao-ativa"
                                        : "metas-mes-opcao"
                                }
                                aria-pressed={ativo}
                                onClick={() => escolher(opcao.id)}
                            >
                                {opcao.rotulo}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
