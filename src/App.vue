<script setup lang="ts">
import { onMounted } from 'vue'
import SideNav from '@/components/SideNav.vue'
import BottomTabBar from '@/components/BottomTabBar.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import AdminFab from '@/components/AdminFab.vue'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()

onMounted(() => {
  auth.fetchSession()
})
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Desktop: Left Sidebar (hidden on mobile) -->
    <aside class="hidden lg:flex lg:flex-col lg:w-68 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
      <SideNav />
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 lg:ml-68 min-h-screen pb-20 lg:pb-0">
      <router-view />
    </main>

    <!-- Mobile: Bottom Tab Bar (hidden on desktop) -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      <BottomTabBar />
    </nav>

    <!-- Admin FAB (only visible when isAdmin: true — Phase 1 stub: always hidden) -->
    <AdminFab />

    <!-- Toast Container (renders active toasts, always present) -->
    <ToastContainer />
  </div>
</template>
