# Linha de refatoração: Backend → Frontend

Documento de alinhamento entre a refatoração concluída na API (`innovaro-powerbi-api`) e a refatoração que será feita no dashboard (`innovaro-dashboard`).

Objetivo: manter a mesma filosofia nos dois lados — **separar camadas**, **atualizar dados sem destruir a UI**, e **não tratar sync/refetch como “reload de página”**.

---

## 1. O que já foi feito no backend

A API saiu de um monólito Express em JS para uma estrutura **MVC + TypeScript**:

```text
src/
  routes/          → só wire HTTP
  controllers/     → handlers
  services/        → regras (auth, resumo, sync)
  repositories/    → SQLite
  middlewares/     → auth, erros
  config/          → env, redis, database
```

Pontos relevantes para o front:

| Tema | Comportamento atual da API |
|------|----------------------------|
| Contrato principal | `GET /resumo` continua sendo o payload completo do dashboard |
| Sync | Roda no servidor a cada **10 minutos**; é independente do front |
| Auth | Quase todas as rotas de dados exigem `Authorization: Bearer <accessToken>` |
| Refresh | `POST /auth/refresh` **rotaciona** o refresh token (guardar o novo) |
| Usuários | Só `ADMIN` autenticado |
| Status | `GET /status` público (útil para health / detecção leve de sync) |

A API **não notifica** o front quando a sync termina. O front é quem decide *quando* e *como* buscar dados novos.

---

## 2. O problema que mais incomoda no front hoje

Não é a sync da API “recarregando o browser”. É o **ciclo de refetch do React tratar atualização como carregamento inicial**.

Fluxo atual (simplificado):

```text
intervalo 2 min / troca de filtro / botão refresh
        ↓
atualizar() → setLoading(true)
        ↓
Dashboard.jsx: if (loading || !dados) → desmonta cards/gráficos
        ↓
mostra "Carregando dashboard..."
        ↓
dados chegam → setLoading(false) → monta tudo de novo
```

Trechos envolvidos:

- [`useDashboardController.js`](src/controllers/useDashboardController.js) — `atualizar()` sempre liga `loading`
- [`Dashboard.jsx`](src/pages/Dashboard.jsx) — `if (loading || !dados)` troca a árvore inteira da página
- Polling a cada **120s** chama o mesmo `atualizar()`

Sensação para o usuário: “a página recarregou”. Tecnicamente: **remount + flash de loading**, não `window.location.reload()` (exceto no logout).

---

## 3. Princípio-guia (o mesmo do backend)

> **Separar “buscar dados” de “renderizar tela”.**  
> Sync/refetch atualiza **estado**. Componentes **reagem** a props/estado. A árvore da UI não deve ser destruída por causa de um fetch de fundo.

Analogia com o backend:

| Backend | Frontend desejado |
|---------|-------------------|
| Route não tem regra de negócio | Page não orquestra fetch pesado |
| Service agrega `/resumo` | Controller/hook busca e normaliza dados |
| Repository só persiste | Componentes só exibem props |
| Sync transacional sem apagar UI do servidor | Refetch sem desmontar dashboard |

---

## 4. Linha de refatoração sugerida no frontend

### Fase A — Corrigir o “reload” do refetch (prioridade #1)

**Meta:** após o primeiro load bem-sucedido, refetch **não** esconde a página.

Checklist:

1. Separar estados:
   - `isInitialLoading` — só true enquanto `dados === null` no primeiro fetch
   - `isRefreshing` — true em refetch silencioso (polling, botão atualizar, sync detectada)
2. Em `atualizar()`:
   - Se já existem `dados`, **não** chamar `setLoading(true)` (ou usar só `isRefreshing`)
   - Em erro de refetch, manter os dados anteriores na tela
3. Em `Dashboard.jsx`:
   - Skeleton/tela cheia **somente** no load inicial
   - Com dados já na tela, cards/gráficos permanecem montados
   - Opcional: indicador discreto (“Atualizando…”) no Header quando `isRefreshing`
4. Garantir que charts (`HoraChart`, `BarChartCard`, etc.) aceitem **novas props** sem remount forçado (`key` estável; evitar `key={Date.now()}`)

Resultado esperado: números e séries mudam no lugar; layout, scroll e filtros não “piscam”.

### Fase B — Reorganizar componentes (dados vs apresentação)

**Meta:** leaf components burros; um lugar só manda nos dados do dashboard.

Estrutura alvo (espelhando o backend):

```text
src/
  pages/Dashboard/          → composição de layout
  components/               → UI pura (Card, charts, Header)
  controllers/ ou hooks/    → useDashboardController (filtros + fetch)
  context/                  → Provider fino (só distribui o controller)
  services/                 → chamadas HTTP (/resumo, auth, metas)
  models/                   → formatters, session, tipos
```

Regras práticas:

- `Card`, `MetaCard`, `RankingCard`, charts: recebem dados prontos; **não** fetch
- Filtros (`inicio`, `fim`, `loja`, …) vivem no controller; Header só dispara callbacks
- Modais (usuários/metas) não devem resetar o estado do dashboard ao abrir/fechar
- Evitar um único `dados` gigante espalhado com destructuring profundo em 10 níveis — preferir seletores (`dados.dashboard`, `dados.horas`, …) ou context fatiado se o Provider re-renderizar demais

