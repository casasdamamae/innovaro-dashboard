export function formatCurrency(value) {
    return Number(value ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export function formatNumber(value) {
    return Number(value ?? 0).toLocaleString("pt-BR");
}

export function formatPercent(value) {
    return Number(value ?? 0).toFixed(2);
}

export function formatStatusLabel(status) {
    return String(status ?? "").replaceAll("_", " ");
}
