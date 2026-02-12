# 📡 API Documentation - TIM Customer Platform

> Documentazione completa delle API utilizzate dalla piattaforma

---

## Base URLs

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://api.tim-customer.com',      // Base API
  legacyApiUrl: 'https://legacy.tim.com',      // Legacy endpoints
  kenticoProjectId: 'xxx-xxx-xxx',             // Kentico CMS
  stripePublicKey: 'pk_test_xxx',              // Stripe
};
```

---

## 🛒 Product APIs

### GET Product Details

```http
GET /api/products/{productCode}
```

**Request:**
```typescript
// Path params
productCode: string;  // es: 'tim-my-pet', 'tim-sport'
```

**Response:**
```typescript
interface ProductResponse {
  id: number;
  code: string;                    // 'tim-my-pet'
  name: string;                    // 'TIM My Pet'
  category: string;
  description: string;
  informativeSet: string;          // URL PDF set informativo
  packets: Packet[];
  warranties: AnagWarranty[];
  validityPeriod: {
    minMonths: number;
    maxMonths: number;
  };
  configuration: {
    hasQuotator: boolean;
    requiresInsuredItem: boolean;
    insuredItemType: string;       // 'pet', 'travel', 'device', etc.
  };
}

interface Packet {
  id: number;
  name: string;                    // 'Smart pet', 'SmartPlus', 'Deluxe'
  sku: string;                     // 'tim-my-pet-smart'
  packetPremium: number;           // Prezzo base
  productId: number;
  warranties: WarrantyDetail[];
  metadata?: any;
}

interface WarrantyDetail {
  id: number;
  anagWarranty: AnagWarranty;
  translationCode: string;         // 'customers_tim_pet.insurance_info_smart_w_assistance_t'
  included: boolean;               // Se sempre inclusa o optional
  price?: number;                  // Se ha costo aggiuntivo
}

interface AnagWarranty {
  id: number;
  code: number;                    // 1, 2, 3, 14, etc.
  name: string;
  description: string;
  category: string;
}
```

**Esempio Response:**
```json
{
  "id": 42,
  "code": "tim-my-pet",
  "name": "TIM My Pet",
  "category": "Animali",
  "description": "Assicurazione per cani e gatti",
  "informativeSet": "https://cdn.tim.com/docs/tim-my-pet-set-informativo.pdf",
  "packets": [
    {
      "id": 101,
      "name": "Smart pet",
      "sku": "tim-my-pet-smart",
      "packetPremium": 4.90,
      "productId": 42,
      "warranties": [
        {
          "id": 501,
          "anagWarranty": {
            "id": 3,
            "code": 3,
            "name": "Assistenza h24",
            "description": "Servizio di assistenza veterinaria telefonica 24/7"
          },
          "translationCode": "customers_tim_pet.insurance_info_smart_w_assistance",
          "included": true
        }
      ]
    },
    {
      "id": 102,
      "name": "SmartPlus",
      "sku": "tim-my-pet-smart-plus",
      "packetPremium": 19.90,
      "productId": 42,
      "warranties": [
        {
          "id": 501,
          "anagWarranty": { "id": 3, "code": 3, "name": "Assistenza h24" },
          "translationCode": "customers_tim_pet.insurance_info_smart_w_assistance",
          "included": true
        },
        {
          "id": 502,
          "anagWarranty": { "id": 14, "code": 14, "name": "Rimborso spese veterinarie" },
          "translationCode": "customers_tim_pet.insurance_info_smartplus_w_veterinary",
          "included": true
        }
      ]
    },
    {
      "id": 103,
      "name": "Deluxe",
      "sku": "tim-my-pet-deluxe",
      "packetPremium": 24.40,
      "productId": 42,
      "warranties": [
        {
          "id": 501,
          "anagWarranty": { "id": 3, "code": 3, "name": "Assistenza h24" },
          "included": true
        },
        {
          "id": 502,
          "anagWarranty": { "id": 14, "code": 14, "name": "Rimborso spese veterinarie" },
          "included": true
        },
        {
          "id": 503,
          "anagWarranty": { "id": 1, "code": 1, "name": "Responsabilità civile" },
          "included": true
        },
        {
          "id": 504,
          "anagWarranty": { "id": 2, "code": 2, "name": "Tutela legale" },
          "included": true
        }
      ]
    }
  ],
  "validityPeriod": {
    "minMonths": 12,
    "maxMonths": 12
  },
  "configuration": {
    "hasQuotator": false,
    "requiresInsuredItem": true,
    "insuredItemType": "pet"
  }
}
```

---

## 📝 Order APIs

### POST Create Order

```http
POST /api/orders
```

**Request:**
```typescript
interface CreateOrderRequest {
  productId: number;
  customerId?: number;              // Se utente loggato
  sessionId?: string;               // Se guest
  source: string;                   // 'web', 'app', 'partner'
}
```

**Response:**
```typescript
interface CreateOrderResponse {
  orderCode: string;                // 'ORD-2026-0212-ABC123'
  status: 'Draft';
  createdAt: string;
  expiresAt: string;                // TTL ordine
  orderItem: [];                    // Vuoto al momento della creazione
}
```

**Esempio:**
```json
{
  "orderCode": "ORD-2026-0212-ABC123",
  "status": "Draft",
  "createdAt": "2026-02-12T10:30:00Z",
  "expiresAt": "2026-02-12T12:30:00Z",
  "orderItem": []
}
```

---

### PUT Update Order

```http
PUT /api/orders/{orderCode}
```

**Request:**
```typescript
interface UpdateOrderRequest {
  orderCode: string;
  customerId?: number;
  productId: number;
  packet: {
    id: number;
    sku: string;
  };
  chosenWarranties: ChosenWarranty[];
  price: number;
  insuredItems: any;                // Tipizzato in base al prodotto
  anagState: 'Draft' | 'Confirmed';
  contractor?: ContractorData;
  beneficiary?: BeneficiaryData;
}

