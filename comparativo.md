# Comparativo ano vigente x ano anterior

Rota nova para a sessão comparativa do dashboard. O front exibe o JSON. Não recalcula percentual, ticket nem o dia correspondente do ano passado.

`GET /comparativo`

Header igual às outras rotas:

```http
Authorization: Bearer <access_token>
```

## O que pedir

| Query | Obrigatório | Valores |
| --- | --- | --- |
| `modo` | sim | `dia` ou `acumulado` |
| `inicio` | não | `YYYY-MM-DD`, só no modo `acumulado` |
| `fim` | não | `YYYY-MM-DD`, só no modo `acumulado` |
| `loja` | não | id comercial abaixo. Sem o parâmetro, a API usa `TODAS` |

### `modo=dia`

Compara o dia de hoje em `America/Sao_Paulo` com o mesmo dia da semana 364 dias antes.

`inicio` e `fim` são ignorados.

Exemplo de hoje, sábado 03/10/2026: o período vigente é `2026-10-03` e o anterior é `2025-10-04`.

```http
GET /comparativo?modo=dia
```

### `modo=acumulado`

O usuário escolhe um dia ou um intervalo no ano vigente. A API desloca esse intervalo inteiro 364 dias para trás. O intervalo anterior continua contínuo e tem a mesma quantidade de dias.

| Chamada | Período vigente |
| --- | --- |
| sem `inicio` e sem `fim` | dia 1 do mês até hoje |
| só `inicio` | esse único dia |
| só `fim` | esse único dia |
| `inicio` e `fim` | o intervalo, inclusive |

```http
GET /comparativo?modo=acumulado
GET /comparativo?modo=acumulado&inicio=2026-10-03
GET /comparativo?modo=acumulado&inicio=2026-10-01&fim=2026-10-03&loja=SAO_BERNARDO
```

Regras das datas:

- formato `YYYY-MM-DD` e data real (`2026-02-31` é inválida)
- as duas pontas precisam cair no ano vigente
- `inicio` não pode ser maior que `fim`
- `fim` não pode ser depois de hoje

O rótulo da tela sai de `periodo`, não de um cálculo local de "ano - 1". Em 31/12, os 364 dias caem em 01/01 do mesmo ano. Por isso os blocos se chamam `vigente` e `anterior`, e não `2026` e `2025`.

## Lojas

Os ids são os mesmos de `GET /lojas`.

| `loja` | Nome em `desvios.por_loja` |
| --- | --- |
| `TODAS` | todas |
| `SAO_BERNARDO` | Casa da Mamãe São Bernardo |
| `MAUA` | Casa da Mamãe Mauá |
| `SANTO_ANDRE` | Casa da Mamãe Santo André |
| `TABOAO` | Casa da Mamãe Taboão |
| `SAO_MATEUS_CDM` | Casa da Mamãe São Mateus |
| `SAO_MATEUS_MDC` | Melhor das Casas São Mateus |
| `MADUREIRA` | Melhor das Casas Madureira |
| `SANTA_CRUZ` | Melhor das Casas Santa Cruz |
| `BONSUCESSO` | Melhor das Casas Bonsucesso |
| `CARIOCA` | Melhor das Casas Carioca |
| `MESQUITA` | Melhor das Casas Mesquita |
| `NILOPOLIS` | Melhor das Casas Nilópolis |

Usuário que não é `ADMIN` e tem loja diferente de `TODAS` no token recebe só essa loja, mesmo que a query peça outra. O filtro vale para as linhas e para os desvios.

`desvios.por_loja` agrupa pelo nome comercial. Vários CNPJs da mesma loja vêm numa linha só. As linhas de `vigente` e `anterior` continuam com `codigo_loja` e `nome_loja` originais do ERP.

## Resposta `200`

```json
{
  "sucesso": true,
  "modo": "acumulado",
  "periodo": {
    "vigente": { "inicio": "2026-10-01", "fim": "2026-10-03" },
    "anterior": { "inicio": "2025-10-02", "fim": "2025-10-04" }
  },
  "vigente": [],
  "anterior": [],
  "desvios": {
    "total": {},
    "por_loja": [],
    "por_dia": [],
    "por_hora": [],
    "por_grupo": [],
    "por_secao": [],
    "por_fornecedor": [],
    "por_produto": []
  }
}
```

`vigente` e `anterior` são as vendas, item a item. Use para tabela ou detalhe. Para card, ranking e gráfico, use `desvios`.

Um mês inteiro, em todas as lojas, pode ser um JSON grande por causa das linhas e de `por_produto`.

### Linha de venda

