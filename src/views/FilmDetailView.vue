<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  fetchFilmkritikById,
  updateBewertungOffen,
} from '@/features/filmkritiken/services/filmkritikenService'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import {
  getDurchschnittsBewertung,
  getPosterUrl,
  formatDatum,
} from '@/features/filmkritiken/composables/useFilmkritiken'
import BewertungsFormular from '@/features/filmkritiken/components/BewertungsFormular.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const apiBaseUrl = import.meta.env.VITE_API_URL as string

const filmkritik = ref<Filmkritik | null>(null)
const isLoading = ref(true)
const isNotFound = ref(false)
const isTogglingState = ref(false)

const posterUrl = computed(() =>
  filmkritik.value ? getPosterUrl(filmkritik.value, apiBaseUrl) : null
)
const durchschnitt = computed(() =>
  filmkritik.value ? getDurchschnittsBewertung(filmkritik.value) : null
)
const datumFormatiert = computed(() =>
  filmkritik.value ? formatDatum(filmkritik.value.details.besprochenam) : null
)

async function loadDetail(): Promise<void> {
  const filmId = route.params.id as string
  if (!filmId) {
    isNotFound.value = true
    isLoading.value = false
    return
  }

  isLoading.value = true
  isNotFound.value = false

  try {
    const data = await fetchFilmkritikById(filmId)
    if (!data) {
      isNotFound.value = true
    } else {
      filmkritik.value = data
    }
  } catch {
    isNotFound.value = true
  } finally {
    isLoading.value = false
  }
}

async function handleToggleBewertungOffen(): Promise<void> {
  if (!filmkritik.value) return
  const newState = !filmkritik.value.details.bewertungoffen
  isTogglingState.value = true
  try {
    await updateBewertungOffen(filmkritik.value.id, newState)
    showToast(
      newState ? 'Bewertungen wurden geöffnet.' : 'Bewertungen wurden geschlossen.',
      'success'
    )
    await loadDetail()
  } catch {
    showToast('Fehler beim Ändern des Bewertungsstatus.', 'error')
  } finally {
    isTogglingState.value = false
  }
}

onMounted(() => {
  loadDetail()
})

