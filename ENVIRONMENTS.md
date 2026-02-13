# 🌍 Configurazione Ambienti

## File Environment

### Development (`environment.development.ts`)
- Usa **proxy locale** (`proxy.conf.json`)
- API proxate verso ambiente DEV
- Adobe Analytics **disabilitato**
- Stripe **test mode**

### Staging (`environment.staging.ts`)
- Punta direttamente agli endpoint staging
- Adobe Analytics **abilitato** (test)
- Stripe **test mode**

### Production (`environment.production.ts`)
- Endpoint di produzione
- Adobe Analytics **abilitato**
- Stripe **live mode**

---

## 🔧 Configurazione Proxy (`proxy.conf.json`)

Il proxy viene usato SOLO in development per evitare problemi CORS.

```json
{
  "/api/*": {
    "target": "https://dev-api.tim-customer.com",
    "changeOrigin": true
  }
}
```

**⚠️ IMPORTANTE**: Aggiorna il `target` con l'URL corretto del tuo ambiente DEV!

---

## 🚀 Script NPM

### Development (con proxy)
```bash
npm start
# oppure
npm run start:dev
```
- Apre http://localhost:4200
- Usa proxy.conf.json
- Tutte le chiamate a `/api/*` vengono proxate

### Staging
```bash
npm run start:staging
```
- Usa environment.staging.ts
- Punta direttamente agli endpoint staging

### Build Production
```bash
npm run build:prod
```
- Ottimizzato per produzione
- Output in `/dist`

---

## 📝 TODO: Configurare gli Endpoint

Prima di avviare l'app, **aggiorna questi file** con gli URL corretti:

### 1. `proxy.conf.json`
```json
{
  "/api/*": {
    "target": "https://TUO-ENDPOINT-DEV",  // ← CAMBIA QUI
    ...
  }
}
```

### 2. `src/environments/environment.staging.ts`
```typescript
apiUrl: 'https://TUO-ENDPOINT-STAGING',  // ← CAMBIA QUI
```

### 3. `src/environments/environment.production.ts`
```typescript
apiUrl: 'https://TUO-ENDPOINT-PROD',     // ← CAMBIA QUI
```

### 4. Kentico & Stripe Keys
Aggiorna in **tutti** i file environment:
- `kenticoProjectId`
- `stripePublicKey`
- `adobeLaunchUrl`

---

## 🧪 Test degli Endpoint

Dopo aver configurato, testa che le API rispondano:

```bash
# Avvia dev server
npm start

# In un altro terminale, testa l'endpoint
curl http://localhost:4200/api/products/tim-my-pet
```

Se funziona, vedrai la risposta JSON del prodotto!

---

## 🔐 CORS & Sicurezza

- **Development**: Proxy risolve i problemi CORS
- **Staging/Production**: Il backend deve avere CORS configurato correttamente

Se vedi errori CORS in staging/prod, chiedi al backend di aggiungere:
```
Access-Control-Allow-Origin: https://tim-customer.com
```

---

## 📊 Verifica Configurazione

| Ambiente | Proxy | Ottimizzazione | Source Maps | Analytics |
|----------|-------|----------------|-------------|-----------|
| Development | ✅ | ❌ | ✅ | ❌ |
| Staging | ❌ | ✅ | ❌ | ✅ |
| Production | ❌ | ✅ | ❌ | ✅ |

