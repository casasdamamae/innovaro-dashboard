import api from "./api";
import type { Vendedor } from "../models/types";

export async function fetchVendedoresPorLoja(loja: string) {
    const { data } = await api.get<Vendedor[]>(`/vendedores?loja=${loja}`);
    return data;
}
