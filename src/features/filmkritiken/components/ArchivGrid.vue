<script setup lang="ts">
import type { Filmkritik } from '@/features/filmkritiken/types/filmkritik'
import FilmCard from './FilmCard.vue'

defineProps<{
  filme: Filmkritik[]
  apiBaseUrl: string
}>()
</script>

<template>
  <section>
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-4 px-1">
      <h2 class="text-cinema-text font-bold text-base uppercase tracking-widest">
        Zuletzt besprochen
      </h2>
      <router-link
        to="/archiv"
        class="text-cinema-text-muted text-sm hover:text-cinema-text transition-colors duration-150"
      >
        Alle ansehen ›
      </router-link>
    </div>

    <!-- Empty State -->
    <div
      v-if="filme.length === 0"
      class="flex flex-col items-center justify-center gap-3 py-12 text-center"
    >
      <span class="text-5xl">🎞️</span>
      <p class="text-cinema-text-muted font-medium">Noch keine besprochenen Filme</p>
    </div>

    <!-- Mobile: Horizontal Snap Scroll -->
    <div class="lg:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
      <FilmCard
        v-for="film in filme"
        :key="film.id"
        :filmkritik="film"
        :api-base-url="apiBaseUrl"
      />
    </div>

    <!-- Desktop: 4-Column Grid -->
    <div class="hidden lg:grid lg:grid-cols-4 lg:gap-6">
      <FilmCard
        v-for="film in filme"
        :key="film.id"
        :filmkritik="film"
        :api-base-url="apiBaseUrl"
      />
    </div>
  </section>
</template>
