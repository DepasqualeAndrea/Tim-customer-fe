# 📋 Analisi Migrazione TIM Customer - Angular 18

> **Prodotto Pilota:** tim-my-pet
> **Data Analisi:** 2026-02-12
> **Versione Attuale:** Angular 13.3.11
> **Versione Target:** Angular 18.x

---

## 🎯 Obiettivo

Ricreare l'intera piattaforma TIM Customer in Angular 18 con:
- ✅ Architettura pulita e modulare
- ✅ Componenti riutilizzabili (zero duplicazioni)
- ✅ Gestione centralizzata prodotti via configurazione
- ✅ Stessa grafica e UX
- ✅ Stessa logica di business e API
- ✅ Codice maintainabile e scalabile

---

## 📊 Situazione Attuale

### Prodotti Gestiti (15 totali)

#### Prodotti TIM Insurance:
1. **tim-my-pet** ⭐ (PILOTA - pattern a pacchetti)
2. tim-sport (pattern a pacchetti)
3. tim-for-ski (pattern a pacchetti)
4. tim-nat-cat (pattern a pacchetti)
5. tim-protezione-casa (pattern a pacchetti)
6. tim-protezione-viaggi (sotto-moduli: annuale, breve, roaming)
7. tim-ehealth-quixa-standard
8. tim-bill-protection
9. tim-bill-protection-2
10. tim-bill-protector

#### Prodotti Net/Cyber:
11. net-cyber-business
12. net-cyber-consumer

#### Prodotti Pagamento/Area:
13. nyp-gup
14. nyp-private-area
15. nyp-stripe

### Stack Tecnologico Attuale

```json
{
  "angular": "13.3.11",
  "bootstrap": "4.1.3",
  "jquery": "3.6.0",          // ⚠️ Da eliminare
  "kentico-cloud-delivery": "6.2.0",
  "ngx-toastr": "14.3.0",
  "moment": "2.22.2",         // ⚠️ Deprecato, usare date-fns
  "rxjs": "6.4.0"             // ⚠️ Vecchia versione
}
```

### Problemi Identificati

#### 🔴 Critico - Duplicazione Codice
Ogni prodotto ha una **copia identica** dei seguenti componenti:
- `checkout-orchestrator` (x15)
- `checkout-step-address` (x15)
- `checkout-step-consensuses` (x15)
- `checkout-step-insurance-info` (x15)
- `checkout-step-login` (x15)
- `checkout-step-survey` (x15)
- `checkout-step-payment-gup` (x15)
- `checkout-thank-you` (x15)
- `shopping-cart` (x15)

**Stima:** ~90% del codice è duplicato

#### 🟡 Medio - Architettura
- NgModules ovunque (pattern obsoleto)
- Nessuna separazione logica/presentazione
- State management con BehaviorSubject sparsi
- Adobe Analytics hardcoded ovunque
- CSS duplicati per ogni prodotto

#### 🟢 Da Migliorare
- Dipendenze obsolete (jQuery, moment.js)
- Manca lazy loading effettivo
- Bundle size enorme
- Nessun tree-shaking efficace

---

## 🔍 Analisi Dettagliata: tim-my-pet

### Struttura File

```
tim-my-pet/
├── components/
│   ├── checkout-orchestrator/          # Orchestratore principale
│   ├── checkout-step-address/          # Step dati anagrafici
│   ├── checkout-step-consensuses/      # Step consensi
│   ├── checkout-step-insurance-info/   # Step scelta pacchetto + animale
│   │   └── checkout-card-insurance-info-tim-pet-insured-type-animal/
│   ├── checkout-step-login/            # Step login/registrazione
│   ├── checkout-step-payment-gup/      # Step pagamento
│   ├── checkout-step-survey/           # Step questionario coerenza
│   ├── checkout-thank-you/             # Pagina successo
│   ├── policy-detail-basic-tim-my-pet/ # Dettaglio polizza
│   └── shopping-cart/                  # Carrello laterale
├── modal/
│   └── insurance-info-details-modal/   # Modal dettagli garanzie
├── services/
│   ├── api.service.ts                  # API specifiche tim-my-pet
│   ├── checkout.service.ts             # State management prodotto
│   └── checkout.resolver.ts            # Router resolver
├── tim-my-pet.module.ts                # Module principale
└── tim-my-pet.service-module.ts        # Module servizi
```

### Flusso Checkout

