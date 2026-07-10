import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MetasModal.css";

export default function MetasModal({ aberto, fechar }) {

    const [metas, setMetas] = useState([]);
    const hoje = new Date();

    const [ano, setAno] = useState(hoje.getFullYear());
    const [mes, setMes] = useState(hoje.getMonth() + 1);
    

    async function carregar() {

        try {

            const token = localStorage.getItem("token");

            const [resLojas, resMetas] = await Promise.all([

                api.get("/lojas", {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }),

                api.get(`/metas?ano=${ano}&mes=${mes}`, {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                })

            ]);

            const metasExistentes = resMetas.data;

            const lista = resLojas.data.map((loja) => {

                const meta = metasExistentes.find(

                    m => m.loja === loja.id

                );

                return {

                    loja: loja.id,
                    nome: loja.nome,

                    ano,
                    mes,

                    meta_mensal: meta?.meta_mensal || 0,

                    abre_sabado: meta?.abre_sabado ?? 1,

                    abre_domingo: meta?.abre_domingo ?? 1,

                    feriados: meta?.feriados ?? 0

                };

            });

            setMetas(lista);

        } catch (erro) {

            console.error(erro);

            alert("Erro ao carregar metas.");

        }

    }

    async function salvar() {

        try {

            const token = localStorage.getItem("token");

            await api.post(

                "/metas/salvar",

                metas,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            alert("Metas salvas com sucesso.");

            fechar();

        } catch (erro) {

            console.error(erro);

            alert("Erro ao salvar metas.");

        }

    }

    useEffect(() => {

        if (aberto) {

            carregar();

        }

    }, [aberto, ano, mes]);

    if (!aberto) return null;

    return (

        <div className="usuarios-overlay">

            <div className="usuarios-modal">

                <div className="usuarios-topo">

                    <h2>🎯 Metas Mensais</h2>

                    <button onClick={fechar}>

                        ✖

                    </button>

                </div>

                <div
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        marginBottom: 20
    }}
>

    <button
        onClick={() => {

            if (mes === 1) {

                setMes(12);
                setAno(ano - 1);

            } else {

                setMes(mes - 1);

            }

        }}
    >

        ◀

    </button>

    <h3>

        {new Date(ano, mes - 1).toLocaleString("pt-BR", {

            month: "long",
            year: "numeric"

        })}

    </h3>

    <button
        onClick={() => {

            if (mes === 12) {

                setMes(1);
                setAno(ano + 1);

            } else {

                setMes(mes + 1);

            }

        }}
    >

        ▶

    </button>

</div>

                <table>

                    <thead>

                        <tr>

                            <th>Loja</th>

                            <th>Meta Mensal</th>

                            <th>Sábado</th>

                            <th>Domingo</th>

                            <th>Feriados</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            metas.map((m, index) => (

                                <tr key={m.loja}>

                                    <td>

                                        {m.nome}

                                    </td>

                                    <td>

                                        <input

                                            type="number"

                                            value={m.meta_mensal}

                                            onChange={(e) => {

                                                const lista = [...metas];

                                                lista[index].meta_mensal =
                                                    Number(e.target.value);

                                                setMetas(lista);

                                            }}

                                        />

                                    </td>

                                    <td>

                                        <input

                                            type="checkbox"

                                            checked={m.abre_sabado === 1}

                                            onChange={(e) => {

                                                const lista = [...metas];

                                                lista[index].abre_sabado =
                                                    e.target.checked ? 1 : 0;

                                                setMetas(lista);

                                            }}

                                        />

                                    </td>
                                                                        <td>

                                        <input

                                            type="checkbox"

                                            checked={m.abre_domingo === 1}

                                            onChange={(e) => {

                                                const lista = [...metas];

                                                lista[index].abre_domingo =
                                                    e.target.checked ? 1 : 0;

                                                setMetas(lista);

                                            }}

                                        />

                                    </td>

                                    <td>

                                        <input

                                            type="number"

                                            value={m.feriados}

                                            onChange={(e) => {

                                                const lista = [...metas];

                                                lista[index].feriados =
                                                    Number(e.target.value);

                                                setMetas(lista);

                                            }}

                                        />

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                <div

                    style={{

                        marginTop: 20,

                        display: "flex",

                        justifyContent: "flex-end"

                    }}

                >

                    <button

                        onClick={salvar}

                        style={{

                            height: 45,

                            padding: "0 25px"

                        }}

                    >

                        💾 Salvar Tudo

                    </button>

                </div>

            </div>

        </div>

    );

}