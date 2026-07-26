<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
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
  <RouterLink
    :to="'/film/' + filmkritik.id"
    class="group block w-36 sm:w-44 lg:w-full flex-shrink-0 snap-start cinema-glass-interactive rounded-xl overflow-hidden cursor-pointer"
  >
    <!-- Poster / Titelkarte -->
    <div class="relative aspect-[2/3] overflow-hidden">
      <!-- Real Poster -->
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="filmkritik.film.titel"
        class="w-full h-full object-cover poster-zoom"
        loading="lazy"
      />
      <!-- Fallback: Titelkarte (Amber → Rose Gradient) -->
      <div
        v-else
        class="w-full h-full poster-fallback flex items-end p-3 poster-zoom"
      >
        <span class="text-white font-bold text-sm leading-tight drop-shadow-lg line-clamp-3">
          {{ filmkritik.film.titel }}
        </span>
      </div>

      <!-- Rating Badge (nur wenn Bewertungen vorhanden) -->
      <div
        v-if="durchschnitt !== null"
        class="absolute top-2 right-2 badge-rating text-xs px-2 py-0.5"
      >
        {{ durchschnitt.toFixed(1) }} ★
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
  </RouterLink>
</template>
