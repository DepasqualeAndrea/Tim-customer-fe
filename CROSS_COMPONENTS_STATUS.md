# 🎯 Cross-Components Migration Status

## ✅ Completati

### FirstLevelStepperComponent
**Path:** `src/app/shared/checkout/ first-level-stepper/`
**Status:** ✅ Completato

**Descrizione:**
Componente cross-product che replica fedelmente la grafica originale dello stepper di primo livello del prodotto PET.

**Caratteristiche:**
- ✅ Template HTML identico al codice originale PET
- ✅ Logica di attivazione step basata su configurazione
- ✅ Integrazione Kentico per traduzioni dinamiche
- ✅ Supporto sub-state per insurance-info (choicePacket, choicePet)
- ✅ Stili SCSS con utility classes Bootstrap-compatibili
- ✅ Responsive design (mobile/tablet/desktop)

**Uso:**
```html
<app-first-level-stepper
  [productConfig]="config"
  [currentStep]="currentStep()"
  [insuranceInfoState]="insuranceInfoState()"
/>
```

**File Creati:**
1. `first-level-stepper.component.ts` - Logica del componente
2. `first-level-stepper.component.html` - Template HTML fedele all'originale
3. `first-level-stepper.component.scss` - Stili replicati da PET

**Integrato in:**
- ✅ `CheckoutOrchestratorComponent` - Sostituisce il template inline duplicato

---

## 🚧 Da Completare

### ShoppingCartComponent
**Status:** 🔄 Da migrare

Il componente esiste ma deve essere aggiornato per essere cross-product con:
- Configurazione dinamica prodotto
- Template dinamico per dati assicurazione
- Integrazione Kentico

### Componenti Step
I seguenti componenti devono essere migrati dal codice originale PET:

1. **InsuranceInfoStepComponent** 🔴 Alta Priorità
   - Pattern a pacchetti (packet-selector)
   - Pattern preventivatore (quotator)
   - Form dati assicurato dinamico

2. **AddressStepComponent** 🔴 Alta Priorità  
   - Form dati anagrafici
   - Validazione codice fiscale
   - Autocomplete città/province

3. **ConsensusesStepComponent** 🔴 Alta Priorità
   - Form consensi privacy
   - Checkbox dinamici

4. **LoginStepComponent** 🔴 Alta Priorità
   - SSO TIM integration
   - Login/Registrazione
   - Guest checkout

5. **SurveyStepComponent** 🟡 Media Priorità
   - Questionario dinamico
   - Form builder da config

6. **PaymentStepComponent** 🔴 Alta Priorità
   - Stripe integration (già esistente in nyp-stripe)
   - Da integrare con nuova architettura

7. **SuccessStepComponent** 🟢 Bassa Priorità
   - Pagina thank you
   - Download documenti
   - Analytics tracking

---

## 📋 Checklist Migrazione

### ✅ Fase 1: Setup & First Component
- [x] Creato struttura `shared/checkout/`
- [x] Implementato `FirstLevelStepperComponent`
- [x] Integrato in `CheckoutOrchestratorComponent`
- [x] Test visivo OK

### 🔄 Fase 2: Core Step Components (In Progress)
- [ ] Migrare `InsuranceInfoStepComponent`
  - [ ] Base component structure
  - [ ] Packet selector sub-component
  - [ ] Quotator sub-component
  - [ ] Form dati assicurato dinamico
- [ ] Migrare `AddressStepComponent`
- [ ] Migrare `LoginStepComponent`
- [ ] Migrare `ConsensusesStepComponent`

### ⏳ Fase 3: Secondary Components
- [ ] Migrare `SurveyStepComponent`
- [ ] Integrare `PaymentStepComponent` (nyp-stripe)
- [ ] Migrare `SuccessStepComponent`

### ⏳ Fase 4: Shopping Cart
- [ ] Aggiornare `ShoppingCartComponent` per cross-product
- [ ] Template dinamico packet summary
- [ ] Integrazione Kentico

### ⏳ Fase 5: Testing & Refinement
- [ ] Test end-to-end prodotto PET
- [ ] Verifica Kentico translations
- [ ] Verifica responsive design
- [ ] Performance audit

---

## 🎨 Pattern Replicati

### HTML Structure
```html
<!-- ORIGINALE PET (da replicare) -->
<div class="m-10px first-level-stepper-container row gx-1">
  <div class="pr-1 pl-0 col-4 d-flex align-items-end">
    <div class="first-level-stepper flex-grow-1"
      [ngClass]="condition ? 'active' : 'disabled'">
      <img [src]="kenticoImage" alt="...">
      <span>{{ kenticoLabel }}</span>
    </div>
  </div>
  <!-- ... altri step -->
</div>
```

### Kentico Integration
```typescript
// Pattern traduzione
translate(key: string): string {
  const fullKey = `${productConfig.kenticoKey}.${key}`;
  return this.kentico.translate(fullKey, productConfig.kenticoKey);
}

// Uso nel template
{{ translate('proposal_selection_label') }}
// → 'customers_tim_pet.proposal_selection_label' → "Selezione proposta"
```

### Stili SCSS
```scss
// Replica fedele classi originali
.first-level-stepper {
  &.active {
    background-color: #e6f2ff;
    border: 2px solid #005cbf;
    color: #005cbf;
  }
  
  &.disabled {
    background-color: #f5f5f5;
    border: 2px solid #e0e0e0;
    color: #9e9e9e;
  }
}
```

---

## 🚀 Prossimi Step

1. **Immediate:**
   - Migrare `InsuranceInfoStepComponent` (componente più complesso)
   - Creare packet-selector sub-component
   - Implementare form dinamico dati assicurato

2. **Questa Settimana:**
   - Completare step core (Address, Login, Consensuses)
   - Integrare Kentico per tutte le traduzioni
   - Test visivo di ogni step

3. **Prossima Settimana:**
   - Shopping Cart cross-product
   - Survey e Success steps
   - Testing end-to-end completo prodotto PET

---

## 📝 Note Importanti

1. **Non Inventare Nulla:** Replicare fedelmente HTML/SCSS del codice PET esistente
2. **Kentico Prima di Tutto:** Tutte le label e immagini devono venire da Kentico
3. **Configurazione Dinamica:** Ogni componente deve leggere ProductConfig
4. **Codice Originale come Reference:** Sempre consultare `src/app/modules/nyp-checkout/modules/tim-my-pet/components/`

## 🔗 File di Riferimento

**Codice Originale PET:**
- `src/app/modules/nyp-checkout/modules/tim-my-pet/components/checkout-orchestrator/`
- `src/app/modules/nyp-checkout/modules/tim-my-pet/components/checkout-step-insurance-info/`
- `src/app/modules/nyp-checkout/modules/tim-my-pet/components/checkout-step-address/`
- etc.

**Nuova Architettura:**
- `src/app/shared/checkout/` - Cross-components
- `src/app/features/checkout/` - Orchestrator
- `src/app/products/` - Configurazioni prodotti

---

**Ultimo Aggiornamento:** 2026-02-13  
**Status Progetto:** 🟡 In Progress (15% completato)
