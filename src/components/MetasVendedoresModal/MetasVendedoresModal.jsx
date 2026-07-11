import { useEffect, useState } from "react";
import api from "../../services/api";
import "../MetasModal/MetasModal.css";

export default function MetasVendedoresModal({ aberto, fechar }) {

    const hoje = new Date();

    const [ano, setAno] = useState(hoje.getFullYear());
    const [mes, setMes] = useState(hoje.getMonth() + 1);

    const [lojas, setLojas] = useState([]);
    const [loja, setLoja] = useState("");

    const [vendedores, setVendedores] = useState([]);

    async function carregarLojas() {

        const token = localStorage.getItem("token");

        const { data } = await api.get(

            "/lojas",

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        setLojas(data);

        if (data.length > 0 && !loja) {

            setLoja(data[0].id);

        }

    }

    async function carregarVendedores() {

        if (!loja)
            return;

        const token = localStorage.getItem("token");

        const [resVendedores, resMetas] = await Promise.all([

            api.get(

                `/vendedores?loja=${loja}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            ),

            api.get(

                `/metas-vendedores?ano=${ano}&mes=${mes}&loja=${loja}`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            )

        ]);

        const metas = resMetas.data;

                const lista = resVendedores.data.map((vendedor) => {

            const meta = metas.find(

                m => m.codigo_vendedor === vendedor.codigo_vendedor

            );

            return {

                ano,

                mes,

                codigo_loja: loja,

                codigo_vendedor: vendedor.codigo_vendedor,

                nome_vendedor: vendedor.nome_vendedor,

                meta: meta?.meta || 0

            };

        });

        setVendedores(lista);

    }

    async function salvar() {

        try {

            const token = localStorage.getItem("token");

            await api.post(

                "/metas-vendedores",

                vendedores,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            alert("Metas salvas com sucesso.");

            fechar();

        }

        catch (erro) {

            console.error(erro);

            alert("Erro ao salvar metas.");

        }

    }

    useEffect(() => {

        if (aberto) {

            carregarLojas();

        }

    }, [aberto]);

    useEffect(() => {

        if (aberto && loja) {

            carregarVendedores();

        }

    }, [

        aberto,

        loja,

        ano,

        mes

    ]);

    if (!aberto)
        return null;

    return (

        <div className="usuarios-overlay">

            <div className="usuarios-modal">

                <div className="usuarios-topo">

                    <h2>👤 Metas dos Vendedores</h2>

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

                <div
                    style={{
                        marginBottom: 20
                    }}
                >

                    <label
                        style={{
                            fontWeight: "bold"
                        }}
                    >

                        Loja

                    </label>

                    <select

                        value={loja}

                        onChange={(e) => setLoja(e.target.value)}

                        style={{

                            width: "100%",

                            height: 42,

                            marginTop: 8

                        }}

                    >

                        {

                            lojas.map((l) => (

                                <option

                                    key={l.id}

                                    value={l.id}

                                >

                                    {l.nome}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>Vendedor</th>

                            <th>Meta Mensal</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            vendedores.map((v, index) => (

                                <tr
                                    key={v.codigo_vendedor}
                                >

                                    <td>

                                        {v.nome_vendedor}

                                    </td>

                                    <td>

                                        <input

                                            type="number"

                                            value={v.meta}

                                            onChange={(e) => {

                                                const lista = [...vendedores];

                                                lista[index].meta = Number(

                                                    e.target.value

                                                );

                                                setVendedores(lista);

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