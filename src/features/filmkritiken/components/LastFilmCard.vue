<script setup lang="ts">
import { computed } from 'vue'
import type { Filmkritik, Bewertung } from '@/features/filmkritiken/types/filmkritik'
import { getDurchschnittsBewertung, getPosterUrl, formatDatum, getBesprochenAm, getBeitragVon } from '@/features/filmkritiken/composables/useFilmkritiken'

const props = defineProps<{
  filmkritik: Filmkritik | null
  apiBaseUrl: string
}>()

const posterUrl = computed(() =>
  props.filmkritik ? getPosterUrl(props.filmkritik, props.apiBaseUrl) : null
)

const durchschnitt = computed(() =>
  props.filmkritik ? getDurchschnittsBewertung(props.filmkritik) : null
)

const datum = computed(() =>
  props.filmkritik ? formatDatum(getBesprochenAm(props.filmkritik)) : null
)

const beitragVon = computed(() =>
  props.filmkritik ? getBeitragVon(props.filmkritik) : null
)

function ratingLabel(b: Bewertung): string {
  if (b.enthaltung) return '— Enthaltung'
  if (b.wertung !== null) return `${b.wertung.toFixed(1)}`
  return '—'
}
</script>

<template>
  <!-- Karte B: Letzte Besprechung -->
  <div class="bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col">

    <!-- Header -->
    <div class="px-6 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
      <h2 class="text-cinema-text font-bold text-lg uppercase tracking-wide">Letzte Besprechung</h2>
      <!-- Durchschnitts-Badge -->
      <div
        v-if="durchschnitt !== null"
        class="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-sm"
      >
        ★ {{ durchschnitt.toFixed(1) }}
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!filmkritik"
      class="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
    >
      <span class="text-5xl">📽️</span>
      <p class="text-cinema-text-muted font-medium">Noch keine Besprechungen</p>
      <p class="text-cinema-text-muted/60 text-sm">Die erste Filmkritik erscheint hier.</p>
    </div>

    <!-- Film Content -->
    <div v-else class="flex-1 flex flex-col">
      <!-- Poster + Film Info (horizontal layout) -->
      <div class="flex gap-4 p-4">
        <!-- Kleines Poster -->
        <div class="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="filmkritik.film.titel"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-end p-1.5"
          >
            <span class="text-white text-xs font-bold leading-tight">
              {{ filmkritik.film.titel }}
            </span>
          </div>
        </div>

        <!-- Film Metadata -->
        <div class="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 class="text-cinema-text font-bold text-base leading-snug line-clamp-2">
              {{ filmkritik.film.titel }}
            </h3>
            <p v-if="filmkritik.film.erscheinungsjahr" class="text-cinema-text-muted text-sm mt-0.5">
              {{ filmkritik.film.erscheinungsjahr }}
            </p>
          </div>
          <div class="text-sm text-cinema-text-muted mt-2">
            <div v-if="datum" class="flex items-center gap-1.5">
              <span class="text-sm">📅</span>
              <span>{{ datum }}</span>
            </div>
            <div v-if="beitragVon" class="flex items-center gap-1.5 mt-1">
              <span class="text-sm">👤</span>
              <span>{{ beitragVon }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Individuelle Mitglieder-Bewertungen -->
      <div class="px-4 pb-4 flex-1">
        <p class="text-cinema-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
          Bewertungen
        </p>
        <div v-if="filmkritik.bewertungen.length > 0" class="space-y-2">
          <div
            v-for="bewertung in filmkritik.bewertungen"
            :key="bewertung.von"
            class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/5"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm">👤</span>
              <span class="text-cinema-text-muted text-sm font-medium">{{ bewertung.von }}</span>
            </div>
            <span
              class="text-sm font-bold"
              :class="bewertung.enthaltung ? 'text-cinema-text-muted/60' : 'text-amber-300'"
            >
              {{ ratingLabel(bewertung) }}
            </span>
          </div>
        </div>
        <p v-else class="text-cinema-text-muted/60 text-sm">
          Noch keine Bewertungen abgegeben.
        </p>
      </div>
    </div>
  </div>
</template>
