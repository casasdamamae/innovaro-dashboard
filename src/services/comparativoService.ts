import api from "./api";
import type { Comparativo } from "../models/types";

export type ModoComparativo = "dia" | "acumulado";

export type FiltrosComparativo = {
    modo: ModoComparativo;
    loja: string;
};

export async function fetchComparativo(params: FiltrosComparativo) {
    const { data } = await api.get<Comparativo>("/comparativo", {
        params: {
            modo: params.modo,
            loja: params.loja
        }
    });

    return data;
}
