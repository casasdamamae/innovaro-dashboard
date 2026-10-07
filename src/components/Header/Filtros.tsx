import "./Filtros.css";

import { useLocation } from "react-router-dom";

import SeletorData from "./SeletorData";
import SeletorPainel from "../../pages/Metas/SeletorPainel";
import { nomeLojaExibicao } from "../../models/nomeLoja";
import { useDashboard } from "../../context/dashboardContext";

export default function Filtros() {
    const { pathname } = useLocation();
    const {
        inicio,
        fim,
        loja,
        lojas,
        fornecedor,
        fornecedores,
        setor,
        setores,
        setInicio,
        setFim,
        setLoja,
        setFornecedor,
        setSetor
    } = useDashboard();

    const noDashboard = pathname === "/dashboard";
    const noComparativo = pathname === "/comparativo";

    if (!noDashboard && !noComparativo) return null;

    return (
        <div className="filtros">
            {noDashboard && (
                <>
                    <div className="campo">
                        <label htmlFor="filtro-inicio">Data Inicial</label>
                        <SeletorData
                            id="filtro-inicio"
                            valor={inicio}
                            ariaLabel="Data Inicial"
                            onChange={setInicio}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="filtro-fim">Data Final</label>
                        <SeletorData
                            id="filtro-fim"
                            valor={fim}
                            ariaLabel="Data Final"
                            onChange={setFim}
                        />
                    </div>
                </>
            )}

            <div className="campo">
                <label htmlFor="filtro-loja">Loja</label>
                <SeletorPainel
                    id="filtro-loja"
                    rotulo={nomeLojaExibicao(lojas.find((item) => item.id === loja)?.nome ?? "")}
                    ariaLabel="Loja"
                    layout="lista"
                    compacto
                    larguraCheia
                    selecionado={loja}
                    onChange={setLoja}
                    opcoes={lojas.map((item) => ({
                        id: item.id,
                        rotulo: nomeLojaExibicao(item.nome)
                    }))}
                />
            </div>

            {noDashboard && (
                <>
                    <div className="campo">
                        <label htmlFor="filtro-fornecedor">Fornecedor</label>
                        <SeletorPainel
                            id="filtro-fornecedor"
                            rotulo={
                                fornecedores.find((item) => item.id === fornecedor)?.nome ?? ""
                            }
                            ariaLabel="Fornecedor"
                            layout="lista"
                            compacto
                            larguraCheia
                            selecionado={fornecedor}
                            onChange={setFornecedor}
                            opcoes={fornecedores.map((item) => ({
                                id: item.id,
                                rotulo: item.nome
                            }))}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="filtro-setor">Setor</label>
                        <SeletorPainel
                            id="filtro-setor"
                            rotulo={setores.find((item) => item.id === setor)?.nome ?? ""}
                            ariaLabel="Setor"
                            layout="lista"
                            compacto
                            larguraCheia
                            selecionado={setor}
                            onChange={setSetor}
                            opcoes={setores.map((item) => ({
                                id: item.id,
                                rotulo: item.nome
                            }))}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
