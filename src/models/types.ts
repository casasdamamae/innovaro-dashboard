export type NivelUsuario = "ADMIN" | "CONSULTA";

export type StatusMeta = "ACIMA_META" | "NO_RITMO" | "ABAIXO_META";

export type UsuarioSessao = {
    usuario: string;
    nivel: NivelUsuario;
};

export type SessaoAuth = {
    accessToken?: string;
    refreshToken?: string;
    usuario?: UsuarioSessao;
};

export type Credenciais = {
    usuario: string;
    senha: string;
};

export type OpcaoFiltro = {
    id: string;
    nome: string;
};

export type FiltrosResumo = {
    inicio: string;
    fim: string;
    loja: string;
    fornecedor: string;
    setor: string;
};

export type DashboardResumo = {
    pedidos: number;
    itens: number;
    faturamento: number;
    ticket_medio: number;
    desconto_total: number;
    maior_venda: number;
    crescimento_faturamento: number;
    faturamento_anterior: number;
};

export type MetaDashboard = {
    meta_mensal: number;
    meta_diaria: number;
    dias_uteis: number;
    dias_decorridos: number;
    meta_esperada: number;
    faturamento: number;
    atingimento: number;
    faltante: number;
    necessario_por_dia: number;
    status: StatusMeta;
};

export type HoraVenda = {
    hora_venda: string;
    faturamento: number;
    pedidos: number;
    itens: number;
};

export type LojaResumo = {
    loja: string;
    faturamento: number;
    pedidos: number;
    itens: number;
    ticket_medio: number;
};

export type SetorResumo = {
    nome_subgrupo: string;
    faturamento: number;
    pedidos?: number;
    percentual?: number;
};

export type VendedorResumo = {
    nome_vendedor: string;
    faturamento: number;
    meta?: number;
    percentual_meta?: number;
};

export type ProdutoResumo = {
    nome_produto: string;
    faturamento?: number;
    quantidade?: number;
};

export type FornecedorResumo = {
    nome_fornecedor: string;
    faturamento: number;
};

export type StatusDados = {
    registros: number;
    pedidos: number;
    lojas: number;
    produtos: number;
    vendedores: number;
    fornecedores: number;
    ultima_data: string;
};

export type Resumo = {
    sucesso: boolean;
    atualizado: string | Date;
    periodo: { inicio: string; fim: string };
    dashboard: DashboardResumo;
    metaDashboard: MetaDashboard;
    horas: HoraVenda[];
    lojas: LojaResumo[];
    cnpjs: unknown[];
    setores: SetorResumo[];
    vendedores: VendedorResumo[];
    produtos: ProdutoResumo[];
    produtosQuantidade: ProdutoResumo[];
    fornecedores: FornecedorResumo[];
    status: StatusDados;
};

export type StatusResponse = {
    sucesso: boolean;
    api: string;
    horario: string;
    dados: StatusDados;
};

export type UsuarioAdmin = {
    id: string | number;
    usuario: string;
    nivel: string;
    loja: string;
    ativo: boolean;
};

export type NovoUsuario = {
    usuario: string;
    senha: string;
    nivel: string;
    loja: string;
};

export type Loja = {
    id: string;
    nome: string;
};

export type MetaMensalSalva = {
    loja: string;
    meta_mensal?: number;
    abre_sabado?: number;
    abre_domingo?: number;
    feriados?: number;
};

export type MetaMensalForm = {
    loja: string;
    nome: string;
    ano: number;
    mes: number;
    meta_mensal: number;
    abre_sabado: number;
    abre_domingo: number;
    feriados: number;
};

export type Vendedor = {
    codigo_vendedor: string | number;
    nome_vendedor: string;
};

export type MetaVendedorSalva = {
    codigo_vendedor: string | number;
    meta?: number;
};

export type MetaVendedorForm = {
    ano: number;
    mes: number;
    codigo_loja: string;
    codigo_vendedor: string | number;
    nome_vendedor: string;
    meta: number;
};

export type ErroApi = {
    erro?: string;
};
