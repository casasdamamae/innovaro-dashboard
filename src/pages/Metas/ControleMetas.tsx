import MetasMensaisCard from "./MetasMensaisCard";
import MetasVendedoresCard from "./MetasVendedoresCard";
import "../../components/UsuariosModal/UsuariosModal.css";
import "./ControleMetas.css";

export default function ControleMetas() {
    return (
        <section className="metas-pagina">
            <h2>🎯 Controle de Metas</h2>

            <div className="metas-colunas">
                <MetasMensaisCard />
                <MetasVendedoresCard />
            </div>
        </section>
    );
}
