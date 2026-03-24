# ProjetoLP — Front-end

Interface web desenvolvida em **Next.js 15** para o sistema de gestão da clínica de fisioterapia da minha mãe. O projeto consome a API REST do ProjetoLPBack e oferece uma experiência fluida e responsiva para administração e fisioterapeutas.

---

## Para quem é

Sistema interno utilizado pela equipe da clínica, com interface adaptada ao perfil de cada usuário:

- **Admin** — visão completa: pacientes, agenda, pagamentos, planos, prontuários, usuários e controle financeiro
- **Fisio** — visão restrita: pacientes, agenda e prontuários

---

## Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| Next.js 15 (App Router) | Framework principal |
| TypeScript | Tipagem estática |
| Tailwind CSS | Estilização |
| motion/react (Framer Motion) | Animações e transições |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de schemas |
| Axios | Requisições HTTP |
| Sonner | Toast notifications |
| Recharts | Gráficos de evolução financeira |
| Lucide React | Ícones |

---

## Módulos

### Autenticação
- Login com JWT via cookie HttpOnly
- Redirecionamento automático por estado de autenticação
- Controle de UI baseado em `user.role`

### Pacientes
- Listagem paginada com busca e filtros (status, pagamento, agendamento)
- Cadastro e edição com validação Zod
- Toggle ativo/inativo com modal de confirmação

### Agenda
- Listagem de consultas com filtros por status e data
- Agendamento com validação de data futura

### Prontuários
- Registro clínico completo
- Upload de contrato PDF e imagens de exames

### Pagamentos
- Controle de pagamentos mensais por paciente e plano
- Filtros por status, paciente e mês de referência
- Selects filtrados por pacientes e planos ativos

### Planos
- CRUD de planos com badge de status (ativo/inativo)
- Toggle ativo/inativo nas actions da listagem

### Usuários
- Gerenciamento de usuários do sistema (somente Admin)

### Financeiro
- Cards de balanço mensal (entradas, saídas, saldo líquido)
- Gráfico de evolução dos últimos 1, 3, 6 ou 12 meses
- Registro e controle de gastos mensais
- Filtro de mês via FilterPopover com mês atual como padrão

### Bem-vindo
- Card de balanço do mês atual visível direto na tela inicial (somente Admin)

---

## Padrões do projeto

- **Estrutura por módulo** — cada rota tem sua própria pasta com `page.tsx`, `components/`, `hooks/` e `schemas/`
- **Navegação por query params** — `?mode=list|create|view&id=X` sem rotas aninhadas
- **Hooks por operação** — `pagined`, `getId`, `insert`, `update`, `delete` separados e reutilizáveis
- **Erros via toast** — todas as respostas de erro da API são capturadas e exibidas como notificação
- **Utilitário `getApiErrorMessage`** — extrai `response.data.message` de forma padronizada

---

## Como rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:3000`. A API deve estar rodando em `http://localhost:5062`.

---

## O que aprendi construindo este projeto

Este projeto marcou minha evolução como desenvolvedor front-end, consolidando conhecimentos em React moderno e me introduzindo a padrões de arquitetura de aplicações reais. O que desenvolvi:

- **Next.js App Router** — roteamento baseado em sistema de arquivos, layouts aninhados, separação entre rotas públicas e autenticadas com grupos `(public)` e `(authenticated)`
- **TypeScript avançado** — interfaces, tipos utilitários, generics nos hooks e componentes (`PagedResult<T>`, `Column<T>`), inferência com `z.infer`
- **Gerenciamento de estado sem libs externas** — `useState`, `useCallback`, `useEffect` bem combinados para substituir Redux em casos simples
- **Hooks customizados** — abstração de lógica de API em hooks reutilizáveis por operação, com estados de loading e error isolados
- **Validação com Zod + React Hook Form** — schemas declarativos que servem tanto para validação quanto para tipagem automática dos formulários
- **Autenticação com JWT em cookies** — fluxo completo de login, proteção de rotas, leitura do contexto de usuário e controle de UI por role
- **Componentes de UI reutilizáveis** — DataTable genérica, FilterPopover, Pagination, ActionsDropdown, StatusToggleModal compartilhados entre todos os módulos
- **Animações com Framer Motion** — transições entre views com `AnimatePresence`, sidebar colapsável com spring animations
- **Visualização de dados com Recharts** — gráfico de linhas múltiplas com tooltip personalizado, formatação de eixos e seleção dinâmica de período
- **Boas práticas de UX** — debounce em buscas, feedback visual em loading/error, toasts para sucesso e erro, confirmação antes de ações destrutivas
- **Organização e escalabilidade** — padrão de estrutura de pastas que permite adicionar novos módulos seguindo convenções já estabelecidas