```ts
interface VendaComparativo {
  codigo_venda: number;
  codigo_produto: number;
  data_venda: string;
  hora_venda: number;
  numero_venda: string;
  codigo_loja: number;
  nome_loja: string;
  codigo_checkout: string;
  codigo_fornecedor: number;
  nome_fornecedor: string;
  codigo_grupo: number;
  nome_grupo: string;
  codigo_subgrupo: number;
  nome_subgrupo: string;
  codigo_secao: number;
  nome_secao: string;
  nome_produto: string;
  quantidade: number;
  unitario: number;
  desconto: number;
  acrescimo: number;
  impostos: number;
  custo_item: number;
  custo_total: number;
  total_item: number;
}
```

Não vêm vendedor, supervisor, `cfop` nem `chave_cfe`.

### Desvios

Cada recorte repete o mesmo miolo:

```ts
interface MetricasPeriodo {
  faturamento: number;
  quantidade: number;
  pedidos: number;
  ticket_medio: number;
}

interface Desvio {
  vigente: MetricasPeriodo;
  anterior: MetricasPeriodo;
  percentual: {
    faturamento: number | null;
    quantidade: number | null;
    pedidos: number | null;
    ticket_medio: number | null;
  };
}
```

| Campo | Cálculo já feito |
| --- | --- |
| `faturamento` | `SUM(total_item - desconto)` |
| `quantidade` | `SUM(quantidade)` |
| `pedidos` | `COUNT(DISTINCT numero_venda)` |
| `ticket_medio` | faturamento / pedidos, ou `0` se não houver pedido |
| `percentual.*` | `((vigente - anterior) / anterior) * 100`, com 2 casas |

O percentual parte do ano vigente. Positivo: vendeu mais. Negativo: vendeu menos. `null`: o anterior daquela métrica é `0`. Não trate `null` como zero.

`total_item` na linha não é o faturamento do desvio. O faturamento já desconta `desconto`.

Recortes:

| Campo | Chave extra | Ordem |
| --- | --- | --- |
| `total` | nenhuma | objeto único |
| `por_loja` | `loja` | faturamento vigente, maior primeiro |
| `por_dia` | `data_vigente`, `data_anterior` | cronológica |
| `por_hora` | `hora` | hora crescente |
| `por_grupo` | `codigo_grupo`, `nome_grupo` | faturamento vigente, maior primeiro |
| `por_secao` | `codigo_secao`, `nome_secao` | faturamento vigente, maior primeiro |
| `por_fornecedor` | `codigo_fornecedor`, `nome_fornecedor` | faturamento vigente, maior primeiro |
| `por_produto` | `codigo_produto`, `nome_produto` | faturamento vigente, maior primeiro |

`por_dia` traz todos os dias do intervalo vigente, inclusive dia sem venda. Nesse caso as métricas vêm `0` e os percentuais `null`. `data_anterior` já é o par de 364 dias antes. O gráfico de linha pode usar esse array direto.

`por_hora` soma a hora no período inteiro, não hora por dia. Entram só as horas que tiveram venda em pelo menos um dos dois períodos.

No grupo, seção, fornecedor e produto, o nome é o do ano vigente. Se o código só existiu no ano passado, o nome é o do ano anterior e o lado vigente vem zerado.

Não há recorte de subgrupo. `codigo_subgrupo` e `nome_subgrupo` existem só na linha.

## Exemplo de desvio

`01/10/2026` contra `02/10/2025`, com faturamento 140 e 80:

```json
{
  "data_vigente": "2026-10-01",
  "data_anterior": "2025-10-02",
  "vigente": {
    "faturamento": 140,
    "quantidade": 3,
    "pedidos": 2,
    "ticket_medio": 70
  },
  "anterior": {
    "faturamento": 80,
    "quantidade": 1,
    "pedidos": 1,
    "ticket_medio": 80
  },
  "percentual": {
    "faturamento": 75,
    "quantidade": 200,
    "pedidos": 100,
    "ticket_medio": -12.5
  }
}
```

## Erros

| Status | Corpo | Quando |
| --- | --- | --- |
| `400` | `{ "sucesso": false, "erro": "..." }` | query inválida |
| `401` | `{ "sucesso": false, "mensagem": "..." }` | token ausente ou inválido |
| `500` | `{ "sucesso": false, "erro": "..." }` | falha ao ler o banco |

Mensagens de `400`:

- `Informe modo=dia ou modo=acumulado.`
- `Datas devem estar no formato YYYY-MM-DD.`
- `O intervalo deve estar no ano vigente.`
- `A data inicial não pode ser maior que a final.`
- `A data final não pode ser futura.`

## Como ligar na tela

1. Visão do dia: `GET /comparativo?modo=dia`. O título usa `periodo.vigente.inicio` e `periodo.anterior.inicio`.
2. Visão acumulada: ao abrir, `GET /comparativo?modo=acumulado`. O date picker só oferece datas do ano vigente, até hoje. Ao aplicar, manda `inicio` e `fim`.
3. Cards e o comparativo de loja leem `desvios`. A tabela de itens lê `vigente` e `anterior`.
4. Percentual `null` vira um traço, não `0%`.
