# NovaesWeb Entregador — Aplicativo Universal Multilojas

O aplicativo **NovaesWeb Entregador** foi transformado com sucesso em uma plataforma **universal multiloja**, desvinculando-se de qualquer estabelecimento exclusivo (sem dados fixos da antiga *Burger House*) e atendendo a todas as lojas da plataforma NovaesWeb com isolamento seguro por `store_id`.

---

## 1. Destaques da Implementação

### 1.1 Identidade Visual Universal
- **Título Oficial:** **NOVAESWEB ENTREGADOR**.
- O nome da loja **só é exibido após o entregador estar ativamente vinculado** à loja correspondente.
- Acesso protegido por senha de 6 dígitos obrigatória: `615210`.

### 1.2 Mecanismo de Códigos de Convite por Loja
- Cada loja gera códigos individuais e seguros no formato `NX-[PREFIXO]-[ALEATÓRIO]` (ex: `NX-ACAI-7821`).
- Validade configurável (padrão de 48h a 7 dias).
- Controle de número máximo de utilizações (uso único ou múltiplo).
- O lojista pode revogar convites a qualquer instante pelo painel.

### 1.3 Isolamento Rígido entre Estabelecimentos
- Entregas, histórico e faturamento são consultados com filtro estrito `store_id` + `courier_id`.
- Nenhum entregador visualiza corridas ou pedidos de estabelecimentos aos quais não possua vínculo ativo.
- O entregador pode vincular-se a múltiplas lojas parceiras da NovaesWeb e alternar entre elas no topo do aplicativo.
- Políticas RLS (Row Level Security) e schema Supabase atualizados em [supabase_setup.sql](file:///C:/Users/camil/.gemini/antigravity/scratch/novaesweb-entregador/supabase_setup.sql).

### 1.4 Painel do Lojista ("Meus Entregadores")
Área administrativa acessível no topo do aplicativo (`Painel do Lojista`):
- **Meus Entregadores:** Lista de motoboys vinculados com modelo do veículo, placa e telefone, com ação imediata de **Desvincular / Revogar Acesso**.
- **Códigos Convite:** Criação de novos códigos com 1 clique, cópia rápida para envio via WhatsApp e revogação.
- **Despachar Pedido:** Formulário para criar e direcionar pedidos diretamente para um motoboy específico com código de confirmação OTP (`1742`).

### 1.5 Conformidade com as Regras de Negócio
- ❌ **Sem controle de jornada:** O botão online/offline e interruptores de turno foram completamente removidos da tela inicial.
- ❌ **Sem rastreamento GPS em tempo real na versão básica.**
- ✅ **Aviso sonoro:** O entregador recebe notificação sonora e visual quando um pedido é despachado.
- ✅ **Navegação externa:** Botões para abrir rotas no Waze e Google Maps integrados.

---

## 2. Telas do Aplicativo Universal

````carousel
![Tela 1 - Login Universal com Senha de 6 Dígitos](C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screen_universal_1_login.png)
<!-- slide -->
![Tela 2 - Painel Principal do Entregador com Loja Vinculada](C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screen_universal_2_home.png)
<!-- slide -->
![Tela 3 - Vincular a um Estabelecimento com Código de Convite](C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screen_universal_link_store.png)
<!-- slide -->
![Tela 4 - Painel do Lojista (Meus Entregadores, Convites e Despacho)](C:/Users/camil/.gemini/antigravity/brain/d1bc9620-f0f1-4ff7-b7c2-de91a62c2b9a/screen_universal_painel_lojista.png)
````

---

## 3. Endpoints da API Implementados

| Método | Endpoint | Função |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login com validação da senha de 6 dígitos `615210` |
| `GET` | `/api/stores` | Lista de lojas disponíveis na plataforma NovaesWeb |
| `GET` | `/api/courier/stores` | Lista de lojas às quais o entregador está vinculado |
| `POST` | `/api/invites` | Validação de código e vinculação automática à loja |
| `GET` | `/api/stores/[id]/invites` | Listagem de códigos de convite gerados pela loja |
| `POST` | `/api/stores/[id]/invites` | Geração de novo código de convite seguro (`NX-...`) |
| `PATCH` | `/api/stores/[id]/invites` | Revogação de um código de convite |
| `GET` | `/api/stores/[id]/couriers` | Listagem de entregadores autorizados na loja |
| `PATCH` | `/api/stores/[id]/couriers` | Desvinculação/revogação do entregador pelo lojista |
| `POST` | `/api/stores/[id]/dispatch` | Despacho direto de pedido para o motoboy selecionado |
| `GET` | `/api/orders?courierId=...&storeId=...` | Consulta isolada de pedidos por loja e motoboy |
| `POST` | `/api/orders/[id]/confirm` | Confirmação da entrega com código OTP de 4 dígitos |

---

## 4. Como Testar no Navegador

O servidor de produção está ativo e executando na porta **3002**:

1. Acesse: **http://localhost:3002**
2. Faça login com a senha: **`615210`**
3. Para vincular uma loja via convite:
   - Clique em **"Código"** no topo ou no botão **"Trocar"** no card da loja.
   - Digite o código de convite do Açaí do Rei: `NX-ACAI-7821` (ou gere um novo no Painel do Lojista).
   - Clique em **"Vincular à Loja"**.
4. Para acessar a área administrativa do lojista:
   - Clique no botão **"Painel do Lojista"** no cabeçalho.
   - Visualize os entregadores vinculados em **"Meus Entregadores"**.
   - Crie novos códigos em **"Códigos Convite"**.
   - Despache um novo pedido em **"Despachar"** e acompanhe o alerta no app do motoboy!
