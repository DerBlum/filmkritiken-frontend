<script setup lang="ts">
import { computed } from 'vue'
import { useFilmkritiken, getNextFilm, getLastFilm, getArchivFilme } from '@/features/filmkritiken/composables/useFilmkritiken'
import NextFilmCard from '@/features/filmkritiken/components/NextFilmCard.vue'
import LastFilmCard from '@/features/filmkritiken/components/LastFilmCard.vue'
import ArchivGrid from '@/features/filmkritiken/components/ArchivGrid.vue'

const apiBaseUrl = import.meta.env.VITE_API_URL as string

const { filmkritiken, isLoading, error } = useFilmkritiken()

const nextFilm = computed(() => getNextFilm(filmkritiken.value))
const lastFilm = computed(() => getLastFilm(filmkritiken.value))
const archivFilme = computed(() => getArchivFilme(filmkritiken.value, nextFilm.value, lastFilm.value))
</script>

<template>
  <div class="px-4 py-6 lg:px-8 lg:py-8 max-w-screen-xl mx-auto">

    <!-- Page Title -->
    <header class="mb-8">
      <h1 class="text-cinema-text font-bold text-2xl lg:text-3xl tracking-tight">
        Willkommen beim Filmclub
      </h1>
      <p class="text-cinema-text-muted mt-1">
        Unsere besprochenen Filme und der nächste Filmabend.
      </p>
    </header>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-8">
      <!-- Hero Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="i in 2"
          :key="i"
          class="h-80 rounded-2xl bg-white/5 animate-pulse border border-white/5"
        />
      </div>
      <!-- Grid Skeleton -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div
          v-for="i in 8"
          :key="i"
          class="aspect-[2/3] rounded-xl bg-white/5 animate-pulse border border-white/5"
        />
      </div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-10">

      <!-- Hero Section: Nächster Film + Letzte Besprechung -->
      <section>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Karte A: Nächster Film -->
          <NextFilmCard
            :filmkritik="nextFilm"
            :api-base-url="apiBaseUrl"
          />
          <!-- Karte B: Letzte Besprechung -->
          <LastFilmCard
            :filmkritik="lastFilm"
            :api-base-url="apiBaseUrl"
          />
        </div>
      </section>

      <!-- Archiv Grid -->
      <ArchivGrid
        :filme="archivFilme"
        :api-base-url="apiBaseUrl"
      />

    </div>
  </div>
</template>