```
┌─────────────────────────────────────────────────────────────┐
│                    checkout-orchestrator                     │
│                  (Gestisce routing e state)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─► 1. insurance-info
                       │    ├─ Scelta animale (cane/gatto)
                       │    │  └─ Form: tipo, nome, microchip, data nascita
                       │    └─ Scelta pacchetto
                       │       ├─ Smart (€4.90)
                       │       ├─ Smart Plus (€19.90)
                       │       └─ Deluxe (€24.40)
                       │
                       ├─► 2. login-register
                       │    └─ SSO TIM / Registrazione
                       │
                       ├─► 3. address
                       │    └─ Dati anagrafici contraente
                       │
                       ├─► 4. survey
                       │    └─ Questionario di coerenza
                       │
                       ├─► 5. payment
                       │    └─ GUP (Stripe integration)
                       │
                       ├─► 6. consensuses
                       │    └─ Privacy e consensi marketing
                       │
                       └─► 7. success/thank-you
                            └─ Conferma acquisto + download documenti
```

### Pattern Identificati

#### 1️⃣ Pattern a Pacchetti (tim-my-pet, tim-sport, tim-for-ski, ecc.)

**Caratteristiche:**
- Pacchetti fissi (Smart, Smart Plus, Deluxe)
- Prezzi predefiniti
- Garanzie associate ai pacchetti
- NO preventivatore dinamico

**Dati Chiave:**
```typescript
interface IPacketChoose {
  smartPrice: number;       // 4.90
  deluxePrice: number;      // 24.40
  smartPlusPrice: number;   // 19.90
}

interface IPacketNWarranties {
  packet: PacketsName;
  warranties: { code: number, label: string }[];
  price: number;
  packetCombo: string;
}
```

#### 2️⃣ Pattern Preventivatore (tim-protezione-viaggi)

**Caratteristiche:**
- Calcolo premio dinamico
- Input: destinazione, durata, numero persone
- Output: preventivo personalizzato

---

## 🎨 Componenti Comuni Identificati

### ✅ Componenti 100% Riutilizzabili

| Componente | Funzione | Personalizzazione |
|------------|----------|-------------------|
| `checkout-orchestrator` | Router + State manager | Config routing steps |
| `checkout-step-address` | Form dati anagrafici | Campi condizionali |
| `checkout-step-consensuses` | Form consensi | Testi da Kentico |
| `checkout-step-login` | SSO/Registrazione | Logo prodotto |
| `checkout-step-survey` | Questionario | Domande da config |
| `shopping-cart` | Riepilogo carrello | Template pacchetto |
| `checkout-thank-you` | Success page | Messaggio prodotto |

### 🔧 Componenti Parzialmente Personalizzabili

| Componente | Parte Comune | Parte Specifica |
|------------|--------------|-----------------|
| `checkout-step-insurance-info` | Form container + validazione | Contenuto form (pacchetti vs preventivatore) |
| `policy-detail` | Layout + download docs | Template dettagli prodotto |

---

## 🗄️ Servizi e State Management

### Servizi Condivisi (già esistenti)

```typescript
// services/nyp-data.service.ts
class NypDataService {
  CurrentState$: BehaviorSubject<CheckoutStates>;     // State corrente
  CurrentProduct$: BehaviorSubject<Product>;          // Prodotto corrente
  Order$: BehaviorSubject<IOrderResponse>;            // Ordine
  User$: BehaviorSubject<User>;                       // Utente

  static Translations: { [key: string]: any };        // Traduzioni Kentico
}
```

### Servizi Specifici Prodotto (pattern ripetuto)

```typescript
// tim-my-pet/services/checkout.service.ts
class TimMyPetCheckoutService extends FieldToRecover {
  InsuranceInfoState$: BehaviorSubject<InsuranceInfoStates>;
  ChosenPackets$: BehaviorSubject<IPacketNWarranties>;
  SelectedPackets: IPacketChoose;

  // Adobe Analytics tracking
  // State management specifico
}
```

**Problema:** Ogni prodotto ha il suo servizio quasi identico!

---

## 📡 API Contracts

### Endpoint Principali

