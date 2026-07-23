import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
      component: () => import('@/views/PlaceholderView.vue'),
    },
  ],
})

// Route Guards — leere Scaffolds, werden in Phase 2 befüllt
// router.beforeEach((to, from, next) => {
//   next()
// })

export default router
