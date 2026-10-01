import { useEffect, useRef, type KeyboardEvent } from "react";
import { formatBRL, parseBRL, parseInteiro } from "../../models/formatters";

const TECLAS_BLOQUEADAS = new Set(["-", "+", "e", "E", ",", "."]);

type CampoProps = {
    valor: number;
    onChange: (valor: number) => void;
    desabilitado?: boolean;
};

function irParaOFim(campo: HTMLInputElement | null) {
    if (!campo) return;

    const fim = campo.value.length;
    campo.setSelectionRange(fim, fim);
}

function digitosDeCentavos(valor: number) {
    return String(Math.round(Math.max(0, valor) * 100));
}

function bloquearTecla(
    evento: KeyboardEvent<HTMLInputElement>,
    aoApagar: () => void
) {
    if (TECLAS_BLOQUEADAS.has(evento.key)) {
        evento.preventDefault();
        return;
    }

    if (evento.key !== "Backspace") return;

    evento.preventDefault();
    aoApagar();
}

export function CampoMoeda({ valor, onChange, desabilitado = false }: CampoProps) {
    const campo = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (desabilitado) return;

        irParaOFim(campo.current);
    }, [valor, desabilitado]);

    return (
        <input
            ref={campo}
            type="text"
            inputMode="numeric"
            value={formatBRL(valor)}
            disabled={desabilitado}
            onKeyDown={(evento) => {
                if (desabilitado) return;

                bloquearTecla(evento, () => {
                    const digitos = digitosDeCentavos(valor).slice(0, -1);
                    onChange(digitos ? Number(digitos) / 100 : 0);
                });
            }}
            onKeyUp={() => irParaOFim(campo.current)}
            onPaste={(evento) => {
                evento.preventDefault();
                if (desabilitado) return;

                onChange(parseBRL(evento.clipboardData.getData("text")));
            }}
            onChange={(evento) => {
                if (desabilitado) return;

                onChange(parseBRL(evento.target.value));
            }}
            onClick={() => irParaOFim(campo.current)}
        />
    );
}

export function CampoInteiro({ valor, onChange, desabilitado = false }: CampoProps) {
    const campo = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (desabilitado) return;

        irParaOFim(campo.current);
    }, [valor, desabilitado]);

    return (
        <input
            ref={campo}
            type="text"
            inputMode="numeric"
            value={String(valor)}
            disabled={desabilitado}
            onKeyDown={(evento) => {
                if (desabilitado) return;

                bloquearTecla(evento, () => {
                    const digitos = String(Math.max(0, Math.trunc(valor))).slice(0, -1);
                    onChange(digitos ? Number(digitos) : 0);
                });
            }}
            onKeyUp={() => irParaOFim(campo.current)}
            onPaste={(evento) => {
                evento.preventDefault();
                if (desabilitado) return;

                onChange(parseInteiro(evento.clipboardData.getData("text")));
            }}
            onChange={(evento) => {
                if (desabilitado) return;

                onChange(parseInteiro(evento.target.value));
            }}
            onClick={() => irParaOFim(campo.current)}
        />
    );
}
