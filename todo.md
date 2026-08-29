# Project TODO

- [x] Definir identidade visual executiva, elegante e responsiva para a Tesouraria MCJ
- [x] Criar layout autenticado com navegação lateral e acesso seguro aos usuários
- [ ] Implementar dashboard com saldo consolidado, receitas, despesas, resultado e movimentações recentes
- [ ] Implementar cadastro, edição e consulta de lançamentos financeiros
- [ ] Suportar tipo, valor, data, categoria, tags e observações nos lançamentos
- [ ] Implementar importação de extratos em PDF com pré-visualização antes da confirmação
- [ ] Implementar armazenamento seguro de PDFs e comprovantes com referências vinculadas
- [ ] Implementar conciliação entre lançamentos e extratos importados
- [ ] Exibir estados pendente, classificado, divergência e conciliado
- [ ] Implementar gerenciamento de categorias e tags
- [ ] Implementar relatórios financeiros filtráveis
- [ ] Implementar histórico de auditoria para rastrear alterações
- [ ] Criar persistência de dados no banco sem perda em atualizações
- [x] Criar modelos de dados e procedimentos tRPC para o domínio financeiro
- [ ] Escrever e executar testes Vitest para as regras principais
- [x] Validar build, responsividade e experiência visual em desktop e celular
- [ ] Preparar checkpoint final do sistema para entrega

## Histórico

- Solicitação inicial: base financeira modular, dashboard, entradas, saídas, histórico, categorias, comprovantes, relatórios e configurações.
- Solicitação complementar: sistema completo, autenticação, conciliação, importação de PDFs, arquivos seguros, relatórios e auditoria; direção visual elegante e executiva.

## Observação de escopo V1

A implementação deve priorizar uma base sólida e utilizável, sem inventar dados bancários. A leitura automática de PDF deve preservar os dados originais e tratar itens não identificados como pendentes de revisão.

## Lacunas identificadas na revisão

- [x] Integrar DashboardLayout autenticado ao App e proteger o acesso às telas financeiras e consultas sensíveis
- [x] Conectar dashboard ao backend via tRPC, substituindo dados fixos por dados persistidos
- [ ] Implementar criação, edição e consulta de lançamentos no frontend com queries, mutations e estados de loading/erro
- [ ] Adicionar suporte completo a tags nos formulários, procedures e relação financeira
- [x] Criar testes Vitest para procedures financeiras, validações, permissões e persistência
- [x] Executar e validar o build de produção antes da entrega

- [x] Proteger as procedures financeiras sensíveis com protectedProcedure
- [x] Adicionar testes Vitest de acesso negado e permitido às rotas financeiras conforme autenticação
- [x] Validar loading, erro e sessão autenticada no frontend após proteger as queries

## Pendências técnicas finais

- [ ] Conectar métricas, gráficos e estados vazios do dashboard ao backend, removendo fallback fixo de movimentações
- [ ] Criar testes Vitest para createEntry cobrindo validação, persistência e gravação de entryTags
- [ ] Adicionar testes de autorização para dashboard, categories, tags e statements
- [ ] Implementar e validar loading, erro e sessão autenticada nas queries protegidas do frontend
