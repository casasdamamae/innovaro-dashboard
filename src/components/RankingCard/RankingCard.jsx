import "./RankingCard.css";
import { formatCurrency, formatNumber } from "../../models/formatters";

export default function RankingCard({ titulo, dados, nome, valor, extra }) {
    return (
        <div className="ranking-card">
            <h3>{titulo}</h3>
            <div className="ranking-list">
                {dados.map((item, index) => (
                    <div className="ranking-item" key={index}>
                        <div className="ranking-posicao">{index + 1}º</div>

                        <div className="ranking-info">
                            <div className="ranking-nome">{item[nome]}</div>
                            {extra && (
                                <div className="ranking-extra">
                                    {formatNumber(item[extra])} un.
                                </div>
                            )}
                        </div>

                        <div className="ranking-valor">
                            {valor === "quantidade"
                                ? `${formatNumber(item[valor])} un.`
                                : formatCurrency(item[valor])}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
