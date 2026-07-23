---
name: vue-frontend-stack
description: Erstellt und refactored Vue 3 Komponenten, Tailwind Styling (Cinema-Glass), Axios Services, Toast-System und Error Handling.
---

# Vue Frontend Stack

Entwicklungs-Standard für Vue 3 Frontend-Komponenten.

## Leading Words
- *Feature-Slice*: Domänen-basierte Ordnerstruktur (`src/features/<feature>/`).
- *Cinema-Glass*: Dunkler Kino-Look (`bg-slate-950`, `backdrop-blur-md`, `border-white/10`).
- *Encapsulated-Service*: Geplante API-Aufrufe via `apiClient.ts` mit `withCredentials: true`.
- *Resilient-State*: Deterministisches `isLoading` Reset im `finally`-Block & Toast-Feedback.

## 1. Feature-Slice Architecture

```
src/
├── features/<feature-name>/
│   ├── components/    # Presentation / Dumb Components (Props in, Events out)
│   ├── composables/   # State & Geschäftslogik (use<Feature>.ts)
│   ├── services/      # API Endpunkte & Data Fetching (<feature>Service.ts)
│   └── types/         # TypeScript DTOs & Schnittstellen
├── components/        # Shared UI (ToastContainer.vue, Card.vue)
├── composables/       # Shared Composables (useToast.ts)
└── services/          # Central API Client (apiClient.ts)
```

- **Script Setup**: Ausschließlich `<script setup lang="ts">`.
- **UI vs. Logik**: Dumb Components enthalten keine API-Aufrufe oder komplexe Berechnungen. Sämtliche Reaktivität wird in `composables/` gekapselt.

## 2. UI & Tailwind Styling (Cinema-Glass)

- **Utility Classes**: Verwende ausschließlich Tailwind Utility-Klassen direkt im HTML/Vue-Template (`class="..."`).
- **8px Spacing Grid**: Margins, Paddings und Gaps halten strikt das 8px-Raster ein (`p-2`, `p-4`, `gap-6`, `m-8`).
- **Cinema-Glass Aesthetic**:
  - Hintergründe: `bg-slate-950`, `bg-slate-900/80`
  - Glassmorphism: `bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl`
  - Akzente: `bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90`
  - Micro-Animations: `transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`

## 3. Toast-System (Eigenes Composable)

- Nutzen des internen Composables `src/composables/useToast.ts` (keine externen Toast-Libraries).
- **Interface**: `showToast(message: string, type: 'info' | 'success' | 'warning' | 'error', duration?: number)`
- **UI**: Gerendert über `src/components/ToastContainer.vue` in `App.vue` mit Cinema-Glass Styling.

## 4. API & Data Handler (Encapsulated-Service)

- Zentrale Instanz `src/services/apiClient.ts` mit `baseURL: import.meta.env.VITE_API_URL` und `withCredentials: true`.
- API-Aufrufe werden in `src/features/<feature-name>/services/<feature>Service.ts` gewrappte TypeScript-Funktionen ausgelagert.

## 5. Error & Fallback Manager (Resilient-State)

- **Axios Interceptors**:
  - `401`: Redirect zur Login-Route.
  - `403` / `5xx`: Trigger Toast via `useToast().showToast(...)`.
- **Deterministische Ladezustände**:
  Jeder async Call garantiert das Zurücksetzen des Loading-States im `finally`-Block:
  ```typescript
  try {
    isLoading.value = true
    data.value = await featureService.fetchData()
  } finally {
    isLoading.value = false
  }
  ```
- **Error Boundaries**: `onErrorCaptured` fängt Rendering-Abstürze in Container-Komponenten ab.

## Completion Criteria (Prüfbar)
1. Keine `.vue`-Datei enthält eigene `<style>`-Blöcke oder direkte API-Aufrufe.
2. Toast-Meldungen nutzen ausschließlich das eigene `useToast()` Composable.
3. Alle API-Aufrufe nutzen `apiClient` mit `withCredentials: true`.
4. Jeder asynchrone Aufruf setzt `isLoading` im `finally`-Block zurück.
5. Das Layout verwendet ausschließlich Tailwind 8px-Raster-Klassen und Glassmorphism-Klassen.
