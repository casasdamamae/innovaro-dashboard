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

export function formatBRL(valor: number) {
    const seguro = Number.isFinite(valor) ? Math.max(0, valor) : 0;
    const [inteiro, centavos] = seguro.toFixed(2).split(".");
    const milhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `R$ ${milhar},${centavos}`;
}

export function parseBRL(texto: string) {
    const digitos = texto.replace(/\D/g, "");

    if (!digitos) return 0;

    return Number(digitos) / 100;
}

export function parseInteiro(texto: string) {
    const digitos = texto.replace(/\D/g, "");

    if (!digitos) return 0;

    return Number(digitos);
}
