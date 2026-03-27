import { createRouter, createWebHistory } from 'vue-router'

import LeadsView from '@/views/LeadsView.vue'
import LeadDetail from '@/views/LeadDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'leads-view',
      component: LeadsView,
    },
    {
      path: '/leads/:id',
      name: 'lead-detail',
      component: LeadDetail,
    },
  ],
})

export default router
