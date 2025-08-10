import Layout from '@/layout/content'
import { createRouter, createWebHashHistory } from "vue-router"

export const routes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },

  {
    path: '/',
    redirect: '/practice'
  },

  {
    path: '/practice',
    component: Layout,
    children: [{
      path: '',
      name: 'practice',
      component: () => import('@/views/practice'),
      meta: { title: '练习场', icon: 'icon-trophy' }
    }]
  },

  {
    path: '/contest',
    component: Layout,
    children: [{
      path: '',
      name: 'contest',
      component: () => import('@/views/contest'),
      meta: { title: '赛事中心', icon: 'icon-fire' }
    }]
  },

  {
    path: '/notice',
    component: Layout,
    children: [{
      path: '',
      name: 'notice',
      component: () => import('@/views/notice'),
      meta: { title: '通知广告', icon: 'icon-notification' }
    }]
  },

  {
    path: '/ranking',
    component: Layout,
    children: [{
      path: '',
      name: 'ranking',
      component: () => import('@/views/ranking'),
      meta: { title: '排行榜', icon: 'icon-trophy' }
    }]
  },

  {
    path: '/profile',
    component: Layout,
    children: [{
      path: '',
      name: 'profile',
      component: () => import('@/views/profile'),
      meta: { title: '个人中心', icon: 'icon-user' }
    }]
  },

  {
    path: '/:catchAll(.*)',
    redirect: '/404',
    hidden: true
  }
]

const buildRouter = () => createRouter({
  history: createWebHashHistory(),
  routes
})

const router = buildRouter()

export default router
