import api from "./api";
import type { PaginaVendedores } from "../models/types";

export const LIMITE_VENDEDORES = 20;

export async function fetchVendedoresPorLoja(
    loja: string,
    pagina = 1,
    limite = LIMITE_VENDEDORES
) {
    const { data } = await api.get<PaginaVendedores>("/vendedores", {
        params: { loja, pagina, limite }
    });
    return data;
}
