# PROMPT UNIVERSAL — CONECTAR LOJA NOVAESWEB AO APP ENTREGADOR

> **Instruções para o usuário:**
> Copie o conteúdo abaixo na íntegra e envie para a Inteligência Artificial ou equipe de engenharia responsável pelo desenvolvimento do painel comercial de qualquer loja NovaesWeb.

---

```markdown
# INTEGRAÇÃO OFICIAL — NOVAESWEB ENTREGADOR (SISTEMA CENTRAL DE LOGÍSTICA)

Você é o engenheiro de software frontend/backend responsável por integrar o painel comercial desta loja ao sistema central de logística **NovaesWeb Entregador**.

## 1. Visão Geral da Arquitetura
- O **NovaesWeb Entregador** é um aplicativo universal centralizado, compartilhado por todas as lojas da rede NovaesWeb.
- **NÃO crie um aplicativo de entregador separado para esta loja.**
- **NÃO crie tabelas locais de motoboys** no banco de dados da loja. Toda a logística, dados dos motoboys, convites e confirmações residem na Central de Entregas.
- Sua missão é apenas implementar a área **"Entregadores"** no painel comercial desta loja e integrar o botão **"Enviar para Entregador"** na tela de pedidos, consumindo a API central autorizada.

---

## 2. Credenciais de Integração da Loja

Toda requisição feita pelo backend da loja para a Central de Entregas deve incluir obrigatoriamente os seguintes headers HTTP:

| Header | Descrição | Exemplo |
| :--- | :--- | :--- |
| `X-NovaesWeb-Store-Id` | ID / Slug oficial desta loja na plataforma | `acai-do-rei-canoas` ou `store-burger-01` |
| `X-NovaesWeb-API-Key` | Chave de API secreta emitida pela Central | `nx_sec_live_storeburgertest_5518` |
| `Content-Type` | Formato do payload | `application/json` |

> ⚠️ **REGRA DE SEGURANÇA CRÍTICA:**
> As chamadas à API da Central de Entregas devem ser realizadas **exclusivamente pelo backend da loja** (Node.js, Next.js API Routes, PHP/Laravel, Python, etc.).
> **NUNCA exponha a `X-NovaesWeb-API-Key` no frontend (React, Vue, HTML)** ou em variáveis de ambiente públicas (`NEXT_PUBLIC_` / `VITE_`).

---

## 3. Endpoints da Central de Entregas

**URL Base:** `https://[SEU-DOMINIO-ENTREGADOR]/api/v1/integration`
*(Em ambiente local de testes: `http://localhost:3002/api/v1/integration`)*

### 3.1 Conectar / Registrar a Loja na Central
Antes do primeiro uso, o backend da loja pode garantir o registro e validar a conexão:
- **Método:** `POST`
- **Rota:** `/api/v1/integration/stores/connect`
- **Payload:**
  ```json
  {
    "storeId": "identificador-oficial-da-loja",
    "name": "Nome da Loja",
    "category": "Hamburgueria / Açaiteria",
    "address": "Av. Principal, 1000 - Bairro",
    "phone": "(11) 98888-7777",
    "defaultDeliveryFee": 8.00,
    "webhookUrl": "https://sualoja.com.br/api/webhooks/delivery"
  }
  ```
- **Resposta (201 Created):**
  ```json
  {
    "success": true,
    "connection": {
      "storeId": "identificador-oficial-da-loja",
      "name": "Nome da Loja",
      "apiKey": "nx_sec_live_...",
      "defaultDeliveryFee": 8.00
    }
  }
  ```

---

### 3.2 Gerar Código de Convite para o Entregador
Permite ao lojista gerar um código seguro para fornecer aos seus motoboys vincularem o aplicativo:
- **Método:** `POST`
- **Rota:** `/api/v1/integration/invites`
- **Headers:** `X-NovaesWeb-Store-Id` e `X-NovaesWeb-API-Key`
- **Payload:**
  ```json
  {
    "maxUses": 1,
    "validityHours": 48
  }
  ```
