<script setup lang="ts">
import { computed } from 'vue'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import { getDurchschnittsBewertung, getPosterUrl } from '@/features/filmkritiken/composables/useFilmkritiken'

const props = defineProps<{
  filmkritik: Filmkritik
  apiBaseUrl: string
}>()

const posterUrl = computed(() => getPosterUrl(props.filmkritik, props.apiBaseUrl))
const durchschnitt = computed(() => getDurchschnittsBewertung(props.filmkritik))
</script>

<template>
  <div
    class="group flex-shrink-0 w-44 lg:w-auto snap-start bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:border-white/20"
  >
    <!-- Poster / Titelkarte -->
    <div class="relative aspect-[2/3] overflow-hidden">
      <!-- Real Poster -->
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="filmkritik.film.titel"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Fallback: Titelkarte (Amber → Rose Gradient) -->
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-end p-3"
      >
        <span class="text-white font-bold text-sm leading-tight drop-shadow-lg line-clamp-3">
          {{ filmkritik.film.titel }}
        </span>
      </div>

      <!-- Rating Badge (nur wenn Bewertungen vorhanden) -->
      <div
        v-if="durchschnitt !== null"
        class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-amber-400/30 text-amber-300 text-xs font-bold"
      >
        ★ {{ durchschnitt.toFixed(1) }}
      </div>
    </div>

    <!-- Film Info -->
    <div class="px-3 py-3">
      <h3 class="text-cinema-text text-sm font-semibold leading-tight line-clamp-2">
        {{ filmkritik.film.titel }}
      </h3>
      <p v-if="filmkritik.film.erscheinungsjahr" class="text-cinema-text-muted text-xs mt-1">
        {{ filmkritik.film.erscheinungsjahr }}
      </p>
    </div>
  </div>
</template>
