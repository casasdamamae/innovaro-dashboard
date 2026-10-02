import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import "./SeletorData.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

type SeletorDataProps = {
    id: string;
    valor: string;
    ariaLabel: string;
    onChange: (valor: string) => void;
};

function semHora(data: Date) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function parseISO(valor: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
    if (!match) return null;

    const data = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (
        data.getFullYear() !== Number(match[1]) ||
        data.getMonth() !== Number(match[2]) - 1 ||
        data.getDate() !== Number(match[3])
    ) {
        return null;
    }

    return data;
}

function formatISO(data: Date) {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${data.getFullYear()}-${mes}-${dia}`;
}

function formatExibicao(valor: string) {
    const data = parseISO(valor);
    if (!data) return "";

    return data.toLocaleDateString("pt-BR");
}

function tituloMes(ano: number, mes: number) {
    const nome = new Date(ano, mes, 1).toLocaleString("pt-BR", { month: "long" });
    return `${nome.charAt(0).toLocaleUpperCase("pt-BR")}${nome.slice(1)} ${ano}`;
}

function mesmoDia(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function gradeDoMes(ano: number, mes: number) {
    const inicio = new Date(ano, mes, 1);
    const cursor = new Date(ano, mes, 1 - inicio.getDay());
    const dias: Date[] = [];

    for (let indice = 0; indice < 42; indice += 1) {
        dias.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return dias;
}

export default function SeletorData({ id, valor, ariaLabel, onChange }: SeletorDataProps) {
    const raiz = useRef<HTMLDivElement>(null);
    const campo = useRef<HTMLButtonElement>(null);
    const painelId = useId();
    const [aberto, setAberto] = useState(false);
    const [ano, setAno] = useState(() => new Date().getFullYear());
    const [mes, setMes] = useState(() => new Date().getMonth());
    const [foco, setFoco] = useState("");

    const selecionada = parseISO(valor);
    const hoje = semHora(new Date());
    const dias = gradeDoMes(ano, mes);

    useEffect(() => {
        if (!aberto) return undefined;

        function fecharNoClique(evento: MouseEvent) {
            if (!raiz.current?.contains(evento.target as Node)) {
                setAberto(false);
            }
        }

        function fecharNoEsc(evento: globalThis.KeyboardEvent) {
            if (evento.key !== "Escape") return;

            setAberto(false);
            campo.current?.focus();
        }

        document.addEventListener("mousedown", fecharNoClique);
        document.addEventListener("keydown", fecharNoEsc);

        return () => {
            document.removeEventListener("mousedown", fecharNoClique);
            document.removeEventListener("keydown", fecharNoEsc);
        };
    }, [aberto]);

    useEffect(() => {
        if (!aberto) return;

        raiz.current?.querySelector<HTMLButtonElement>("[data-foco='true']")?.focus();
    }, [aberto, foco, ano, mes]);

    function abrir() {
        const base = selecionada ?? hoje;
        setAno(base.getFullYear());
        setMes(base.getMonth());
        setFoco(formatISO(base));
        setAberto(true);
    }

    function alternar() {
        if (aberto) {
            setAberto(false);
            return;
        }

        abrir();
    }

    function escolher(iso: string) {
        setAberto(false);
        campo.current?.focus();
        if (iso !== valor) onChange(iso);
    }

    function mudarMes(delta: number) {
        const atual = new Date(ano, mes + delta, 1);
        const diaAtual = parseISO(foco)?.getDate() ?? 1;
        const ultimo = new Date(atual.getFullYear(), atual.getMonth() + 1, 0).getDate();
        const proximo = new Date(
            atual.getFullYear(),
            atual.getMonth(),
            Math.min(diaAtual, ultimo)
        );

        setAno(proximo.getFullYear());
        setMes(proximo.getMonth());
        setFoco(formatISO(proximo));
    }

    function moverFoco(diasDeslocamento: number) {
        const base = parseISO(foco) ?? selecionada ?? hoje;
        const proximo = new Date(base);
        proximo.setDate(proximo.getDate() + diasDeslocamento);
        setAno(proximo.getFullYear());
        setMes(proximo.getMonth());
        setFoco(formatISO(proximo));
    }

    function teclaDoDia(evento: KeyboardEvent<HTMLButtonElement>, iso: string) {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            escolher(iso);
            return;
        }

        const deslocamento: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -7,
            ArrowDown: 7
        };
        const diasDeslocamento = deslocamento[evento.key];

        if (diasDeslocamento === undefined) return;

        evento.preventDefault();
        moverFoco(diasDeslocamento);
    }

    return (
        <div className="seletor-data metas-mes metas-mes-bloco" ref={raiz}>
            <button
                ref={campo}
                id={id}
                type="button"
                className="seletor-data-campo metas-mes-botao metas-mes-botao-compacto"
                aria-label={ariaLabel}
                aria-expanded={aberto}
                aria-haspopup="dialog"
                aria-controls={painelId}
                onClick={alternar}
                onKeyDown={(evento) => {
                    if (evento.key === "ArrowDown" && !aberto) {
                        evento.preventDefault();
                        abrir();
                    }
                }}
            >
                <span className="metas-mes-botao-rotulo">{formatExibicao(valor)}</span>
                <span className="metas-mes-botao-caret" aria-hidden="true">
                    <Calendar size={18} strokeWidth={2.5} />
                </span>
            </button>

            {aberto && (
                <div
                    className="seletor-data-painel"
                    id={painelId}
                    role="dialog"
                    aria-label={ariaLabel}
                >
                    <div className="seletor-data-cabeca">
                        <button
                            type="button"
                            className="seletor-data-nav"
                            aria-label="Mês anterior"
                            onClick={() => mudarMes(-1)}
                        >
                            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                        <strong>{tituloMes(ano, mes)}</strong>
                        <button
                            type="button"
                            className="seletor-data-nav"
                            aria-label="Próximo mês"
                            onClick={() => mudarMes(1)}
                        >
                            <ChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                    </div>

                    <div className="seletor-data-semana" aria-hidden="true">
                        {DIAS_SEMANA.map((dia, indice) => (
                            <span key={`${dia}-${indice}`}>{dia}</span>
                        ))}
                    </div>

                    <div className="seletor-data-grade" role="grid">
                        {Array.from({ length: 6 }, (_, semana) => (
                            <div className="seletor-data-linha" role="row" key={semana}>
                                {dias.slice(semana * 7, semana * 7 + 7).map((dia) => {
                                    const iso = formatISO(dia);
                                    const selecionado = selecionada
                                        ? mesmoDia(dia, selecionada)
                                        : false;
                                    const ehHoje = mesmoDia(dia, hoje);
                                    const outroMes = dia.getMonth() !== mes;
                                    const focado = iso === foco;
                                    const classes = [
                                        "seletor-data-dia",
                                        outroMes ? "seletor-data-dia-outro" : "",
                                        ehHoje && !selecionado ? "seletor-data-dia-hoje" : "",
                                        selecionado ? "seletor-data-dia-selecionado" : ""
                                    ]
                                        .filter(Boolean)
                                        .join(" ");

                                    return (
                                        <button
                                            key={iso}
                                            type="button"
                                            role="gridcell"
                                            className={classes}
                                            tabIndex={focado ? 0 : -1}
                                            data-foco={focado ? "true" : undefined}
                                            aria-selected={selecionado}
                                            aria-current={ehHoje ? "date" : undefined}
                                            onClick={() => escolher(iso)}
                                            onKeyDown={(evento) => teclaDoDia(evento, iso)}
                                        >
                                            {dia.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="seletor-data-rodape">
                        <button
                            type="button"
                            className="seletor-data-acao"
                            onClick={() => escolher(formatISO(hoje))}
                        >
                            Hoje
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
