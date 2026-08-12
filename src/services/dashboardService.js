import api from "./api";

export async function fetchDashboardResumo(params) {
    const { data } = await api.get("/resumo", { params });
    return data;
}

export async function fetchLojasResumo() {
    const { data } = await api.get("/resumo/lojas");
    return data;
}

export async function fetchFornecedoresResumo() {
    const { data } = await api.get("/resumo/fornecedores");
    return data;
}

export async function fetchSetoresResumo() {
    const { data } = await api.get("/resumo/setores");
    return data;
}
