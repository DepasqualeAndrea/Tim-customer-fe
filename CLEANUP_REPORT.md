# TIM Customer FE - Cleanup Report

## Obiettivo
Rimuovere tutti i componenti, moduli e funzionalità non correlati a TIM per semplificare e alleggerire la repository.

## Tenant da Rimuovere

### 1. Genertel
- Componenti assicurativi Genertel
- Login/Auth Genertel
- Prodotti Genertel

### 2. Intesa San Paolo
- Intesa Pet
- Login/Auth Intesa
- Prodotti Intesa

### 3. FCA (Fiat Chrysler Automobiles)
- Prodotti FCA
- Login/Auth FCA (SAML, Gigya)
- RC Auto FCA

### 4. Yolo (Brand Generico)
- Homepage Yolo
- Componenti Yolo generici

### 5. Altri Tenant
- Santalucia
- Civibank
- Carrefour
- Leasys
- Mediaworld
- Mopar
- Ravenna
- Imagin

## Componenti TIM da Mantenere

### Navbar
- navbar-tim.component
- navbar-tim-employees.component
- navbar-tim-customers.component

### Landing Pages
- landing-page-tim-employees.component
- landing-page-tim-customers.component

### Products
- products-tim-employees.component
- products-tim-customers.component

### Checkout Steps TIM
- checkout-step-insurance-info-tim-my-home
- checkout-step-insurance-info-tim-my-sci
- checkout-step-insurance-info-customers-tim-pet
- checkout-step-insurance-info-tim-motor
- checkout-step-insurance-info-tim-for-ski

### Complete Steps TIM
- checkout-linear-stepper-complete-tim-homage
- checkout-linear-stepper-complete-tim-payment
- checkout-linear-stepper-complete-tim-home
- checkout-linear-stepper-complete-tim-motor
- checkout-linear-stepper-complete-tim-for-ski
- checkout-linear-stepper-complete-customers-tim-pet

### Address Forms TIM
- address-form-tim.component
- address-form-tim-employees.component

### Login/Register TIM
- login-register-tim-retirees.component
- login-register-tim-customers.component
- login-register-tim-customers-checkout.component

### Support/Footer TIM
- support-tim.component
- footer-tim-mybroker.component
- prefooter-tim.component

### Static Pages TIM
- privacy-tim.component
- terms-tim.component
- cookies-tim.component
- complaints-tim.component
- chi-siamo-tim-mybroker.component
- tim-distance-sell-informative.component

## Strategia di Rimozione

1. ✅ Identificare tutti i file da rimuovere
2. ⏳ Rimuovere componenti tenant-specific
3. ⏳ Pulire imports nei moduli
4. ⏳ Rimuovere route non utilizzate
5. ⏳ Testare compilazione
6. ⏳ Commit progressivi

## Stima Impatto
- File da rimuovere: ~500+ file
- Riduzione repository: ~40-50%
- Tempo stimato: 30-45 minuti

---
*Generato il: 2026-02-13*
