import SeletorPainel from "./SeletorPainel";

export const ANO_METAS = 2026;

export function mesEditavel(mes: number, hoje = new Date()) {
    const anoAtual = hoje.getFullYear();

    if (ANO_METAS !== anoAtual) return ANO_METAS > anoAtual;

    return mes >= hoje.getMonth() + 1;
}

const MESES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

type NavegacaoMesProps = {
    mes: number;
    onChange: (mes: number) => void;
};

export default function NavegacaoMes({ mes, onChange }: NavegacaoMesProps) {
    const nomeMes = MESES[mes - 1] ?? "";

    return (
        <SeletorPainel
            rotulo={`${nomeMes.toLocaleUpperCase("pt-BR")} | ${ANO_METAS}`}
            ariaLabel="Selecionar mês"
            layout="grade"
            selecionado={String(mes)}
            onChange={(id) => onChange(Number(id))}
            opcoes={MESES.map((nome, index) => ({
                id: String(index + 1),
                rotulo: nome
            }))}
        />
    );
}
