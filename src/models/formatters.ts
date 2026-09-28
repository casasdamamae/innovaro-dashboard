type ValorFormatavel = number | string | null | undefined;

export function formatCurrency(value: ValorFormatavel) {
    return Number(value ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export function formatNumber(value: ValorFormatavel) {
    return Number(value ?? 0).toLocaleString("pt-BR");
}

export function formatPercent(value: ValorFormatavel) {
    return Number(value ?? 0).toFixed(2);
}
