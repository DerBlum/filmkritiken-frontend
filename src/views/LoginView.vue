<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-zinc-950 to-black relative overflow-hidden">
    <!-- Ambient glow behind card -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-cinema-red/15 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-cinema-red/10 rounded-full blur-3xl pointer-events-none" />

    <div class="w-full max-w-md bg-black/75 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 relative z-10">
      <!-- Header / Logo -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cinema-red/20 border border-cinema-red/30 mb-2">
          <span class="text-3xl">🎥</span>
        </div>
        <h1 class="text-2xl font-bold text-cinema-text">Willkommen beim Filmtreff</h1>
        <p class="text-sm text-cinema-text-muted">
          Melde dich mit deinem Microsoft-Konto an, um Bewertungen abzugeben und neue Filme vorzuschlagen.
        </p>
      </div>

      <!-- Login Action -->
      <div class="space-y-4 pt-2">
        <button
          @click="login"
          class="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-cinema-red hover:bg-cinema-red/90 text-white font-semibold rounded-xl shadow-lg shadow-cinema-red/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <!-- Microsoft Icon SVG -->
          <svg class="w-5 h-5" viewBox="0 0 21 21" fill="currentColor">
            <path d="M1 1h9v9H1z" fill="#f25022"/>
            <path d="M11 1h9v9h-9z" fill="#7fba00"/>
            <path d="M1 11h9v9H1z" fill="#00a4ef"/>
            <path d="M11 11h9v9h-9z" fill="#ffb900"/>
          </svg>
          <span>Mit Microsoft anmelden</span>
        </button>

        <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-cinema-text-muted text-center leading-relaxed">
          ℹ️ Public Access: Filmkritiken und Archiv sind auch ohne Anmeldung frei zugänglich.
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center pt-2">
        <router-link
          to="/"
          class="inline-flex items-center gap-1.5 text-sm text-cinema-text-muted hover:text-cinema-text transition-colors"
        >
          <span>←</span>
          <span>Zurück zur Startseite</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