interface ChosenWarranty {
  id: number;
  anagWarranty: {
    id: number;
    name: string;
  };
  translationCode: string;
  startDate: string;                // ISO 8601
  endDate: string;                  // ISO 8601
}

// Esempio: tim-my-pet
interface MyPetInsuredItems {
  birth_date: string;               // 'YYYY-MM-DD'
  kind: 'Cane' | 'Gatto';
  microchip_code: string;           // 15 digits
  name: string;
}

// Esempio: tim-protezione-viaggi
interface TravelInsuredItems {
  destination: string;
  departure_date: string;
  return_date: string;
  travelers: number;
  traveler_details: TravelerDetail[];
}

interface ContractorData {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  email: string;
  phone: string;
  address: AddressData;
  birthDate: string;
  birthPlace: string;
}

interface AddressData {
  street: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}
```

**Response:**
```typescript
interface UpdateOrderResponse {
  orderCode: string;
  status: 'Draft' | 'Confirmed' | 'Pending' | 'Completed';
  orderItem: OrderItem[];
  totalPremium: number;
  contractor: ContractorData;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: number;
  packetId: number;
  packet_name: string;
  start_date: string;
  expiration_date: string;
  insured_item: any;
  premium: number;
  warranties: ChosenWarranty[];
}
```

**Esempio Request (tim-my-pet):**
```json
{
  "orderCode": "ORD-2026-0212-ABC123",
  "customerId": 12345,
  "productId": 42,
  "packet": {
    "id": 102,
    "sku": "tim-my-pet-smart-plus"
  },
  "chosenWarranties": [
    {
      "id": 501,
      "anagWarranty": { "id": 3, "name": "Assistenza h24" },
      "translationCode": "customers_tim_pet.insurance_info_smart_w_assistance",
      "startDate": "2026-02-13T00:00:00Z",
      "endDate": "2027-02-13T00:00:00Z"
    },
    {
      "id": 502,
      "anagWarranty": { "id": 14, "name": "Rimborso spese veterinarie" },
      "translationCode": "customers_tim_pet.insurance_info_smartplus_w_veterinary",
      "startDate": "2026-02-13T00:00:00Z",
      "endDate": "2027-02-13T00:00:00Z"
    }
  ],
  "price": 19.90,
  "insuredItems": {
    "birth_date": "2020-06-15",
    "kind": "Cane",
    "microchip_code": "123456789012345",
    "name": "Fido"
  },
  "anagState": "Draft",
  "contractor": {
    "firstName": "Mario",
    "lastName": "Rossi",
    "fiscalCode": "RSSMRA80A01H501U",
    "email": "mario.rossi@email.com",
    "phone": "+393331234567",
    "address": {
      "street": "Via Roma",
      "streetNumber": "123",
      "city": "Milano",
      "province": "MI",
      "postalCode": "20100",
      "country": "IT"
    },
    "birthDate": "1980-01-01",
    "birthPlace": "Milano"
  }
}
```

---

### GET Order Details

```http
GET /api/orders/{orderCode}
```

**Response:**
```typescript
// Stesso schema di UpdateOrderResponse
```

---

## 💳 Payment APIs

### POST Create Payment Intent

```http
POST /api/payments/intent
```

**Request:**
```typescript
interface CreatePaymentIntentRequest {
  orderCode: string;
  amount: number;                   // In centesimi (es: 1990 = €19.90)
  currency: string;                 // 'EUR'
  returnUrl: string;                // URL redirect post-pagamento
  metadata?: {
    productCode: string;
    customerId?: number;
  };
}
```

**Response:**
```typescript
interface CreatePaymentIntentResponse {
  clientSecret: string;             // Stripe client secret
  publishableKey: string;           // Stripe publishable key
  paymentIntentId: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded';
}
```

---

### POST Confirm Payment

```http
POST /api/payments/confirm
```

**Request:**
```typescript
interface ConfirmPaymentRequest {
  orderCode: string;
  paymentIntentId: string;
  paymentMethodId: string;
}
```

**Response:**
```typescript
interface ConfirmPaymentResponse {
  orderCode: string;
  status: 'Completed' | 'Failed';
  policyNumber?: string;            // Se emessa
  transactionId: string;
  paidAt: string;
  receiptUrl: string;
}
```

---

## 👤 User APIs

### POST Login

```http
POST /api/auth/login
```

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface LoginResponse {
  token: string;                    // JWT token
  refreshToken: string;
  user: User;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  phone: string;
  verified: boolean;
}
```

