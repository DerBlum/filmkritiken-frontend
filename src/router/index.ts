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
      component: () => import('@/views/ArchivView.vue'),
    },
    {
      path: '/film/:id',
      name: 'film-detail',
      component: () => import('@/views/FilmDetailView.vue'),
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
})

export default router
