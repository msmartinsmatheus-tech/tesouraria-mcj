# Project TODO

- [x] Definir identidade visual executiva, elegante e responsiva para a Tesouraria MCJ
- [x] Criar layout autenticado com navegação lateral e acesso seguro aos usuários
- [x] Implementar dashboard com saldo consolidado, receitas, despesas, resultado e movimentações recentes
- [x] Implementar cadastro, edição e consulta de lançamentos financeiros
- [x] Suportar tipo, valor, data, categoria, tags e observações nos lançamentos
- [x] Implementar importação de extratos em PDF com pré-visualização antes da confirmação
- [x] Implementar armazenamento seguro de PDFs e comprovantes com referências vinculadas
- [x] Implementar conciliação entre lançamentos e extratos importados
- [x] Exibir estados pendente, classificado, divergência e conciliado
- [x] Implementar gerenciamento de categorias e tags
- [x] Implementar relatórios financeiros filtráveis
- [x] Implementar histórico de auditoria para rastrear alterações
- [x] Criar persistência de dados no banco sem perda em atualizações
- [x] Criar modelos de dados e procedimentos tRPC para o domínio financeiro
- [x] Escrever e executar testes Vitest para as regras principais
- [x] Validar build, responsividade e experiência visual em desktop e celular
- [x] Preparar checkpoint final do sistema para entrega

## Histórico

- Solicitação inicial: base financeira modular, dashboard, entradas, saídas, histórico, categorias, comprovantes, relatórios e configurações.
- Solicitação complementar: sistema completo, autenticação, conciliação, importação de PDFs, arquivos seguros, relatórios e auditoria; direção visual elegante e executiva.

## Observação de escopo V1

A implementação deve priorizar uma base sólida e utilizável, sem inventar dados bancários. A leitura automática de PDF deve preservar os dados originais e tratar itens não identificados como pendentes de revisão.

## Lacunas identificadas na revisão

- [x] Integrar DashboardLayout autenticado ao App e proteger o acesso às telas financeiras e consultas sensíveis
- [x] Conectar dashboard ao backend via tRPC, substituindo dados fixos por dados persistidos
- [x] Implementar criação, edição e consulta de lançamentos no frontend com queries, mutations e estados de loading/erro
- [x] Adicionar suporte completo a tags nos formulários, procedures e relação financeira
- [x] Criar testes Vitest para procedures financeiras, validações, permissões e persistência
- [x] Executar e validar o build de produção antes da entrega

- [x] Proteger as procedures financeiras sensíveis com protectedProcedure
- [x] Adicionar testes Vitest de acesso negado e permitido às rotas financeiras conforme autenticação
- [x] Validar loading, erro e sessão autenticada no frontend após proteger as queries

## Pendências técnicas finais

- [x] Conectar métricas, gráficos e estados vazios do dashboard ao backend, removendo fallback fixo de movimentações
- [x] Criar testes Vitest para createEntry cobrindo validação, persistência e gravação de entryTags
- [x] Adicionar testes de autorização para dashboard, categories, tags e statements
- [x] Implementar e validar loading, erro e sessão autenticada nas queries protegidas do frontend

## Correções finais de completude

- [x] Remover fallbacks e dados hardcoded do dashboard e ligar métricas, gráficos e estados vazios somente ao backend
- [x] Implementar edição real de lançamentos e conectar categoria/tags ao estado e às mutations
- [x] Adicionar pré-visualização e confirmação antes de salvar PDFs
- [x] Implementar anexos e comprovantes vinculados a lançamentos e conciliações
- [x] Criar UI funcional para conciliação, categorias, tags, relatórios filtráveis e histórico de auditoria
- [x] Adicionar testes Vitest de persistência real para createEntry e entryTags
- [x] Ampliar estados de loading e erro nas queries protegidas

## Auditoria final de implementação

- [x] Criar testes Vitest para createEntry, createStatement, updateEntry e reconcileEntry, incluindo persistência e entryTags
- [x] Substituir gráfico e composição de despesas estáticos por dados derivados do backend
- [x] Implementar edição de lançamentos no frontend e ligar categoria/tags às mutations
- [x] Adicionar pré-visualização e confirmação antes de persistir PDFs
- [x] Implementar upload de comprovantes/anexos com vínculo a lançamentos e conciliações
- [x] Tornar conciliação, categorias/tags, relatórios filtráveis e auditoria funcionais no frontend
- [x] Padronizar loading/erro em entries, statements, categories, tags e audit

## Bug reportado — 29/08/2026

- [x] Corrigir navegação para abrir Movimentações, Conciliação, Extratos, Categorias e tags e Relatórios além da Visão geral
- [x] Validar cada rota e o estado ativo da navegação em desktop e celular

## Identidade visual — logo MCJ

- [x] Incorporar a logo oficial do MCJ no shell da aplicação e nos pontos institucionais
- [x] Validar contraste, proporção e responsividade da logo em desktop e celular

- [x] Validar a logo do MCJ em viewport mobile após a inclusão
- [x] Validar visualmente a logo no estado autenticado do sidebar

## Identidade visual — verde predominante

- [x] Tornar o verde a cor predominante da identidade visual do MCJ
- [x] Revisar contraste, botões, sidebar, cards e estados financeiros com a nova paleta
- [x] Validar a paleta verde em desktop e celular

## Bugs reportados — conciliação, PDF e exclusão

- [x] Implementar ação real para conciliar lançamentos com extratos, com confirmação e atualização de status
- [x] Implementar geração e download de relatório financeiro em PDF
- [x] Implementar exclusão segura de movimentações com confirmação, auditoria e atualização das queries
- [x] Adicionar testes Vitest para conciliação, geração de relatório e exclusão
- [x] Validar os três fluxos no preview em desktop e celular

## Bug reportado — conciliação sem transações do extrato

- [x] Criar entidade persistente para transações importadas do extrato, vinculada ao statement
- [x] Exibir transações importadas na tela de Conciliação, sem inventar dados quando o PDF não for lido
- [x] Permitir vincular uma transação do extrato a um lançamento existente
- [x] Persistir o vínculo, status conciliado/divergência e auditoria da operação
- [x] Implementar confirmação explícita da conciliação e atualização das listas
- [x] Adicionar testes Vitest para vínculo e autorização da conciliação
- [x] Validar o fluxo completo no preview em desktop e celular
