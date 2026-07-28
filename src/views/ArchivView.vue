<script setup lang="ts">
import { ref } from 'vue'
import FilmCard from '@/features/filmkritiken/components/FilmCard.vue'
import { useArchivFilter } from '@/features/filmkritiken/composables/useArchivFilter'

const apiBaseUrl = import.meta.env.VITE_API_URL as string
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
  totalCount,
  isFilterActive,
  isLoading,
  loadMore,
  resetFilters,
} = useArchivFilter()
</script>

<template>
  <div class="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-cinema-text tracking-tight flex items-center gap-3">
          <span>Filmkritiken-Archiv</span>
        </h1>
        <p class="text-cinema-text-muted mt-1 text-sm">
          Alle bisher besprochenen Filme durchsuchen und filtern.
        </p>
      </div>
    </div>

    <!-- Filter Component -->
    <div class="cinema-glass p-6 rounded-2xl space-y-4">
      <!-- Direct Search & Filter Toggle Row -->
      <div class="flex flex-col sm:flex-row gap-4 items-center">
        <!-- Title Input -->
        <div class="flex-1 w-full relative">
          <label for="archiv-suche-input" class="sr-only">Titel suchen</label>
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-cinema-text-muted">
            🔍
          </span>
          <input
            id="archiv-suche-input"
            name="archiv-suche"
            v-model="suche"
            type="text"
            placeholder="Titel suchen..."
            class="input-cinema-glass w-full pl-10 pr-4 py-2 text-sm text-cinema-text placeholder-cinema-text-muted rounded-xl border border-white/10 focus:border-amber-500 focus:outline-none transition-colors"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <!-- Toggle Filter Collapse Button -->
          <button
            @click="showFilters = !showFilters"
            class="btn-slate-glass flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-xl border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <span>⚙️ Filter</span>
            <span class="text-xs transition-transform duration-200" :class="{ 'rotate-180': showFilters }">▼</span>
          </button>

          <!-- Reset Filter Button -->
          <button
            v-if="isFilterActive"
            @click="resetFilters"
            class="text-xs text-amber-400 hover:text-amber-300 transition-colors underline whitespace-nowrap"
          >
            Filter zurücksetzen
          </button>
        </div>
      </div>

      <!-- Collapsible Additional Filters -->
      <div v-show="showFilters" class="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Besprechungsjahr Filter -->
        <div class="space-y-1">
          <label for="archiv-jahr-select" class="block text-xs font-semibold text-cinema-text-muted uppercase tracking-wider">
            Besprechungsjahr
          </label>
          <select
            id="archiv-jahr-select"
            name="archiv-jahr"
            v-model="jahr"
            class="input-cinema-glass w-full px-3 py-2 text-sm text-cinema-text bg-zinc-900 border border-white/10 rounded-xl focus:border-amber-500 focus:outline-none"
          >
            <option :value="null">Alle Jahre</option>
            <option v-for="j in verfuegbareJahre" :key="j" :value="j">
              {{ j }}
            </option>
          </select>
        </div>

        <!-- Beitrag von Filter -->
        <div class="space-y-1">
          <label for="archiv-beitragvon-select" class="block text-xs font-semibold text-cinema-text-muted uppercase tracking-wider">
            Eingereicht von
          </label>
          <select
            id="archiv-beitragvon-select"
            name="archiv-beitragvon"
            v-model="beitragvon"
            class="input-cinema-glass w-full px-3 py-2 text-sm text-cinema-text bg-zinc-900 border border-white/10 rounded-xl focus:border-amber-500 focus:outline-none"
          >
            <option value="">Alle Mitglieder</option>
            <option v-for="b in verfuegbareBeitragende" :key="b" :value="b">
              {{ b }}
            </option>
          </select>
        </div>

        <!-- Sortierung Select -->
        <div class="space-y-1">
          <label for="archiv-sortierung-select" class="block text-xs font-semibold text-cinema-text-muted uppercase tracking-wider">
            Sortierung
          </label>
          <select
            id="archiv-sortierung-select"
            name="archiv-sortierung"
            v-model="sortierung"
            class="input-cinema-glass w-full px-3 py-2 text-sm text-cinema-text bg-zinc-900 border border-white/10 rounded-xl focus:border-amber-500 focus:outline-none"
          >
            <option value="neueste">Neueste zuerst</option>
            <option value="aelteste">Älteste zuerst</option>
            <option value="beste">Beste Bewertung zuerst</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div>
      <!-- Skeleton Loader -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
        <div
          v-for="i in 12"
          :key="i"
          class="aspect-[2/3] w-full max-w-[220px] rounded-xl bg-white/5 animate-pulse border border-white/5"
        />
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
            Mehr laden ({{ Math.max(0, totalCount - paginatedFilmkritiken.length) }} weitere)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
