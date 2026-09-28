const ROTULOS: Record<string, string> = {
    "sao bernardo": "São Bernardo do Campo",
    "sao bernardo do campo": "São Bernardo do Campo",
    "santo andre": "Santo André",
    maua: "Mauá",
    taboao: "Taboão da Serra",
    "taboao da serra": "Taboão da Serra",
    nilopolis: "Nilópolis",
    "santa cruz": "Santa Cruz",
    madureira: "Madureira",
    mesquita: "Mesquita",
    bonsucesso: "Bonsucesso",
    carioca: "Carioca"
};

function normalizar(valor: string) {
    return valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();
}

function semPrefixo(nome: string) {
    return nome
        .replace(/^\s*casa da mam[aã]e\s+/i, "")
        .replace(/^\s*melhor das casas\s+/i, "")
        .replace(/^\s*mdc\s+/i, "")
        .trim();
}

export function nomeLojaExibicao(nome: string) {
    const limpo = nome.trim();
    const chave = normalizar(limpo);

    if (!chave) return "";
    if (chave === "todas" || chave === "todas as lojas") return limpo;

    const ehMdc = /(?:^|\s)(?:melhor das casas|mdc)(?:\s|$)/.test(chave);
    const resto = normalizar(semPrefixo(limpo));

    if (resto === "sao mateus") {
        return ehMdc ? "MDC São Mateus" : "São Mateus";
    }

    return ROTULOS[resto] ?? semPrefixo(limpo);
}

export function ordenarLojas<T extends { id: string; nome: string }>(lojas: T[]) {
    const ehTodas = (item: T) => {
        const nome = normalizar(item.nome);
        return item.id === "TODAS" || nome === "todas" || nome === "todas as lojas";
    };

    return [...lojas.filter((item) => !ehTodas(item)), ...lojas.filter(ehTodas)];
}
