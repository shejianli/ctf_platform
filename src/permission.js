import router from '@/router'
import { getToken } from '@/utils/auth'
import { Message } from '@arco-design/web-vue'

router.beforeEach(async (to, from, next) => {
  console.log('Route guard - navigating to:', to.path)
  
  if (to.path === '/login') {
    next()
    return
  }

  const token = getToken()
  console.log('Token found:', token)
  
  if (!token) {
    Message.info('请先登录')
    next('/login')
    return
  }

  // 如果有 token，允许访问
  next()
})