---

### POST SSO Login (TIM)

```http
POST /api/auth/sso/tim
```

**Request:**
```typescript
interface SSOLoginRequest {
  code: string;                     // OAuth code
  redirectUri: string;
}
```

**Response:**
```typescript
// Stesso schema di LoginResponse
```

---

### GET User Profile

```http
GET /api/users/me
Authorization: Bearer {token}
```

**Response:**
```typescript
interface UserProfileResponse extends User {
  address?: AddressData;
  birthDate?: string;
  birthPlace?: string;
  policies: PolicySummary[];
}

interface PolicySummary {
  policyNumber: string;
  productName: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  startDate: string;
  endDate: string;
  premium: number;
}
```

---

## 📄 Document APIs

### GET Download Document

```http
GET /api/documents/download
```

**Query Params:**
```typescript
{
  remoteUrl: string;                // URL del documento
  filename?: string;                // Nome file download
}
```

**Response:**
```
Content-Type: application/pdf | application/octet-stream
Content-Disposition: attachment; filename="documento.pdf"

[Binary data]
```

---

### GET Policy Documents

```http
GET /api/policies/{policyNumber}/documents
```

**Response:**
```typescript
interface PolicyDocumentsResponse {
  policyNumber: string;
  documents: PolicyDocument[];
}

interface PolicyDocument {
  id: string;
  type: 'policy' | 'certificate' | 'terms' | 'invoice';
  name: string;
  url: string;
  generatedAt: string;
  size: number;                     // Bytes
}
```

