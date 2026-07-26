<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FilmCard from '@/features/filmkritiken/components/FilmCard.vue'
import { fetchFilmkritiken } from '@/features/filmkritiken/services/filmkritikenService'
import { useArchivFilter } from '@/features/filmkritiken/composables/useArchivFilter'
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'

const apiBaseUrl = import.meta.env.VITE_API_URL as string

const allFilmkritiken = ref<Filmkritik[]>([])
const isLoading = ref<boolean>(true)

const showFilters = ref<boolean>(false)

const {
  suche,
  jahr,
  beitragvon,
  sortierung,
  verfuegbareJahre,
  verfuegbareBeitragende,
  filteredFilmkritiken,
  paginatedFilmkritiken,
  hasMore,
  isFilterActive,
  loadMore,
  resetFilters,
} = useArchivFilter(allFilmkritiken)

onMounted(async () => {
  isLoading.value = true
  try {
    allFilmkritiken.value = await fetchFilmkritiken()
  } catch (err) {
    console.error('Fehler beim Laden des Archivs:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-cinema-text tracking-tight flex items-center gap-3">
          <span>🍿</span>
          <span>Filmkritiken-Archiv</span>
        </h1>
        <p class="text-cinema-text-muted text-sm mt-1">
          Alle besprochenen Filme und Mitglieder-Bewertungen im Überblick
        </p>
      </div>

      <!-- Count Badge -->
      <div v-if="!isLoading" class="text-xs font-medium text-cinema-text-muted">
        <span class="text-cinema-text font-bold text-base">{{ filteredFilmkritiken.length }}</span>
        {{ filteredFilmkritiken.length === 1 ? 'Film' : 'Filme' }} gefunden
      </div>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="cinema-glass rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
      <div class="flex items-center gap-3">
        <!-- Search Input (always visible) -->
        <div class="relative flex-1">
          <label for="archiv-suche-input" class="sr-only">Nach Filmtitel suchen</label>
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-cinema-text-muted pointer-events-none text-sm">
            🔍
          </span>
          <input
            id="archiv-suche-input"
            name="suche"
            type="text"
            v-model="suche"
            placeholder="Nach Titel suchen..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-cinema-text placeholder-cinema-text-muted text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
          />
        </div>

        <!-- Filter Toggle Button -->
        <button
          @click="showFilters = !showFilters"
          class="btn-slate-glass text-xs py-2.5 px-4 flex items-center gap-2 font-medium whitespace-nowrap rounded-xl transition-all"
          :class="{ 'bg-amber-500/20 border-amber-500/40 text-amber-300': isFilterActive || showFilters }"
          title="Filter & Sortierung anpassen"
        >
          <span>⚙️ Filter</span>
          <span v-if="isFilterActive" class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
          <span class="text-[10px] text-cinema-text-muted ml-0.5">{{ showFilters ? '▲' : '▼' }}</span>
        </button>
      </div>

      <!-- Collapsible Additional Filters (Hidden by default) -->
      <div v-if="showFilters" class="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Besprechungsjahr Filter -->
        <div class="space-y-1">
          <label for="archiv-jahr-select" class="text-[11px] font-semibold text-cinema-text-muted uppercase tracking-wider block">
            Besprechungsjahr
          </label>
          <select
            id="archiv-jahr-select"
            name="jahr"
            v-model.number="jahr"
            class="w-full bg-slate-900/80 border border-white/10 text-cinema-text text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400/50 cursor-pointer"
          >
            <option :value="null">Alle Jahre</option>
            <option v-for="j in verfuegbareJahre" :key="j" :value="j">
              {{ j }}
            </option>
          </select>
        </div>

        <!-- Beitrag von Filter -->
        <div class="space-y-1">
          <label for="archiv-beitrag-select" class="text-[11px] font-semibold text-cinema-text-muted uppercase tracking-wider block">
            Beitrag von
          </label>
          <select
            id="archiv-beitrag-select"
            name="beitragvon"
            v-model="beitragvon"
            class="w-full bg-slate-900/80 border border-white/10 text-cinema-text text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400/50 cursor-pointer"
          >
            <option value="">Alle Beitragende</option>
            <option v-for="b in verfuegbareBeitragende" :key="b" :value="b">
              {{ b }}
            </option>
          </select>
        </div>

        <!-- Sortierung Dropdown -->
        <div class="space-y-1">
          <label for="archiv-sortierung-select" class="text-[11px] font-semibold text-cinema-text-muted uppercase tracking-wider block">
            Sortierung
          </label>
          <select
            id="archiv-sortierung-select"
            name="sortierung"
            v-model="sortierung"
            class="w-full bg-slate-900/80 border border-white/10 text-cinema-text text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400/50 cursor-pointer"
          >
            <option value="neueste">Neueste zuerst</option>
            <option value="aelteste">Älteste zuerst</option>
            <option value="beste">Beste Bewertung</option>
          </select>
        </div>
      </div>

      <!-- Active Filter Reset Badge -->
      <div v-if="isFilterActive" class="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <span class="text-cinema-text-muted">Aktive Filter angewendet</span>
        <button
          @click="resetFilters"
          class="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
        >
          ✕ Filter zurücksetzen
        </button>
      </div>
    </div>

    <!-- Loading Skeleton State -->
    <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
      <div
        v-for="i in 12"
        :key="i"
        class="w-full aspect-[2/3] rounded-xl bg-slate-800/50 animate-pulse border border-white/5"
      ></div>
    </div>

    <!-- Empty State (No Results) -->
    <div
      v-else-if="filteredFilmkritiken.length === 0"
      class="cinema-glass rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 my-12"
    >
      <span class="text-5xl block">🔎</span>
      <h3 class="text-xl font-bold text-cinema-text">Keine Filmkritiken gefunden</h3>
      <p class="text-sm text-cinema-text-muted">
        Es wurden keine Filme gefunden, die den gewählten Filterkriterien entsprechen.
      </p>
      <button
        @click="resetFilters"
        class="btn-amber-glass text-xs py-2 px-5 inline-block"
      >
        Filter zurücksetzen
      </button>
    </div>

    <!-- Movie Grid -->
    <div v-else class="space-y-10">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
        <FilmCard
          v-for="filmkritik in paginatedFilmkritiken"
          :key="filmkritik.id"
          :filmkritik="filmkritik"
          :api-base-url="apiBaseUrl"
        />
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="text-center pt-4">
        <button
          @click="loadMore"
          class="btn-slate-glass px-10 py-3 text-sm font-semibold shadow-2xl hover:scale-105 transition-transform"
        >
          Mehr laden ({{ filteredFilmkritiken.length - paginatedFilmkritiken.length }} weitere)
        </button>
      </div>
    </div>
  </div>
</template>
