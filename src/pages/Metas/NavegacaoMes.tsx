type NavegacaoMesProps = {
    ano: number;
    mes: number;
    onChange: (ano: number, mes: number) => void;
};

export default function NavegacaoMes({ ano, mes, onChange }: NavegacaoMesProps) {
    function anterior() {
        if (mes === 1) {
            onChange(ano - 1, 12);
        } else {
            onChange(ano, mes - 1);
        }
    }

    function proximo() {
        if (mes === 12) {
            onChange(ano + 1, 1);
        } else {
            onChange(ano, mes + 1);
        }
    }

    const nomeMes = new Date(ano, mes - 1)
        .toLocaleString("pt-BR", { month: "long" })
        .toLocaleUpperCase("pt-BR");
    const rotulo = `${nomeMes} | ${ano}`;

    return (
        <div className="metas-mes">
            <button type="button" onClick={anterior} aria-label="Mês anterior">
                ◀
            </button>
            <h3>{rotulo}</h3>
            <button type="button" onClick={proximo} aria-label="Próximo mês">
                ▶
            </button>
        </div>
    );
}