```typescript
// GET - Ottieni prodotto e configurazione
GET /api/products/{productCode}

Response: {
  id: number;
  code: string;
  name: string;
  packets: Packet[];        // Pacchetti disponibili
  warranties: Warranty[];   // Garanzie
  informativeSet: string;   // URL documenti
}

// PUT - Aggiorna ordine
PUT /api/orders/{orderCode}

Body: {
  orderCode: string;
  customerId?: number;
  productId: number;
  packet: Packet;
  chosenWarranties: Warranty[];
  price: number;
  insuredItems: any;        // Varia per prodotto
  anagState: 'Draft' | 'Confirmed';
}

// POST - Emissione polizza (legacy)
POST /api/legacy/emission

Body: {
  orderCode: string;
  productId: number;
  // ... altri dati legacy
}
```

### Modelli Dati Chiave

```typescript
interface Product {
  id: number;
  code: string;
  name: string;
  packets: Packet[];
  warranties: Warranty[];
  informativeSet: string;
}

interface Packet {
  id: number;
  name: string;
  sku: string;
  packetPremium: number;
  warranties: WarrantyDetail[];
}

interface Warranty {
  id: number;
  anagWarranty: {
    id: number;
    name: string;
  };
  translationCode: string;
  startDate?: string;
  endDate?: string;
}

interface IOrderResponse<T = any> {
  orderCode: string;
  orderItem: OrderItem<T>[];
  status: string;
}

interface OrderItem<T> {
  id: number;
  packetId: number;
  start_date: string;
  expiration_date: string;
  insured_item: T;          // Tipo varia per prodotto
  premium: number;
}

// Esempio per tim-my-pet
interface MyPetInsuredItems {
  birth_date: string;
  kind: 'Cane' | 'Gatto';
  microchip_code: string;
  name: string;
}
```

---

## 🎨 CSS e Styling

### Struttura CSS Attuale

```
src/
├── sass/
│   └── application.scss              # Globale
├── media-query-styles.scss           # Responsive globale
└── modules/nyp-checkout/
    └── styles/
        ├── checkout-forms.scss       # ✅ Condiviso
        ├── shopping-cart.scss        # ✅ Condiviso
        ├── size.scss                 # ✅ Condiviso
        ├── colors.scss               # ✅ Condiviso
        ├── text.scss                 # ✅ Condiviso
        └── common.scss               # ✅ Condiviso
```

**Ogni componente importa:**
```scss
@import '../../../../styles/size.scss';
@import '../../../../styles/colors.scss';
@import '../../../../styles/text.scss';
@import '../../../../styles/common.scss';
```

**Problema:** Path relativi, nessuna centralizzazione SCSS variables

---

## 🔌 Integrazioni Esterne

### Kentico CMS
- **Uso:** Traduzioni, contenuti dinamici, immagini
- **Pattern:** Chiavi tipo `customers_tim_pet.insurance_info_smart_title_mp`
- **Servizio:** `KenticoTranslateService.getItem<T>(key)`

### Adobe Analytics
- **Problema:** Codice sparso ovunque nei componenti
- **Uso:** Tracking navigazione, click, conversioni
- **Oggetto globale:** `window.digitalData`

### Stripe (via GUP)
- **Module:** `nyp-stripe`
- **Componente:** `checkout-step-payment-gup`

### SSO TIM
- **Integrazione:** `angularx-social-login`
- **Flusso:** Login → Callback → State recovery

---

## 📝 Routing e Guards

### Routing tim-my-pet

```typescript
const routes: Routes = [
  {
    path: "",
    component: CheckoutOrchestratorComponent,
    resolve: { input: TimMyPetCheckoutResolver },
    children: [
      { path: "login-register", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "insurance-info", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "address", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "survey", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "payment", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "consensuses", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "success", canActivate: [AfterStripeGuard], component: CheckoutThankYouComponent },
      { path: "fail" },
      { path: "thank-you" },
    ],
  },
];
```

**Guards:**
- `CheckoutDeactivateGuard` → Previene uscita con form dirty
- `AfterStripeGuard` → Valida redirect post-pagamento

---

## 🚀 Architettura Target Angular 18

### Principi Guida

1. **Single Source of Truth** - Un solo orchestrator configurabile
2. **Configuration over Code** - Prodotti definiti via config
3. **Standalone Components** - Bye bye NgModules
4. **Signals** - Reactive state management nativo
5. **Dependency Injection moderna** - `inject()` function
6. **Control Flow nativo** - `@if`, `@for`, `@switch`

### Struttura Proposta

