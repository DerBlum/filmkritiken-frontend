import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/useAuthStore'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/archiv',
      name: 'archiv',
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  // TODO(Phase 3): returnUrl einbauen wenn geschützte Routen kommen
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
