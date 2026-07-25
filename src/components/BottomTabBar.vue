<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const auth = useAuth()

const tabs = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Archiv', path: '/archiv', icon: '🎬' },
  { name: 'Watchlist', path: '/watchlist', icon: '📋' },
  { name: 'Stats', path: '/stats', icon: '📊' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="bg-black/75 backdrop-blur-md border-t border-white/10 shadow-2xl">
    <div class="flex items-stretch">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all duration-200"
        :class="isActive(tab.path)
          ? 'text-cinema-red'
          : 'text-cinema-text-muted hover:text-cinema-text'"
      >
        <span class="text-xl leading-none">{{ tab.icon }}</span>
        <span class="text-xs font-medium leading-none">{{ tab.name }}</span>
        <span
          v-if="isActive(tab.path)"
          class="w-1 h-1 rounded-full bg-cinema-red mt-0.5"
        />
      </router-link>

      <!-- Auth Tab (Login or Logout) -->
      <button
        v-if="auth.isAuthenticated"
        @click="auth.logout()"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-cinema-text-muted hover:text-cinema-red transition-all duration-200"
      >
        <span class="text-xl leading-none">🚪</span>
        <span class="text-xs font-medium leading-none">Logout</span>
      </button>

      <router-link
        v-else
        to="/login"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all duration-200"
        :class="isActive('/login')
          ? 'text-cinema-red'
          : 'text-cinema-text-muted hover:text-cinema-text'"
      >
        <span class="text-xl leading-none">👤</span>
        <span class="text-xs font-medium leading-none">Login</span>
        <span
          v-if="isActive('/login')"
          class="w-1 h-1 rounded-full bg-cinema-red mt-0.5"
        />
      </router-link>
    </div>
  </div>
</template>