```
src/
├── app/
│   ├── core/                              # Singleton services
│   │   ├── api/
│   │   │   ├── nyp-api.service.ts
│   │   │   └── models/
│   │   │       ├── product.model.ts
│   │   │       ├── order.model.ts
│   │   │       └── warranty.model.ts
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   └── sso.guard.ts
│   │   ├── kentico/
│   │   │   └── kentico.service.ts
│   │   ├── analytics/
│   │   │   └── adobe-analytics.service.ts
│   │   └── state/
│   │       └── checkout-state.service.ts  # GLOBAL state con Signals
│   │
│   ├── shared/                            # Shared components/utils
│   │   ├── ui/                            # UI components
│   │   │   ├── button/
│   │   │   ├── modal/
│   │   │   └── form-controls/
│   │   ├── checkout/                      # Checkout components
│   │   │   ├── orchestrator/              # ⭐ UNO SOLO
│   │   │   ├── steps/
│   │   │   │   ├── address-step/
│   │   │   │   ├── consensuses-step/
│   │   │   │   ├── login-step/
│   │   │   │   ├── payment-step/
│   │   │   │   ├── survey-step/
│   │   │   │   └── insurance-info-step/
│   │   │   │       ├── base/              # Base component
│   │   │   │       ├── packet-selector/   # Per prodotti a pacchetti
│   │   │   │       └── quotator/          # Per preventivatori
│   │   │   ├── shopping-cart/
│   │   │   └── thank-you/
│   │   ├── validators/
│   │   └── pipes/
│   │
│   ├── features/                          # Feature modules
│   │   └── checkout/
│   │       ├── checkout.routes.ts
│   │       └── checkout.component.ts      # Wrapper routing
│   │
│   └── products/                          # ⭐ CONFIGURAZIONI
│       ├── product-config.interface.ts
│       ├── configs/
│       │   ├── tim-my-pet.config.ts
│       │   ├── tim-sport.config.ts
│       │   ├── tim-for-ski.config.ts
│       │   └── ... (altri 12 prodotti)
│       └── product-registry.ts            # Registry di tutti i prodotti
│
└── assets/
    ├── i18n/                              # Fallback translations
    ├── styles/
    │   ├── _variables.scss
    │   ├── _mixins.scss
    │   └── themes/
    │       └── tim.scss
    └── images/
```

### Product Configuration Interface

```typescript
// products/product-config.interface.ts

export interface ProductConfig {
  code: string;                           // 'tim-my-pet'
  name: string;                           // Display name
  kenticoKey: string;                     // 'customers_tim_pet'

  checkout: CheckoutConfig;
  analytics: AnalyticsConfig;
  styling?: StylingConfig;
}

export interface CheckoutConfig {
  type: 'packet-based' | 'quotator';

  steps: CheckoutStep[];                  // Ordine e configurazione step

  insuranceInfo: InsuranceInfoConfig;     // Configurazione step principale

  insuredItemFields: FormFieldConfig[];   // Campi specifici (es. animale)
}

export interface CheckoutStep {
  id: CheckoutStepId;
  enabled: boolean;
  order: number;
  component?: Type<any>;                  // Override component se custom
  config?: any;                           // Configurazione specifica
}

export type CheckoutStepId =
  | 'insurance-info'
  | 'login-register'
  | 'address'
  | 'survey'
  | 'payment'
  | 'consensuses'
  | 'success';

export interface InsuranceInfoConfig {
  type: 'packet-selector' | 'quotator';

  // Per packet-based
  packets?: PacketConfig[];

  // Per quotator
  quotatorFields?: FormFieldConfig[];
}

export interface PacketConfig {
  id: string;
  nameKey: string;                        // Kentico key
  descriptionKey: string;
  price?: number;                         // Se fisso
  warranties: WarrantyConfig[];
  icon?: string;
}

export interface WarrantyConfig {
  code: number;
  labelKey: string;
  descriptionKey: string;
  included: boolean;                      // Sempre inclusa o opzionale
}

export interface FormFieldConfig {
  name: string;
  type: 'text' | 'select' | 'date' | 'number' | 'checkbox';
  labelKey: string;
  validators: ValidatorConfig[];
  options?: { value: any, labelKey: string }[];
  conditional?: {
    field: string;
    value: any;
  };
}

export interface AnalyticsConfig {
  productName: string;
  stepNames: Record<CheckoutStepId, string>;
}
```

### Esempio: tim-my-pet.config.ts