---

## 🌍 Kentico CMS API

> Usato per traduzioni e contenuti dinamici

### GET Content Item

```http
GET https://deliver.kontent.ai/{projectId}/items/{codename}
X-KC-Secure-Access-Key: {apiKey}
```

**Response:**
```typescript
interface KenticoItemResponse {
  system: {
    id: string;
    name: string;
    codename: string;
    type: string;
    lastModified: string;
  };
  elements: {
    [key: string]: {
      type: string;
      name: string;
      value: any;
    };
  };
}
```

**Esempio (customers_tim_pet):**
```json
{
  "system": {
    "id": "xxx-yyy-zzz",
    "name": "TIM My Pet",
    "codename": "customers_tim_pet",
    "type": "product_content"
  },
  "elements": {
    "insurance_info_smart_title_mp": {
      "type": "text",
      "name": "Smart Title",
      "value": "Smart pet"
    },
    "insurance_info_smart_w_assistance_t": {
      "type": "text",
      "name": "Smart Warranty Assistance Title",
      "value": "Assistenza veterinaria h24"
    },
    "insurance_info_smart_w_assistance_d": {
      "type": "rich_text",
      "name": "Smart Warranty Assistance Description",
      "value": "<p>Servizio di assistenza telefonica...</p>"
    }
  }
}
```

---

## 📊 Analytics API (Adobe)

### Track Page View

```typescript
// Client-side - window.digitalData
window.digitalData = {
  page: {
    pageInfo: {
      pageName: 'tim-pet scelta pacchetto',
      destinationURL: window.location.href,
    },
    category: {
      primaryCategory: 'TIM My Pet',
      subCategory1: 'Insurance',
    },
  },
  cart: {
    price: {
      cartTotal: 19.90,
    },
    item: [
      {
        productInfo: {
          productName: 'TIM My Pet - Smart Plus',
          sku: 'tim-my-pet-smart-plus',
        },
        price: 19.90,
      },
    ],
  },
};

// Push to Adobe
_satellite.track('pageView');
```

---

## 🔌 Legacy API (Emission)

> API legacy per emissione polizza (da mantenere per retro-compatibilità)

### POST Emission

```http
POST /legacy/emission
```

**Request:**
```typescript
interface EmissionRequest {
  orderCode: string;
  productId: number;
  customerId: number;
  // ... molti altri campi legacy
}
```

⚠️ **Nota:** Questa API verrà gradualmente sostituita ma al momento è necessaria

---

## 🛡️ Error Responses

### Standard Error Format

```typescript
interface ErrorResponse {
  error: {
    code: string;                   // 'VALIDATION_ERROR', 'NOT_FOUND', etc.
    message: string;                // Messaggio human-readable
    details?: any;                  // Dettagli aggiuntivi
    timestamp: string;
  };
}
```

**Esempi:**

```json
// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid microchip code format",
    "details": {
      "field": "microchip_code",
      "expected": "15 digits",
      "received": "ABC123"
    },
    "timestamp": "2026-02-12T10:30:00Z"
  }
}

// 404 Not Found
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order with code ORD-2026-0212-ABC123 not found",
    "timestamp": "2026-02-12T10:30:00Z"
  }
}

// 401 Unauthorized
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authentication token is invalid or expired",
    "timestamp": "2026-02-12T10:30:00Z"
  }
}
```

---

## 🔑 Authentication

### JWT Token

Includi in ogni richiesta autenticata:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Refresh:**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "xxx-yyy-zzz"
}
```

---

## 📝 Notes

- Tutte le date sono in formato ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- Tutti i prezzi sono in Euro (€)
- Le API supportano CORS per domini autorizzati
- Rate limit: 100 req/min per IP
- Timeout: 30s
