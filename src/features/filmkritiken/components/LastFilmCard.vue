<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
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
</script>

<template>
  <!-- Karte B: Letzte Besprechung -->
  <div class="cinema-glass rounded-2xl overflow-hidden flex flex-col">

    <!-- Header -->
    <div class="px-6 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
      <h2 class="text-cinema-text font-bold text-lg uppercase tracking-wide">Letzte Besprechung</h2>
      <!-- Durchschnitts-Badge -->
      <div
        v-if="durchschnitt !== null"
        class="badge-rating text-sm"
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
    <div v-else class="p-6 flex-1 flex flex-col gap-6">
      <!-- Top: Poster (Left) + Metadata (Right) -->
      <div class="flex gap-6 items-start">
        <!-- Large Crisp Poster (Left) -->
        <RouterLink
          :to="'/film/' + filmkritik.id"
          class="group/poster flex-shrink-0 w-32 sm:w-40 md:w-44 aspect-[2/3] rounded-xl overflow-hidden cursor-pointer block border border-white/10 shadow-2xl relative"
        >
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="filmkritik.film.titel"
            class="w-full h-full object-cover poster-zoom"
          />
          <div
            v-else
            class="w-full h-full poster-fallback flex items-end p-3 poster-zoom"
          >
            <span class="text-white font-bold text-sm leading-tight drop-shadow-lg line-clamp-3">
              {{ filmkritik.film.titel }}
            </span>
          </div>
        </RouterLink>

        <!-- Metadata Column (Right) -->
        <div class="flex-1 min-w-0 space-y-3">
          <div>
            <RouterLink
              :to="'/film/' + filmkritik.id"
              class="text-cinema-text hover:text-amber-400 transition-colors duration-150 font-extrabold text-xl sm:text-2xl leading-snug block line-clamp-2"
            >
              {{ filmkritik.film.titel }}
            </RouterLink>
            <p v-if="filmkritik.film.erscheinungsjahr" class="text-cinema-text-muted text-sm mt-1 font-medium">
              {{ filmkritik.film.erscheinungsjahr }}
            </p>
          </div>

          <div class="space-y-2 text-sm text-cinema-text-muted pt-2 border-t border-white/10">
            <div v-if="filmkritik.film.regie" class="flex items-center gap-2">
              <span class="text-cinema-text-muted text-xs">Regie:</span>
              <span class="text-cinema-text font-medium">{{ filmkritik.film.regie }}</span>
            </div>
            <div v-if="filmkritik.film.laenge" class="flex items-center gap-2">
              <span class="text-cinema-text-muted text-xs">Laufzeit:</span>
              <span class="text-cinema-text font-medium">{{ filmkritik.film.laenge }} Min.</span>
            </div>
            <div v-if="beitragVon" class="flex items-center gap-2">
              <span class="text-base">👤</span>
              <span>Beitrag von <strong class="text-cinema-text font-semibold">{{ beitragVon }}</strong></span>
            </div>
            <div v-if="datum" class="flex items-center gap-2">
              <span class="text-base">📅</span>
              <span class="text-cinema-text font-medium">{{ datum }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom: Full-Width 2-Column Member Ratings -->
      <div class="mt-auto pt-4 border-t border-white/10">
        <p class="text-cinema-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
          Bewertungen
        </p>
        <div v-if="filmkritik.bewertungen.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div
            v-for="b in filmkritik.bewertungen"
            :key="b.von"
            class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/5"
          >
            <span class="text-cinema-text font-semibold text-sm">{{ b.von }}</span>

            <!-- Score Pill -->
            <span
              v-if="!b.enthaltung && b.wertung !== null"
              class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold"
            >
              ★ {{ b.wertung }} / 10
            </span>
            <!-- Enthaltung Pill -->
            <span
              v-else
              class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium italic"
            >
              Enthaltung
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
