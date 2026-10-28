# NovaesWeb Entregador — Aplicativo Universal Multilojas

Plataforma centralizada de entregas e aplicativo universal para motoboys e estabelecimentos parceiros da **NovaesWeb**.

Projetado para conectar centenas de lojas a um único aplicativo compartilhado de entregas, com isolamento estrito de dados por loja (`store_id`), autenticação B2B via API Key, códigos de convite seguros e confirmação OTP de 4 dígitos.

---

## 🚀 Funcionalidades Principais

1. **Aplicativo Universal do Entregador:**
   - Título oficial universal: **ENTREGADOR** (sem amarração a lojas específicas).
   - Senha de acesso de 6 dígitos: `615210`.
   - Vinculação rápida a qualquer loja por código de convite (ex: `NX-ACAI-7821`).
   - Suporte a múltiplas lojas autorizadas, permitindo alternar de estabelecimento sem misturar corridas.
   - Alerta sonoro de nova entrega recebida.
   - Rotas com abertura em um clique no Google Maps e Waze.
   - Confirmação de conclusão de entrega via código OTP de 4 dígitos informado pelo cliente.
   - Sem controle de jornada ou botão de status online/offline.

2. **API B2B Central para Integração de Lojas:**
   - Endpoints autenticados via headers `X-NovaesWeb-Store-Id` e `X-NovaesWeb-API-Key`.
   - `POST /api/v1/integration/stores/connect`: Conexão/registro de estabelecimentos.
   - `POST /api/v1/integration/invites`: Geração de códigos de convite com texto pronto para WhatsApp.
   - `GET /api/v1/integration/drivers`: Listagem de entregadores autorizados na loja.
   - `PATCH /api/v1/integration/drivers/:id/revoke`: Revogação imediata de acesso.
   - `POST /api/v1/integration/deliveries`: Despacho de corridas com **idempotência** (`idempotencyKey`).
   - `GET /api/v1/integration/deliveries/:id`: Consulta de status e timeline de auditoria.

3. **Painel do Lojista Embutido:**
   - Área interativa para o lojista gerenciar "Meus Entregadores", gerar códigos de convite e despachar corridas.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Lucide Icons
- **Banco de Dados:** Supabase (PostgreSQL + RLS + Realtime)
- **Persistência Local Resiliente:** JSON Store (`data/db.json`) como fallback

---

## 📦 Como Executar

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/Lkazin/entregado.git
cd entregado
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Rodar em Modo de Desenvolvimento
```bash
npm run dev -p 3002
```

### 4. Build de Produção
```bash
npm run build
npm start -- -p 3002
```

Acesse em seu navegador: [http://localhost:3002](http://localhost:3002)

---

## 📖 Documentação Adicional

- [Plano de Arquitetura Central Supabase](docs/PLANO_ARQUITETURA_CENTRAL_SUPABASE.md)
- [Prompt Universal para Conectar Qualquer Loja](docs/PROMPT_UNIVERSAL_INTEGRACAO_LOJAS.md)
- [Relatório Multilojas NovaesWeb](docs/RELATORIO_MULTILOJAS_NOVAESWEB.md)
- [Script SQL do Supabase](supabase_setup.sql)
