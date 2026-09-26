import api from "./api";
import type { FiltrosResumo, OpcaoFiltro, Resumo, StatusResponse } from "../models/types";

export async function fetchDashboardResumo(params: FiltrosResumo) {
    const { data } = await api.get<Resumo>("/resumo", { params });
    return data;
}

export async function fetchLojasResumo() {
    const { data } = await api.get<OpcaoFiltro[]>("/resumo/lojas");
    return data;
}

export async function fetchFornecedoresResumo() {
    const { data } = await api.get<OpcaoFiltro[]>("/resumo/fornecedores");
    return data;
}

export async function fetchSetoresResumo() {
    const { data } = await api.get<OpcaoFiltro[]>("/resumo/setores");
    return data;
}

export async function fetchStatus() {
    const { data } = await api.get<StatusResponse>("/status");
    return data;
}
