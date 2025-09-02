import Layout from '@/layout/content'
import { createRouter, createWebHashHistory } from "vue-router"

export const routes = [
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    hidden: true
  },

  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
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
      component: () => import('@/views/practice/index.vue'),
      meta: { title: '练习场', icon: 'icon-trophy' }
    }]
  },

  {
    path: '/contest',
    component: Layout,
    children: [{
      path: '',
      name: 'contest',
      component: () => import('@/views/contest/index.vue'),
      meta: { title: '赛事中心', icon: 'icon-fire' }
    }, {
      path: 'detail/:id',
      name: 'contest-detail',
      component: () => import('@/views/contest/detail.vue'),
      meta: { title: '比赛详情', icon: 'icon-fire' },
      hidden: true
    }, {
      path: 'contest/:id',
      name: 'contest-interface',
      component: () => import('@/views/contest/contest.vue'),
      meta: { title: '比赛界面', icon: 'icon-fire' },
      hidden: true
    }]
  },

  {
    path: '/vulnlab',
    component: Layout,
    children: [{
      path: '',
      name: 'vulnlab',
      component: () => import('@/views/vulnlab/index.vue'),
      meta: { title: '漏洞靶场', icon: 'icon-bug' }
    }]
  },
  {
    path: '/challenge',
    component: Layout,
    children: [{
      path: '',
      name: 'challenge',
      component: () => import('@/views/challenge/index.vue'),
      meta: { title: '闯关模式', icon: 'icon-trophy' }
    }]
  },

  {
    path: '/awd',
    component: Layout,
    children: [{
      path: '',
      name: 'awd',
      component: () => import('@/views/awd/index.vue'),
      meta: { title: 'AWD攻防', icon: 'icon-sword' }
    }, {
      path: 'detail/:id',
      name: 'awd-detail',
      component: () => import('@/views/awd/detail.vue'),
      meta: { title: 'AWD比赛详情', icon: 'icon-sword' },
      hidden: true
    }, {
      path: 'game/:id',
      name: 'awd-game',
      component: () => import('@/views/awd/game.vue'),
      meta: { title: 'AWD比赛界面', icon: 'icon-sword' },
      hidden: true
    }, {
      path: 'result/:id',
      name: 'awd-result',
      component: () => import('@/views/awd/result.vue'),
      meta: { title: 'AWD比赛结果', icon: 'icon-sword' },
      hidden: true
    }]
  },

  {
    path: '/simulation',
    component: Layout,
    children: [{
      path: '',
      name: 'simulation',
      component: () => import('@/views/simulation/index.vue'),
      meta: { title: '仿真靶场', icon: 'icon-bug' }
    }, {
      path: 'scenario/:id',
      name: 'simulation-scenario',
      component: () => import('@/views/simulation/scenario/index.vue'),
      meta: { title: '仿真场景详情', icon: 'icon-bug' },
      hidden: true
    }]
  },

  {
    path: '/notice',
    component: Layout,
    children: [{
      path: '',
      name: 'notice',
      component: () => import('@/views/notice/index.vue'),
      meta: { title: '通知广告', icon: 'icon-notification' }
    }]
  },

  {
    path: '/ranking',
    component: Layout,
    children: [{
      path: '',
      name: 'ranking',
      component: () => import('@/views/ranking/index.vue'),
      meta: { title: '排行榜', icon: 'icon-trophy' }
    }]
  },
  
  {
    path: '/learning',
    component: Layout,
    children: [{
      path: '',
      name: 'learning',
      component: () => import('@/views/learning/index.vue'),
      meta: { title: '学习中心', icon: 'icon-book' }
    }]
  },

  {
    path: '/profile',
    component: Layout,
    children: [{
      path: '',
      name: 'profile',
      component: () => import('@/views/profile/index.vue'),
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
