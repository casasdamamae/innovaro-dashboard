import type { ReactNode } from "react";
import "./Card.css";

type CardProps = {
    titulo: string;
    valor: string;
    subtitulo?: string;
    icone?: ReactNode;
    crescimento?: number;
};

export default function Card({ titulo, valor, subtitulo, icone, crescimento }: CardProps) {
    return (
        <div className="card">
            <div className="card-top">
                <span>{titulo}</span>
                <span className="icone">{icone}</span>
            </div>

            <h1>{valor}</h1>

            {crescimento !== undefined && (
                <div
                    className={`card-crescimento ${
                        crescimento > 0
                            ? "positivo"
                            : crescimento < 0
                              ? "negativo"
                              : "neutro"
                    }`}
                >
                    <span>
                        {crescimento > 0 ? "▲" : crescimento < 0 ? "▼" : "▬"}
                    </span>
                    <span>{Math.abs(crescimento).toFixed(2)}%</span>
                    <small>vs período anterior</small>
                </div>
            )}

            {subtitulo && <small>{subtitulo}</small>}
        </div>
    );
}
