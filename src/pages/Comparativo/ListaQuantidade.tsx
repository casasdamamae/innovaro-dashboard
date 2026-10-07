import "./ListaQuantidade.css";
import { formatCurrency } from "../../models/formatters";

export type ItemQuantidade = {
    nome: string;
    faturamento: number;
};

type ListaQuantidadeProps = {
    titulo: string;
    anoAnterior: string;
    anoVigente: string;
    anteriores: readonly ItemQuantidade[];
    vigentes: readonly ItemQuantidade[];
};

function Coluna({
    ano,
    classeAno,
    itens
}: {
    ano: string;
    classeAno: string;
    itens: readonly ItemQuantidade[];
}) {
    return (
        <div className={`lista-quantidade-coluna ${classeAno}`}>
            <div className="lista-quantidade-ano">{ano}</div>

            <div className="lista-quantidade-rolagem">
                {itens.map((item, index) => (
                    <div className="lista-quantidade-item" key={`${item.nome}-${index}`}>
                        <span className="lista-quantidade-nome">{item.nome}</span>
                        <span className="lista-quantidade-valor">
                            {formatCurrency(item.faturamento)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ListaQuantidade({
    titulo,
    anoAnterior,
    anoVigente,
    anteriores,
    vigentes
}: ListaQuantidadeProps) {
    return (
        <section className="lista-quantidade" aria-label={titulo}>
            <h3>{titulo}</h3>

            <div className="lista-quantidade-colunas">
                <Coluna
                    ano={anoAnterior}
                    classeAno="lista-quantidade-ano-anterior"
                    itens={anteriores}
                />
                <Coluna
                    ano={anoVigente}
                    classeAno="lista-quantidade-ano-vigente"
                    itens={vigentes}
                />
            </div>
        </section>
    );
}
