import "./ConfirmacaoModal.css";

type ConfirmacaoModalProps = {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    confirmando?: boolean;
    onConfirmar: () => void;
    onCancelar: () => void;
};

export default function ConfirmacaoModal({
    aberto,
    titulo,
    mensagem,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    confirmando = false,
    onConfirmar,
    onCancelar
}: ConfirmacaoModalProps) {
    if (!aberto) return null;

    return (
        <div
            className="confirmacao-overlay"
            onClick={() => {
                if (!confirmando) onCancelar();
            }}
        >
            <div
                className="confirmacao-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmacao-titulo"
                onClick={(evento) => evento.stopPropagation()}
            >
                <h2 id="confirmacao-titulo">{titulo}</h2>
                <p>{mensagem}</p>
                <div className="confirmacao-acoes">
                    <button
                        type="button"
                        className="confirmacao-cancelar"
                        onClick={onCancelar}
                        disabled={confirmando}
                    >
                        {textoCancelar}
                    </button>
                    <button
                        type="button"
                        className="confirmacao-confirmar"
                        onClick={onConfirmar}
                        disabled={confirmando}
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}
