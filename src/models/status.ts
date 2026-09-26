import type { StatusDados } from "./types";

const CAMPOS_STATUS = [
    "registros",
    "pedidos",
    "lojas",
    "produtos",
    "vendedores",
    "fornecedores",
    "ultima_data"
] as const satisfies readonly (keyof StatusDados)[];

export function marcadorStatus(
    statusDados: Partial<StatusDados> | null | undefined
) {
    if (!statusDados || typeof statusDados !== "object") return null;

    const presente = CAMPOS_STATUS.some((campo) => statusDados[campo] !== undefined);

    if (!presente) return null;

    const marcador: Record<(typeof CAMPOS_STATUS)[number], string | number | null> = {
        registros: null,
        pedidos: null,
        lojas: null,
        produtos: null,
        vendedores: null,
        fornecedores: null,
        ultima_data: null
    };

    for (const campo of CAMPOS_STATUS) {
        marcador[campo] = statusDados[campo] ?? null;
    }

    return JSON.stringify(marcador);
}