watch(
  () => route.params.id,
  () => {
    loadDetail()
  }
)
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <!-- Back Button -->
    <div class="mb-6">
      <button
        @click="router.back()"
        class="inline-flex items-center gap-2 text-cinema-text-muted hover:text-white transition-colors duration-150 text-sm font-medium"
      >
        <span>←</span> Zurück
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
      <p class="text-cinema-text-muted font-medium text-sm">Filmkritik wird geladen...</p>
    </div>

    <!-- 404 Not Found State -->
    <div
      v-else-if="isNotFound || !filmkritik"
      class="cinema-glass rounded-2xl p-12 text-center max-w-xl mx-auto"
    >
      <span class="text-6xl mb-4 block">🎬</span>
      <h1 class="text-2xl font-bold text-cinema-text mb-2">Filmkritik nicht gefunden</h1>
      <p class="text-cinema-text-muted text-sm mb-6">
        Die angeforderte Filmkritik existiert nicht oder wurde entfernt.
      </p>
      <RouterLink
        to="/archiv"
        class="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2.5 rounded-lg transition-colors duration-150 shadow-lg text-sm"
      >
        Zum Archiv
      </RouterLink>
    </div>

    <!-- Detail Content -->
    <div v-else class="space-y-8">
      <!-- Main Header Banner (Glassmorphism) -->
      <div
        class="cinema-glass rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row gap-8 items-start"
      >
        <!-- Poster image -->
        <div class="w-full md:w-64 flex-shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl relative border border-white/10">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="filmkritik.film.titel"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full poster-fallback flex items-end p-6"
          >
            <span class="text-white font-extrabold text-xl drop-shadow-md">
              {{ filmkritik.film.titel }}
            </span>
          </div>
        </div>

        <!-- Info Column -->
        <div class="flex-1 space-y-4">
          <!-- Status Badges -->
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-if="filmkritik.details.bewertungoffen"
              class="badge-open"
            >
              Bewertung offen
            </span>
            <span
              v-else
              class="badge-closed"
            >
              Besprochen
            </span>

            <span
              v-if="durchschnitt !== null"
              class="badge-rating text-xs"
            >
              ★ {{ durchschnitt.toFixed(1) }} / 10
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl lg:text-4xl font-extrabold text-cinema-text leading-tight">
            {{ filmkritik.film.titel }}
          </h1>

          <!-- Original Title & Languages -->
          <p
            v-if="filmkritik.film.originaltitel && filmkritik.film.originaltitel !== filmkritik.film.titel"
            class="text-cinema-text-muted text-sm italic"
          >
            Originaltitel: {{ filmkritik.film.originaltitel }}
          </p>

          <!-- Metadata Pill List -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-white/10 text-sm">
            <div v-if="filmkritik.film.erscheinungsjahr">
              <span class="text-cinema-text-muted block text-xs">Jahr</span>
              <span class="text-cinema-text font-semibold">{{ filmkritik.film.erscheinungsjahr }}</span>
            </div>
            <div v-if="filmkritik.film.regie">
              <span class="text-cinema-text-muted block text-xs">Regie</span>
              <span class="text-cinema-text font-semibold">{{ filmkritik.film.regie }}</span>
            </div>
            <div v-if="filmkritik.film.laenge">
              <span class="text-cinema-text-muted block text-xs">Laufzeit</span>
              <span class="text-cinema-text font-semibold">{{ filmkritik.film.laenge }} Min.</span>
            </div>
            <div v-if="filmkritik.film.produktionsland">
              <span class="text-cinema-text-muted block text-xs">Land</span>
              <span class="text-cinema-text font-semibold">{{ filmkritik.film.produktionsland }}</span>
            </div>
            <div v-if="filmkritik.film.altersfreigabe !== undefined && filmkritik.film.altersfreigabe !== null">
              <span class="text-cinema-text-muted block text-xs">FSK</span>
              <span class="text-cinema-text font-semibold">{{ filmkritik.film.altersfreigabe }}</span>
            </div>
            <div v-if="filmkritik.details.beitragvon">
              <span class="text-cinema-text-muted block text-xs">Beitrag von</span>
              <span class="text-cinema-text font-semibold">{{ filmkritik.details.beitragvon }}</span>
            </div>
          </div>

          <!-- Besprochen am -->
          <p v-if="datumFormatiert" class="text-xs text-cinema-text-muted">
            Besprochen am <span class="text-cinema-text font-medium">{{ datumFormatiert }}</span>
          </p>
        </div>
      </div>

      <!-- Ratings List Card -->
      <div class="cinema-glass rounded-2xl p-6 space-y-4">
        <h2 class="text-xl font-bold text-cinema-text flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span>Bewertungen</span>
            <!-- Toggle Open/Close Button (nur für Benutzer mit bewertung.openclose Berechtigung) -->
            <button
              v-if="authStore.hasPermission('bewertung.openclose')"
              @click="handleToggleBewertungOffen"
              :disabled="isTogglingState"
              class="btn-slate-glass text-xs py-1 px-2.5 flex items-center gap-1.5 font-normal rounded-lg transition-all"
              :title="filmkritik.details.bewertungoffen ? 'Bewertung schließen' : 'Bewertung öffnen'"
            >
              <span>{{ filmkritik.details.bewertungoffen ? '🔒 Schließen' : '🔓 Öffnen' }}</span>
            </button>
          </div>
          <span class="text-xs text-cinema-text-muted font-normal">
            {{ filmkritik.bewertungen?.length ?? 0 }} {{ (filmkritik.bewertungen?.length === 1) ? 'Bewertung' : 'Bewertungen' }}
          </span>
        </h2>

        <!-- No Ratings yet -->
        <div v-if="!filmkritik.bewertungen || filmkritik.bewertungen.length === 0" class="py-6 text-center text-cinema-text-muted text-sm">
          Noch keine Bewertungen abgegeben.
        </div>

        <!-- Rating Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(b, idx) in filmkritik.bewertungen"
            :key="idx"
            class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/5 shadow-inner"
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
      </div>

      <!-- Bewertungs-Formular (nur wenn bewertungoffen: true) -->
      <BewertungsFormular
        v-if="filmkritik.details.bewertungoffen"
        :filmkritik-id="filmkritik.id"
        :bewertungen="filmkritik.bewertungen"
        @submitted="loadDetail"
      />
    </div>
  </div>
</template>
