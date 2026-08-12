# Vale a Pena?

Plataforma brasileira de simulação e decisão financeira. Combina calculadoras
determinísticas (financiamento, juros compostos, comparação de cenários) com
uma camada de IA que interpreta o pedido do usuário e explica o resultado —
mas nunca calcula números por conta própria.

## Rodando localmente

Pré-requisito: Node.js 18+.

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

## Testes do motor financeiro

O `financial-engine` é a camada mais crítica do produto — todos os cálculos
são testados isoladamente, sem depender de UI ou de IA:

```bash
npm test
```

## Estrutura do projeto

```
app/                    → páginas (Next.js App Router)
  page.tsx              → home (input de intenção + grid de calculadoras)
  financiamento/         → calculadora de financiamento + comparação de cenários

components/
  home/                 → input de intenção, grid de calculadoras
  calculator/           → formulários das calculadoras
  forms/                → inputs reutilizáveis (moeda, percentual, número)
  results/              → resumo, tabela comparativa, análise da IA, premissas
  charts/               → gráficos (Recharts)
  layout/               → header e footer

lib/
  financial-engine/     → cálculos puros e determinísticos (o "motor")
  ai/                   → interpretação de linguagem natural + explicação
                           (mock hoje — ver comentários em interpret.ts e
                           explain.ts para como plugar um LLM real)
  validation/           → schemas Zod dos formulários
  format.ts             → formatação de moeda/percentual em pt-BR

tests/financial-engine/ → testes unitários do motor financeiro
```

## Como plugar uma IA real

Hoje `lib/ai/interpret.ts` e `lib/ai/explain.ts` são mocks baseados em regras
(regex/heurísticas), mas já devolvem exatamente o formato que uma chamada de
LLM real (function calling / structured output) devolveria — descrito em
`lib/ai/types.ts` (`AIInterpretation`). Para trocar pelo modelo de verdade:

1. Crie uma rota de API (`app/api/interpret/route.ts`) que chame a API da
   Anthropic (ou outro provedor) enviando o texto do usuário e as tools
   `car_purchase_comparison` / `loan_financing` (schemas Zod já existem em
   `lib/ai/types.ts` — converta para JSON Schema).
2. Substitua a chamada direta a `interpretUserIntent` no componente
   `IntentInput` por uma chamada a essa rota.
3. Faça o mesmo para `explainCarPurchaseComparison` / `explainLoanResult`,
   enviando os números já calculados pelo `financial-engine` e pedindo para
   o modelo apenas redigir a explicação — nunca calcular.
4. Nunca deixe o modelo calcular os números finais: ele só decide qual
   ferramenta usar, extrai parâmetros e explica resultados que já vieram
   prontos do `financial-engine`.

Nenhuma outra parte da aplicação precisa mudar.

## Deploy gratuito (Vercel)

1. Suba este projeto para um repositório no GitHub.
2. Crie uma conta gratuita em https://vercel.com (dá para entrar direto com
   o GitHub).
3. "Add New Project" → selecione o repositório → deploy. O plano Hobby da
   Vercel é gratuito e já é suficiente para começar.
4. Não é necessário configurar variáveis de ambiente ainda — o MVP não
   depende de nenhuma API externa.

## Roadmap (próximas etapas, fora do MVP atual)

- Demais calculadoras do prompt original: comprar × alugar imóvel, quitar
  empréstimo × investir, comprar à vista × parcelado, custo real do carro,
  salário bruto × líquido.
- Páginas de SEO dedicadas por calculadora (`/calculadoras/...`), com FAQ e
  schema markup.
- Autenticação (Supabase Auth) + salvar simulações — opcional, sem barreira
  de cadastro antes do cálculo.
- Integração real de LLM (ver seção acima).
- Espaços de anúncio (AdSense) e componentes de afiliados, sem prejudicar a
  UX das calculadoras.
- Eventos de analytics (`calculator_started`, `calculator_completed`, etc. —
  já listados no prompt original) via Google Analytics/GTM.

## Aviso legal

As simulações são estimativas baseadas nas informações fornecidas pelo
usuário e não constituem recomendação financeira personalizada. Este projeto
não armazena dados financeiros pessoais no MVP atual.