```typescript
// products/configs/tim-my-pet.config.ts

import { ProductConfig } from '../product-config.interface';

export const TIM_MY_PET_CONFIG: ProductConfig = {
  code: 'tim-my-pet',
  name: 'TIM My Pet',
  kenticoKey: 'customers_tim_pet',

  checkout: {
    type: 'packet-based',

    steps: [
      { id: 'insurance-info', enabled: true, order: 1 },
      { id: 'login-register', enabled: true, order: 2 },
      { id: 'address', enabled: true, order: 3 },
      { id: 'survey', enabled: true, order: 4 },
      { id: 'payment', enabled: true, order: 5 },
      { id: 'consensuses', enabled: true, order: 6 },
      { id: 'success', enabled: true, order: 7 },
    ],

    insuranceInfo: {
      type: 'packet-selector',

      packets: [
        {
          id: 'tim-my-pet-smart',
          nameKey: 'insurance_info_smart_title_mp',
          descriptionKey: 'insurance_info_smart_description',
          price: 4.90,
          warranties: [
            {
              code: 3,
              labelKey: 'insurance_info_smart_w_assistance_t',
              descriptionKey: 'insurance_info_smart_w_assistance_d',
              included: true,
            },
          ],
        },
        {
          id: 'tim-my-pet-smart-plus',
          nameKey: 'insurance_info_smart_plus_title_mp',
          descriptionKey: 'insurance_info_smart_plus_description',
          price: 19.90,
          warranties: [
            {
              code: 3,
              labelKey: 'insurance_info_smart_w_assistance_t',
              descriptionKey: 'insurance_info_smart_w_assistance_d',
              included: true,
            },
            {
              code: 14,
              labelKey: 'insurance_info_smartplus_w_veterinary_t',
              descriptionKey: 'insurance_info_smartplus_w_veterinary_d',
              included: true,
            },
          ],
        },
        {
          id: 'tim-my-pet-deluxe',
          nameKey: 'insurance_info_deluxe_title_mp',
          descriptionKey: 'insurance_info_deluxe_description',
          price: 24.40,
          warranties: [
            {
              code: 3,
              labelKey: 'insurance_info_smart_w_assistance_t',
              descriptionKey: 'insurance_info_smart_w_assistance_d',
              included: true,
            },
            {
              code: 14,
              labelKey: 'insurance_info_smart_plus_w_veterinary_t',
              descriptionKey: 'insurance_info_smart_plus_w_veterinary_d',
              included: true,
            },
            {
              code: 1,
              labelKey: 'insurance_info_deluxe_w_civil_t',
              descriptionKey: 'insurance_info_deluxe_w_civil_d',
              included: true,
            },
            {
              code: 2,
              labelKey: 'insurance_info_deluxe_w_legal_prot_t',
              descriptionKey: 'insurance_info_deluxe_w_legal_prot_d',
              included: true,
            },
          ],
        },
      ],
    },

    insuredItemFields: [
      {
        name: 'kind',
        type: 'select',
        labelKey: 'insurance_info_pet_kind_label',
        options: [
          { value: 'Cane', labelKey: 'insurance_info_pet_kind_dog' },
          { value: 'Gatto', labelKey: 'insurance_info_pet_kind_cat' },
        ],
        validators: [{ type: 'required' }],
      },
      {
        name: 'petName',
        type: 'text',
        labelKey: 'insurance_info_pet_name_label',
        validators: [
          { type: 'required' },
          { type: 'minLength', value: 2 },
          { type: 'maxLength', value: 50 },
        ],
      },
      {
        name: 'microChip',
        type: 'text',
        labelKey: 'insurance_info_microchip_label',
        validators: [
          { type: 'required' },
          { type: 'pattern', value: '^[0-9]{15}$' },
        ],
      },
      {
        name: 'birthDate',
        type: 'date',
        labelKey: 'insurance_info_birth_date_label',
        validators: [
          { type: 'required' },
          { type: 'maxDate', value: 'today' },
        ],
      },
    ],
  },

  analytics: {
    productName: 'tim-pet',
    stepNames: {
      'insurance-info': 'tim-pet scelta pacchetto',
      'login-register': 'tim-pet loginPage',
      'address': 'tim-pet dati anagrafici',
      'survey': 'tim-pet questionario di coerenza',
      'payment': 'tim-pet pagamento',
      'consensuses': 'tim-pet consensi',
      'success': 'tim-pet thankyou',
    },
  },
};
```

### Esempio: Orchestrator Dinamico

