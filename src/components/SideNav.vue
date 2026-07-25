<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const auth = useAuth()

const navLinks = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Archiv', path: '/archiv', icon: '🎬' },
  { name: 'Watchlist', path: '/watchlist', icon: '📋' },
  { name: 'Statistiken', path: '/stats', icon: '📊' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="flex flex-col h-full bg-black/75 backdrop-blur-md border-r border-white/10 shadow-2xl">
    <!-- Logo / App Name -->
    <div class="flex items-center gap-3 px-6 py-6 border-b border-white/10">
      <span class="text-2xl">🎥</span>
      <div>
        <h1 class="text-cinema-text font-bold text-lg leading-tight">Filmkritiken</h1>
        <p class="text-cinema-text-muted text-xs">Der Filmtreff</p>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-6 space-y-1">
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-cinema-text-muted transition-all duration-200 hover:bg-white/10 hover:text-cinema-text group"
        :class="isActive(link.path)
          ? 'bg-cinema-red/20 text-cinema-text border-l-2 border-cinema-red'
          : ''"
      >
        <span class="text-xl">{{ link.icon }}</span>
        <span class="font-medium">{{ link.name }}</span>
      </router-link>
    </nav>

    <!-- User Info / Login Area -->
    <div class="px-4 py-6 border-t border-white/10 space-y-3">
      <!-- Logged in state -->
      <div v-if="auth.isAuthenticated && auth.user" class="space-y-2">
        <div class="flex items-center gap-3 px-4 py-2">
          <div class="w-8 h-8 rounded-full bg-cinema-red/30 flex items-center justify-center text-sm font-bold text-cinema-text">
            {{ auth.user.slice(0, 1).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-cinema-text text-sm font-medium truncate">{{ auth.user }}</p>
          </div>
        </div>
        <button
          @click="auth.logout()"
          class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-cinema-text-muted hover:bg-white/10 hover:text-cinema-red text-sm transition-all duration-200"
        >
          <span class="text-lg">🚪</span>
          <span>Abmelden</span>
        </button>
      </div>

      <!-- Not logged in state -->
      <router-link
        v-else
        to="/login"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-cinema-text-muted transition-all duration-200 hover:bg-white/10 hover:text-cinema-text"
      >
        <span class="text-xl">👤</span>
        <span class="text-sm font-medium">Login</span>
      </router-link>

      <!-- Permission: Add Film Button (visible when film.add in permissions) -->
      <button
        v-if="auth.hasPermission('film.add')"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cinema-red hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>+</span>
        <span>Film hinzufügen</span>
      </button>
    </div>
  </div>
</template>
