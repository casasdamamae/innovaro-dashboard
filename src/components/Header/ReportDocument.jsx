import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from "@react-pdf/renderer";
import { formatCurrency } from "../../models/formatters";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        backgroundColor: "#FAFAFA",
        fontSize: 12,
        fontFamily: "Helvetica"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        borderBottom: "1px solid #CCC",
        paddingBottom: 10
    },
    logo: {
        width: 110,
        height: "auto"
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#333"
    },
    secaoTitulo: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        marginTop: 10,
        color: "#444"
    },
    tabela: {
        marginTop: 10,
        border: "1px solid #DDD",
        borderRadius: 6
    },
    linha: {
        flexDirection: "row",
        borderBottom: "1px solid #EEE",
        padding: 5
    },
    colunaTitulo: {
        width: "40%",
        fontWeight: "bold",
        color: "#222"
    },
    colunaValor: {
        width: "60%",
        textAlign: "right",
        color: "#444"
    },
    rodape: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 10,
        textAlign: "center",
        color: "#777",
        borderTop: "1px solid #CCC",
        paddingTop: 10
    }
});

export default function ReportDocument({ dados, graficoLoja }) {
    const resumo = dados?.dashboard;

    if (!resumo) {
        return null;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src="/logo-casas.png" style={styles.logo}/>
                    <Image src="/logo-melhor.png" style={styles.logo}/>
                </View>

                <Text style={styles.titulo}>
                    Relatório Oficial — Resumo do Dashboard
                </Text>

                <Text style={styles.secaoTitulo}>Resumo Geral</Text>

                <View style={styles.tabela}>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>Faturamento</Text>
                        <Text style={styles.colunaValor}>
                            {formatCurrency(resumo.faturamento)}
                        </Text>
                    </View>

                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>Pedidos</Text>
                        <Text style={styles.colunaValor}>{resumo.pedidos}</Text>
                    </View>

                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>Itens</Text>
                        <Text style={styles.colunaValor}>{resumo.itens}</Text>
                    </View>

                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>Ticket Médio</Text>
                        <Text style={styles.colunaValor}>
                            {formatCurrency(resumo.ticket_medio)}
                        </Text>
                    </View>

                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>Maior Venda</Text>
                        <Text style={styles.colunaValor}>
                            {formatCurrency(resumo.maior_venda)}
                        </Text>
                    </View>
                </View>

                {graficoLoja ? (
                    <View style={{ marginTop: 15 }}>
                        <Text style={styles.secaoTitulo}>
                            Gráfico — Faturamento por Loja
                        </Text>
                        <Image
                            src={graficoLoja}
                            style={{
                                width: "100%",
                                maxWidth: 500,
                                height: "auto",
                                marginTop: 10
                            }}
                        />
                    </View>
                ) : null}

                {dados.lojas && (
                    <View style={{ marginTop: 190 }}>
                        <Text style={styles.secaoTitulo}>
                            Detalhamento — Faturamento por Loja
                        </Text>

                        <View style={[styles.linha, { backgroundColor: "#EEE" }]}>
                            <Text style={[styles.colunaTitulo, { width: "40%" }]}>
                                Loja
                            </Text>
                            <Text
                                style={[
                                    styles.colunaTitulo,
                                    { width: "30%", textAlign: "right" }
                                ]}
                            >
                                Faturamento
                            </Text>
                            <Text
                                style={[
                                    styles.colunaTitulo,
                                    { width: "30%", textAlign: "right" }
                                ]}
                            >
                                Pedidos
                            </Text>
                        </View>

                        <View style={styles.tabela}>
                            {dados.lojas.map((item, index) => (
                                <View key={index} style={styles.linha}>
                                    <Text style={[styles.colunaValor, { width: "40%" }]}>
                                        {item.loja}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.colunaValor,
                                            { width: "30%", textAlign: "right" }
                                        ]}
                                    >
                                        {formatCurrency(item.faturamento)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.colunaValor,
                                            { width: "30%", textAlign: "right" }
                                        ]}
                                    >
                                        {item.pedidos}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <Text style={styles.rodape}>
                    Documento gerado automaticamente — {new Date().toLocaleDateString("pt-BR")}
                </Text>
            </Page>
        </Document>
    );
}
