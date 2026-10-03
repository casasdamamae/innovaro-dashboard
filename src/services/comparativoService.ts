import api from "./api";
import type { Comparativo } from "../models/types";

export type FiltrosComparativo = {
    inicio: string;
    fim: string;
    loja: string;
};

export async function fetchComparativo(params: FiltrosComparativo) {
    const { data } = await api.get<Comparativo>("/comparativo", {
        params: {
            modo: "acumulado",
            inicio: params.inicio,
            fim: params.fim,
            loja: params.loja
        }
    });

    return data;
}