- **Resposta:**
  ```json
  {
    "success": true,
    "invite": {
      "code": "NX-LOJA-7821",
      "maxUses": 1,
      "expiresAt": "2026-10-30T19:00:00.000Z",
      "shareText": "Olá! Para receber entregas da nossa loja no app NovaesWeb Entregador, use nosso código de vinculação: *NX-LOJA-7821*"
    }
  }
  ```

---

### 3.3 Listar Entregadores Vinculados à Loja
Consulta em tempo real quais motoboys estão autorizados a fazer entregas para esta loja:
- **Método:** `GET`
- **Rota:** `/api/v1/integration/drivers`
- **Headers:** `X-NovaesWeb-Store-Id` e `X-NovaesWeb-API-Key`
- **Resposta:**
  ```json
  {
    "success": true,
    "storeId": "identificador-oficial-da-loja",
    "drivers": [
      {
        "id": "mb-001",
        "name": "Carlos Silva",
        "phone": "(11) 97123-4567",
        "vehicleModel": "Honda CG 160 Fan",
        "vehiclePlate": "BRA-2E19",
        "status": "active",
        "linkedAt": "2026-10-28T19:40:00.000Z"
      }
    ]
  }
  ```

---

### 3.4 Desvincular / Revogar Acesso de um Entregador
Remove imediatamente a autorização de um motoboy receber pedidos desta loja:
- **Método:** `PATCH`
- **Rota:** `/api/v1/integration/drivers/:id/revoke`
- **Headers:** `X-NovaesWeb-Store-Id` e `X-NovaesWeb-API-Key`
- **Resposta:**
  ```json
  {
    "success": true,
    "message": "Acesso do entregador 'mb-001' revogado com sucesso."
  }
  ```

---

### 3.5 Despacho de Pedido para o Entregador (Idempotente)
Quando um pedido no painel da loja estiver pronto para entrega, o lojista seleciona o entregador e o backend dispara a corrida para a Central:
- **Método:** `POST`
- **Rota:** `/api/v1/integration/deliveries`
- **Headers:** `X-NovaesWeb-Store-Id` e `X-NovaesWeb-API-Key`
- **Payload:**
  ```json
  {
    "externalOrderId": "ped-8921",
    "idempotencyKey": "store-slug_ped-8921_v1",
    "assignedDriverId": "mb-001",
    "customer": {
      "name": "Mariana Souza",
      "phone": "(51) 98765-4321",
      "address": "Rua das Flores, 456 - Apto 302",
      "neighborhood": "Bairro Centro - Cidade/UF"
    },
    "orderValue": 48.90,
    "deliveryFee": 8.00,
    "confirmationCode": "1742"
  }
  ```
- **Resposta (201 Created ou 200 OK se retry idêntico):**
  ```json
  {
    "success": true,
    "isDuplicate": false,
    "delivery": {
      "id": "job-1730144500000",
      "orderNumber": "#0938",
      "status": "aguardando_retirada",
      "assignedDriver": {
        "id": "mb-001",
        "name": "Carlos Silva"
      },
      "orderValue": 48.90,
      "deliveryFee": 8.00,
      "confirmationCode": "1742"
    }
  }
  ```

> 💡 **Dica sobre a Idempotência:**
> Envie sempre o campo `idempotencyKey` composto pelo ID da loja e ID do pedido (ex: `loja_pedido_123_v1`). Se houver instabilidade de rede ou duplo clique do lojista, a Central reconhece o reenvio e não cria uma corrida duplicada.

---

### 3.6 Consultar Status e Histórico de Entregas da Loja
- **Listar todas as entregas:** `GET /api/v1/integration/deliveries`
- **Consultar uma entrega específica e sua linha do tempo de auditoria:** `GET /api/v1/integration/deliveries/:id`
- **Resposta:**
  ```json
  {
    "success": true,
    "delivery": {
      "id": "job-1730144500000",
      "status": "concluida",
      "orderNumber": "#0938",
      "deliveredAt": "Hoje, 16:45"
    },
    "timeline": [
      { "event": "job_created", "toStatus": "aguardando_retirada", "actorType": "store" },
      { "event": "route_started", "toStatus": "em_rota", "actorType": "driver" },
      { "event": "delivered", "toStatus": "concluida", "actorType": "driver" }
    ]
  }
  ```

