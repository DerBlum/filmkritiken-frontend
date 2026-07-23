<script setup lang="ts">
import { useToast, type Toast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function iconFor(type: Toast['type']): string {
  const icons: Record<Toast['type'], string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }
  return icons[type]
}

function colorFor(type: Toast['type']): string {
  const colors: Record<Toast['type'], string> = {
    info: 'border-blue-400/50 text-blue-100',
    success: 'border-green-400/50 text-green-100',
    warning: 'border-amber-400/50 text-amber-100',
    error: 'border-cinema-red/50 text-red-100',
  }
  return colors[type]
}
</script>

<template>
  <!-- Toast Container: fixed top-right, stacks vertically -->
  <div
    class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-8 scale-95"
      enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100"
      leave-to-class="opacity-0 translate-x-8 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl bg-black/75 backdrop-blur-md border shadow-2xl min-w-64 max-w-sm"
        :class="colorFor(toast.type)"
      >
        <!-- Icon -->
        <span class="text-xl flex-shrink-0 mt-0.5">{{ iconFor(toast.type) }}</span>

        <!-- Message -->
        <p class="flex-1 text-sm font-medium leading-snug">{{ toast.message }}</p>

        <!-- Close button -->
        <button
          class="flex-shrink-0 text-white/50 hover:text-white transition-colors duration-150 mt-0.5"
          @click="removeToast(toast.id)"
          aria-label="Toast schließen"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
