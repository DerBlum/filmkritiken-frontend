<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const titles: Record<string, string> = {
  '/archiv': 'Archiv',
  '/watchlist': 'Watchlist',
  '/stats': 'Statistiken',
  '/login': 'Login',
}

const title = titles[route.path] ?? 'Seite'
</script>

<template>
  <div class="px-4 py-8 lg:px-8 lg:py-12 flex flex-col items-center justify-center min-h-96">
    <div class="text-center space-y-4">
      <span class="text-6xl block">🚧</span>
      <h1 class="text-cinema-text font-bold text-2xl">{{ title }}</h1>
      <p class="text-cinema-text-muted">
        Diese Seite wird zu einem späteren Zeitpunkt zur Verfügung stehen.
      </p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cinema-red hover:opacity-90 text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        ← Zurück zur Startseite
      </router-link>
    </div>
  </div>
</template>