### Fase C — Estratégia de atualização pós-sync

Hoje o front **não sabe** quando a API terminou a sync; só faz poll cego a cada 2 minutos.

Opções (da mais simples à mais completa):

1. **Manter poll, mas silencioso** (Fase A já resolve a dor visual)
2. **Poll inteligente em `/status`**  
   - Comparar `dados.ultima_data` ou outro marcador  
   - Só chamar `GET /resumo` quando o status mudar  
   - Barato: `/status` é público e leve
3. **Botão “Atualizar”** = refetch silencioso explícito (já existe `onRefresh={atualizar}`)
4. (Futuro, se precisar) endpoint/`EventSource`/WebSocket de “sync concluída” — **não é necessário** para a primeira refatoração

Recomendação imediata: **A + poll silencioso**; evoluir para B se o `/resumo` pesar.

### Fase D — Alinhar com a API nova (auth / contratos)

A API refatorada mudou comportamento de segurança. No front, tratar juntos:

- Interceptor Axios: enviar `Authorization: Bearer`
- Em 401: tentar `POST /auth/refresh`, **salvar o novo `refreshToken`**, repetir a request
- Se refresh falhar: logout limpo (aqui `window.location` / redirect para login é aceitável)
- Rotas que antes eram abertas no backend agora exigem token — o client já autenticado do `/resumo` deve reutilizar o mesmo token
- Tipar (TS) o payload de `/resumo` conforme o contrato do backend (ver seção 5)

### Fase E — TypeScript no front (opcional, mas alinhado)

Mesma ordem mental do backend:

1. Estrutura de pastas / responsabilidade (Fases A–B)
2. Depois TS incremental (`allowJs` → tipar services → hooks → pages)
3. Não misturar “migração TS” com “consertar o loading” no mesmo PR se der para evitar

---

## 5. Contrato que o front consome (`GET /resumo`)

Campos principais já usados pelo dashboard:

```ts
{
  sucesso: boolean
  atualizado: string | Date
  periodo: { inicio: string; fim: string }
  dashboard: {
    pedidos, itens, faturamento, ticket_medio,
    desconto_total, maior_venda,
    crescimento_faturamento, faturamento_anterior
  }
  metaDashboard: {
    meta_mensal, meta_diaria, dias_uteis, dias_decorridos,
    meta_esperada, faturamento, atingimento, faltante,
    necessario_por_dia, status // ACIMA_META | NO_RITMO | ABAIXO_META
  }
  horas: Array<{ hora_venda, faturamento, pedidos, itens }>
  lojas: Array<{ loja, faturamento, pedidos, itens, ticket_medio }>
  cnpjs: Array<...>
  setores: Array<...>
  vendedores: Array<{ ..., meta, percentual_meta }>
  produtos: Array<...>
  produtosQuantidade: Array<...>
  fornecedores: Array<...>
  status: {
    registros, pedidos, lojas, produtos, vendedores, fornecedores, ultima_data
  }
}
```

Filtros (query): `inicio`, `fim`, `loja`, `fornecedor`, `setor`.

Listas de filtro: `/resumo/lojas`, `/resumo/fornecedores`, `/resumo/setores`.

---

## 6. Anti-padrões a evitar

| Evitar | Preferir |
|--------|----------|
| `setLoading(true)` em todo refetch | Loading só no primeiro load |
| Condicional que desmonta a página inteira | Overlay / badge de “atualizando” |
| `key={Date.now()}` em charts | `key` estável por tipo de gráfico |
| `window.location.reload()` para “atualizar dados” | `setDados(novoPayload)` |
| Fetch dentro de cada Card | Um fetch no controller + props |
| Poll agressivo de `/resumo` sem necessidade | Poll silencioso ou gate via `/status` |
| Ignorar novo `refreshToken` | Persistir refresh rotacionado |

---

## 7. Ordem prática de execução no front

1. **Hotfix do loading** (Fase A) — resolve a dor imediata  
2. **Extrair load inicial vs refresh** no controller  
3. **Revisar Dashboard.jsx** para não desmontar filhos  
4. **Auth interceptor + refresh rotation** (compatível com API nova)  
5. **Reorganizar pastas/componentes** (Fase B)  
6. **Poll inteligente /status** se ainda fizer sentido  
7. **TS** quando a estrutura estiver estável  

---

## 8. Critérios de pronto

- Trocar filtro ou esperar o intervalo **não** mostra “Carregando dashboard...” se já havia dados
- Scroll e estado de modais abertos não “resetam” no refetch silencioso
- Valores de cards/gráficos mudam sem flash branco da página
- Login/refresh funcionam com a API autenticada (Bearer + refresh rotacionado)
- Componentes de UI não conhecem Axios nem URL da API

---

## 9. Relação com o backend (resumo em uma frase)

No backend, sync atualiza o SQLite **sem derrubar o servidor**.  
No frontend, refetch deve atualizar o estado do dashboard **sem derrubar a árvore de componentes**.

Essa é a linha comum da refatoração.
