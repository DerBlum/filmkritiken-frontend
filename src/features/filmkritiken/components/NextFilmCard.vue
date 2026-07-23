<script setup lang="ts">
import { computed } from 'vue'
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
  <div class="bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col">

    <!-- Header -->
    <div class="px-6 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
      <h2 class="text-cinema-text font-bold text-lg uppercase tracking-wide">Nächster Film</h2>
      <!-- Bewertungen-offen Badge -->
      <span
        v-if="bewertungOffen"
        class="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold"
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
    <div v-else class="flex-1 flex flex-col">
      <!-- Poster Container -->
      <div class="relative aspect-video overflow-hidden bg-black/60 flex items-center justify-center">
        <!-- Blurred Background Backdrop -->
        <img
          v-if="posterUrl"
          :src="posterUrl"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
        />
        <!-- Fully Visible Uncropped Poster -->
        <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="filmkritik.film.titel"
          class="relative w-full h-full object-contain p-2 z-10"
        />
        <!-- Fallback: Titelkarte (Amber → Rose Gradient) -->
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-end p-4"
        >
          <span class="text-white font-bold text-xl leading-tight drop-shadow-lg">
            {{ filmkritik.film.titel }}
          </span>
        </div>
      </div>

      <!-- Film Metadata -->
      <div class="px-6 py-4 flex-1 flex flex-col gap-4">
        <div>
          <h3 class="text-cinema-text font-bold text-xl leading-tight">
            {{ filmkritik.film.titel }}
          </h3>
          <p v-if="filmkritik.film.erscheinungsjahr" class="text-cinema-text-muted text-sm mt-1">
            {{ filmkritik.film.erscheinungsjahr }}
          </p>
        </div>

        <div class="flex flex-col gap-2 text-sm text-cinema-text-muted">
          <div v-if="beitragVon" class="flex items-center gap-2">
            <span class="text-base">👤</span>
            <span>Beitrag von <strong class="text-cinema-text">{{ beitragVon }}</strong></span>
          </div>
          <div v-if="datum" class="flex items-center gap-2">
            <span class="text-base">📅</span>
            <span>{{ datum }}</span>
          </div>
        </div>

        <!-- CTA Buttons (disabled placeholders) -->
        <div class="flex gap-3 mt-auto pt-2">
          <button
            disabled
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-cinema-text-muted text-sm font-medium cursor-not-allowed opacity-50"
            title="Kalender-Export – verfügbar in Phase 6"
          >
            🗓️ Kalender
          </button>
          <button
            disabled
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cinema-red/20 border border-cinema-red/30 text-cinema-text-muted text-sm font-medium cursor-not-allowed opacity-50"
            title="Bewertung abgeben – verfügbar in Phase 3"
          >
            ⭐ Bewerten
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
