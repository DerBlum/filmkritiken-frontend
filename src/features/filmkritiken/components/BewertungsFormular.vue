<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'
import { submitBewertung } from '@/features/filmkritiken/services/filmkritikenService'
import type { Bewertung } from '@/features/filmkritiken/types/filmkritik'

const props = defineProps<{
  filmkritikId: string
  bewertungen: Bewertung[]
}>()

const emit = defineEmits<{
  (e: 'submitted'): void
}>()

const authStore = useAuthStore()
const { showToast } = useToast()

const wert = ref<number>(5)
const enthaltung = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)

// Pre-fill existing rating if user is logged in and has already rated
watchEffect(() => {
  if (authStore.user && props.bewertungen) {
    const existing = props.bewertungen.find((b) => b.von === authStore.user)
    if (existing) {
      if (existing.enthaltung) {
        enthaltung.value = true
      } else if (existing.wertung !== null) {
        wert.value = existing.wertung
        enthaltung.value = false
      }
    }
  }
})

async function handleSubmit(): Promise<void> {
  if (!authStore.isAuthenticated || !authStore.user) {
    showToast('Bitte melde dich an, um eine Bewertung abzugeben.', 'warning')
    return
  }

  isSubmitting.value = true
  try {
    const payload = enthaltung.value
      ? { enthaltung: true }
      : { wertung: wert.value }

    await submitBewertung(props.filmkritikId, authStore.user, payload)
    showToast('Deine Bewertung wurde erfolgreich gespeichert.', 'success')
    emit('submitted')
  } catch (e: any) {
    // Interceptor zeigt bereits Server-Fehler, Fallback Toast falls nötig
    showToast('Fehler beim Speichern der Bewertung.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="cinema-glass rounded-2xl p-6 shadow-2xl space-y-6">
    <div class="flex items-center justify-between border-b border-white/10 pb-4">
      <h3 class="text-xl font-bold text-cinema-text">
        {{ authStore.user ? 'Deine Bewertung abgeben' : 'Bewertung abgeben' }}
      </h3>
      <span v-if="authStore.user" class="text-xs text-cinema-text-muted">
        Angemeldet als <strong class="text-cinema-text">{{ authStore.user }}</strong>
      </span>
    </div>

    <!-- Read-only notice for unauthenticated visitors -->
    <div
      v-if="!authStore.isAuthenticated"
      class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
    >
      <span class="text-amber-200">
        🔒 Du musst angemeldet sein, um eine Bewertung für diesen Film abzugeben.
      </span>
      <button
        @click="authStore.login()"
        class="btn-amber-glass text-xs py-1.5 px-4 whitespace-nowrap"
      >
        Jetzt anmelden
      </button>
    </div>

    <!-- Rating Form (nur sichtbar wenn eingeloggt) -->
    <form v-if="authStore.isAuthenticated" @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <!-- Slider Section (Left) -->
        <div class="md:col-span-8 space-y-3">
          <div class="flex items-center justify-between">
            <label for="bewertung-wertung-range" class="text-sm font-semibold text-cinema-text">
              Wertung (1 bis 10)
            </label>
          </div>

          <input
            id="bewertung-wertung-range"
            name="wertung"
            type="range"
            min="1"
            max="10"
            step="1"
            v-model.number="wert"
            :disabled="enthaltung || !authStore.isAuthenticated || isSubmitting"
            class="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#e50914] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          />
        </div>

        <!-- Big Score Ziffer Display (Right) -->
        <div class="md:col-span-4 flex items-center justify-center p-4 rounded-xl bg-slate-900/80 border border-white/5">
          <template v-if="!enthaltung">
            <span class="text-4xl font-extrabold text-amber-400 drop-shadow-md">
              {{ wert }} ★
            </span>
          </template>
          <template v-else>
            <span class="text-cinema-text-muted text-base font-semibold italic">
              Enthaltung
            </span>
          </template>
        </div>
      </div>

      <!-- Option Checkbox & Submit Row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
        <!-- Enthaltung Checkbox -->
        <label
          for="bewertung-enthaltung-checkbox"
          class="flex items-center gap-3 cursor-pointer select-none text-sm font-medium text-cinema-text"
          :class="{ 'opacity-50 cursor-not-allowed': !authStore.isAuthenticated }"
        >
          <input
            id="bewertung-enthaltung-checkbox"
            name="enthaltung"
            type="checkbox"
            v-model="enthaltung"
            :disabled="!authStore.isAuthenticated || isSubmitting"
            class="w-4 h-4 rounded border-white/20 text-[#e50914] focus:ring-[#e50914] bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
          />
          <span>Enthaltung (Ich möchte mich enthalten)</span>
        </label>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!authStore.isAuthenticated || isSubmitting"
          class="btn-amber-glass w-full sm:w-auto px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
        >
          <span v-if="isSubmitting" class="flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin"></span>
            Wird gespeichert...
          </span>
          <span v-else>
            Bewertung absenden
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
