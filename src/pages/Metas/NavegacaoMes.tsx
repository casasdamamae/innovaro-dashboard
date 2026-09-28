import { useEffect, useId, useRef, useState } from "react";

export const ANO_METAS = 2026;

const MESES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

type NavegacaoMesProps = {
    mes: number;
    onChange: (mes: number) => void;
};

export default function NavegacaoMes({ mes, onChange }: NavegacaoMesProps) {
    const [aberto, setAberto] = useState(false);
    const raiz = useRef<HTMLDivElement>(null);
    const painelId = useId();
    const nomeMes = MESES[mes - 1] ?? "";
    const rotulo = `${nomeMes.toLocaleUpperCase("pt-BR")} | ${ANO_METAS}`;

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

    function escolher(novoMes: number) {
        setAberto(false);
        if (novoMes !== mes) onChange(novoMes);
    }

    return (
        <div className="metas-mes" ref={raiz}>
            <button
                type="button"
                className="metas-mes-botao"
                aria-expanded={aberto}
                aria-haspopup="dialog"
                aria-controls={painelId}
                onClick={() => setAberto((atual) => !atual)}
            >
                {rotulo}
            </button>

            {aberto && (
                <div
                    className="metas-mes-painel"
                    id={painelId}
                    role="dialog"
                    aria-label="Selecionar mês"
                >
                    {MESES.map((nome, index) => {
                        const numero = index + 1;
                        const ativo = numero === mes;

                        return (
                            <button
                                key={nome}
                                type="button"
                                className={
                                    ativo
                                        ? "metas-mes-opcao metas-mes-opcao-ativa"
                                        : "metas-mes-opcao"
                                }
                                aria-pressed={ativo}
                                onClick={() => escolher(numero)}
                            >
                                {nome}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
