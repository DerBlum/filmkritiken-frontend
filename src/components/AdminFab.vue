<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { isAdmin } = useAuth()
</script>

<template>
  <!-- Admin FAB: only visible when isAdmin is true -->
  <!-- Phase 1 stub: isAdmin is always false → FAB is never visible -->
  <button
    v-if="isAdmin"
    id="admin-fab"
    class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cinema-red hover:opacity-90 text-white text-2xl font-bold shadow-2xl border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
    aria-label="Film hinzufügen"
    title="Film hinzufügen"
  >
    +
  </button>
</template>
