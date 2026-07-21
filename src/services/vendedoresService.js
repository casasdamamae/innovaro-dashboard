import api from "./api";

export async function fetchVendedoresPorLoja(loja) {
    const { data } = await api.get(`/vendedores?loja=${loja}`);
    return data;
}
