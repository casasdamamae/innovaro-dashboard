import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import "./SeletorData.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const FUSO = "America/Sao_Paulo";

type SeletorDataProps = {
    id: string;
    inicio: string;
    fim: string;
    ariaLabel: string;
    onChange: (inicio: string, fim: string) => void;
};

function hojeSaoPaulo(agora = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: FUSO,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(agora);
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

function ordenar(a: string, b: string): [string, string] {
    return a <= b ? [a, b] : [b, a];
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

export default function SeletorData({ id, inicio, fim, ariaLabel, onChange }: SeletorDataProps) {
    const raiz = useRef<HTMLDivElement>(null);
    const campo = useRef<HTMLButtonElement>(null);
    const painelId = useId();
    const [aberto, setAberto] = useState(false);
    const [ano, setAno] = useState(() => new Date().getFullYear());
    const [mes, setMes] = useState(() => new Date().getMonth());
    const [foco, setFoco] = useState("");
    const [rascunho, setRascunho] = useState<{ inicio: string; fim: string | null } | null>(
        null
    );

    const hojeIso = hojeSaoPaulo();
    const hoje = parseISO(hojeIso) ?? new Date();
    const dias = gradeDoMes(ano, mes);
    const [de, ate] = intervaloVisivel();

    function intervaloVisivel(): [string, string] {
        if (!rascunho) return ordenar(inicio, fim);
        if (!rascunho.fim) return [rascunho.inicio, rascunho.inicio];
        return ordenar(rascunho.inicio, rascunho.fim);
    }

    function aplicar() {
        const [proximoInicio, proximoFim] = intervaloVisivel();
        setRascunho(null);
        setAberto(false);
        campo.current?.focus();

        if (proximoInicio !== inicio || proximoFim !== fim) {
            onChange(proximoInicio, proximoFim);
        }
    }

    function descartar() {
        setRascunho(null);
        setAberto(false);
        campo.current?.focus();
    }

    useEffect(() => {
        if (!aberto) return undefined;

        function fecharNoClique(evento: MouseEvent) {
            if (!raiz.current?.contains(evento.target as Node)) {
                aplicar();
            }
        }

        function fecharNoEsc(evento: globalThis.KeyboardEvent) {
            if (evento.key !== "Escape") return;

            descartar();
        }

        document.addEventListener("mousedown", fecharNoClique);
        document.addEventListener("keydown", fecharNoEsc);

        return () => {
            document.removeEventListener("mousedown", fecharNoClique);
            document.removeEventListener("keydown", fecharNoEsc);
        };
    }, [aberto, rascunho, inicio, fim, onChange]);

    useEffect(() => {
        if (!aberto) return;

        raiz.current?.querySelector<HTMLButtonElement>("[data-foco='true']")?.focus();
    }, [aberto, foco, ano, mes]);

    function abrir() {
        const base = parseISO(inicio) ?? hoje;
        setAno(base.getFullYear());
        setMes(base.getMonth());
        setFoco(formatISO(base));
        setRascunho(null);
        setAberto(true);
    }

    function alternar() {
        if (aberto) {
            aplicar();
            return;
        }

        abrir();
    }

    function escolher(iso: string) {
        if (!rascunho || rascunho.fim) {
            setRascunho({ inicio: iso, fim: null });
            setFoco(iso);
            return;
        }

        setRascunho({ inicio: rascunho.inicio, fim: iso });
        setFoco(iso);
    }

    function marcarHoje() {
        const data = parseISO(hojeIso);

        if (data) {
            setAno(data.getFullYear());
            setMes(data.getMonth());
        }

        escolher(hojeIso);
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
        const base = parseISO(foco) ?? parseISO(inicio) ?? hoje;
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

    const rotulo = inicio === fim
        ? formatExibicao(inicio)
        : `${formatExibicao(inicio)} – ${formatExibicao(fim)}`;

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
                <span className="metas-mes-botao-rotulo">{rotulo}</span>
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
                                    const selecionado = iso === de || iso === ate;
                                    const noIntervalo = iso > de && iso < ate;
                                    const outroMes = dia.getMonth() !== mes;
                                    const focado = iso === foco;
                                    const classes = [
                                        "seletor-data-dia",
                                        outroMes ? "seletor-data-dia-outro" : "",
                                        noIntervalo ? "seletor-data-dia-intervalo" : "",
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
                        <button type="button" className="seletor-data-acao" onClick={marcarHoje}>
                            Hoje
                        </button>
                        <button type="button" className="seletor-data-ok" onClick={aplicar}>
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