```typescript
// shared/checkout/orchestrator/orchestrator.component.ts

import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutStateService } from '@core/state/checkout-state.service';
import { ProductConfig } from '@products/product-config.interface';

@Component({
  selector: 'app-checkout-orchestrator',
  standalone: true,
  templateUrl: './orchestrator.component.html',
  styleUrl: './orchestrator.component.scss',
})
export class CheckoutOrchestratorComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private state = inject(CheckoutStateService);

  // Signals
  productConfig = toSignal(this.route.data.pipe(map(d => d.productConfig as ProductConfig)));
  currentStep = this.state.currentStep;
  order = this.state.order;

  // Computed
  steps = computed(() =>
    this.productConfig()?.checkout.steps
      .filter(s => s.enabled)
      .sort((a, b) => a.order - b.order)
  );

  currentStepConfig = computed(() =>
    this.steps()?.find(s => s.id === this.currentStep())
  );

  isMobile = signal(window.innerWidth < 768);

  navigateToStep(stepId: string) {
    const productCode = this.productConfig()?.code;
    this.router.navigate([`/checkout/${productCode}/${stepId}`]);
  }
}
```

---

## 🎯 Roadmap Implementazione

### Fase 1: Setup Nuova Repo (1 settimana)
- [ ] Creazione repo Angular 18
- [ ] Setup ESLint, Prettier, Husky
- [ ] Configurazione SCSS (variables, mixins)
- [ ] Setup Kentico SDK
- [ ] Setup testing (Jest + Testing Library)
- [ ] CI/CD pipeline

### Fase 2: Core & Shared (2 settimane)
- [ ] Core services (API, Auth, State)
- [ ] Product config interface
- [ ] Shared UI components (button, input, modal)
- [ ] Base checkout orchestrator
- [ ] Shared validators & pipes

### Fase 3: Checkout Steps Generici (3 settimane)
- [ ] Address step (generic)
- [ ] Login step
- [ ] Survey step
- [ ] Payment step (Stripe integration)
- [ ] Consensuses step
- [ ] Thank you page
- [ ] Shopping cart component

### Fase 4: Insurance Info Step (2 settimane)
- [ ] Base insurance-info component
- [ ] Packet selector component
- [ ] Quotator component (per viaggi)
- [ ] Dynamic form generator

### Fase 5: Prodotto Pilota tim-my-pet (2 settimane)
- [ ] Config tim-my-pet
- [ ] Test end-to-end
- [ ] Integrazione API reali
- [ ] Testing utente
- [ ] Fix & ottimizzazioni

### Fase 6: Migrazione Altri Prodotti (4-6 settimane)
- [ ] tim-sport
- [ ] tim-for-ski
- [ ] tim-nat-cat
- [ ] tim-protezione-casa
- [ ] tim-protezione-viaggi
- [ ] Altri 9 prodotti

### Fase 7: Deploy & Rollout (2 settimane)
- [ ] Deploy ambiente test
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Deploy produzione (graduale)
- [ ] Monitoraggio
- [ ] Dismissione vecchia repo

**Totale stimato: 16-18 settimane (~4-5 mesi)**

---

## ✅ Vantaggi Architettura Proposta

### Developer Experience
- ✅ Zero duplicazioni → manutenzione 90% più facile
- ✅ TypeScript strict → meno bug
- ✅ Hot reload velocissimo (standalone components)
- ✅ Nuovo prodotto = nuovo config file (30 min vs 2 settimane)

### Performance
- ✅ Bundle size ridotto del 60-70%
- ✅ Tree-shaking efficace
- ✅ Lazy loading reale
- ✅ Signals → meno change detection

### Maintainability
- ✅ Single source of truth
- ✅ Testabilità 100%
- ✅ Separation of concerns
- ✅ SOLID principles

---

## 📚 Link Utili

- [Angular 18 Standalone Guide](https://angular.dev/guide/components)
- [Signals Deep Dive](https://angular.dev/guide/signals)
- [Angular Architecture Best Practices](https://angular.dev/style-guide)
- [Kentico Delivery SDK](https://github.com/kontent-ai/delivery-sdk-js)

---

**Next Steps:**
1. ✅ Completare questa analisi
2. ⏳ Creare documenti specifici (API, CSS, Components)
3. ⏳ Setup nuova repository
4. ⏳ Implementare core e shared
5. ⏳ Prodotto pilota tim-my-pet