---

## 4. O que Implementar na Interface do Painel da Loja

### 4.1 Nova Página / Aba "Entregadores"
1. **Card de Convite:**
   - Botão **"Gerar Código de Convite"** (consome `POST /invites`).
   - Botão **"Copiar para WhatsApp"** com o texto formatado:
     > *"Olá! Para receber nossas entregas no app NovaesWeb Entregador, use nosso código de vinculação: **NX-LOJA-XXXX**."*
2. **Tabela de Entregadores Autorizados:**
   - Lista os entregadores vinculados (`GET /drivers`).
   - Colunas: **Nome**, **Veículo / Placa**, **Telefone**, **Status**.
   - Ação: Botão **"Desvincular"** (`PATCH /drivers/:id/revoke`).

### 4.2 Botão no Detalhe do Pedido ("Enviar para Entregador")
1. Na tela onde o lojista visualiza o pedido comercial pronto:
2. Adicionar um campo Dropdown: **"Selecionar Entregador"** (alimentado pela lista de entregadores ativos).
3. Botão: **"Enviar para Entregador"** (chama `POST /deliveries`).
4. Exibir o **Código OTP de Confirmação** (4 dígitos) na tela do lojista e no comprovante do cliente para que este informe ao entregador ao receber o pacote.
5. Exibir um badge de status em tempo real:
   - 🟡 `Aguardando Retirada`
   - 🔵 `Em Rota de Entrega`
   - 🟢 `Entregue com Sucesso`

---

## 5. Exemplo de Implementação de Backend (Node.js / Next.js)

```typescript
// Exemplo de helper para o backend da loja comercial
const CENTRAL_API_URL = process.env.NOVAESWEB_CENTRAL_URL || "https://entregador.novaesweb.com.br/api/v1/integration";
const STORE_ID = process.env.NOVAESWEB_STORE_ID!;
const STORE_API_KEY = process.env.NOVAESWEB_API_KEY!;

export async function dispatchOrderToCourier(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  neighborhood: string;
  total: number;
  assignedDriverId: string;
  otpCode: string;
}) {
  const response = await fetch(`${CENTRAL_API_URL}/deliveries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-NovaesWeb-Store-Id": STORE_ID,
      "X-NovaesWeb-API-Key": STORE_API_KEY,
    },
    body: JSON.stringify({
      externalOrderId: order.id,
      idempotencyKey: `${STORE_ID}_${order.id}`,
      assignedDriverId: order.assignedDriverId,
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        address: order.deliveryAddress,
        neighborhood: order.neighborhood,
      },
      orderValue: order.total,
      confirmationCode: order.otpCode,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Falha ao despachar pedido para o entregador");
  }

  return data.delivery;
}
```

---

## 6. Checklist de Homologação da Loja
Antes de colocar em produção comercial, execute o seguinte teste:
- [ ] Backend da loja possui `X-NovaesWeb-Store-Id` e `X-NovaesWeb-API-Key` configuradas em variáveis de ambiente seguras.
- [ ] Lojista clica em "Gerar Código de Convite" e o código (ex: `NX-SUALOJA-XXXX`) é gerado.
- [ ] Entregador digita o código no app universal NovaesWeb Entregador e vincula-se à loja.
- [ ] Entregador aparece listado na aba "Entregadores" da loja.
- [ ] Lojista clica em "Enviar para Entregador" em um pedido de teste.
- [ ] O app do motoboy toca o alerta sonoro e exibe o endereço de destino.
- [ ] O motoboy clica em "Iniciar Rota" e conclui a entrega com o código OTP de 4 dígitos.
- [ ] O status no painel da loja é atualizado para `Concluída`.
```
