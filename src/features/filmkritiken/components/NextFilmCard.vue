<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import { getPosterUrl, formatDatum, getBesprochenAm, getBeitragVon, isBewertungOffen } from '@/features/filmkritiken/composables/useFilmkritiken'

const props = defineProps<{
  filmkritik: Filmkritik | null
  apiBaseUrl: string
}>()

const posterUrl = computed(() =>
  props.filmkritik ? getPosterUrl(props.filmkritik, props.apiBaseUrl) : null
)

const datum = computed(() =>
  props.filmkritik ? formatDatum(getBesprochenAm(props.filmkritik)) : null
)

const beitragVon = computed(() =>
  props.filmkritik ? getBeitragVon(props.filmkritik) : null
)

const bewertungOffen = computed(() =>
  props.filmkritik ? isBewertungOffen(props.filmkritik) : false
)
</script>

<template>
  <!-- Karte A: Nächster Film -->
  <div class="cinema-glass rounded-2xl overflow-hidden flex flex-col">

    <!-- Header -->
    <div class="px-6 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
      <h2 class="text-cinema-text font-bold text-lg uppercase tracking-wide">Nächster Film</h2>
      <!-- Bewertungen-offen Badge -->
      <span
        v-if="bewertungOffen"
        class="badge-open"
      >
        Bewertungen offen
      </span>
    </div>

    <!-- Empty State -->
    <div
      v-if="!filmkritik"
      class="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
    >
      <span class="text-5xl">🎬</span>
      <p class="text-cinema-text-muted font-medium">Kein Film geplant</p>
      <p class="text-cinema-text-muted/60 text-sm">Der nächste Filmabend wird noch terminiert.</p>
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

      <!-- Bottom: Full Width Action Buttons -->
      <div class="mt-auto pt-4 border-t border-white/10 flex gap-3">
        <button
          disabled
          class="btn-slate-glass flex-1 cursor-not-allowed opacity-50"
          title="Kalender-Export – verfügbar in Phase 6"
        >
          🗓️ Kalender
        </button>
        <RouterLink
          v-if="filmkritik"
          :to="'/film/' + filmkritik.id"
          class="btn-amber-glass flex-1"
        >
          ⭐ Details
        </RouterLink>
      </div>
    </div>
  </div>
</template>
