import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({ 
    url: '/base/login', 
    method: 'post', 
    data 
  })
}

// 获取验证码
export function getCaptcha() {
  return request({ 
    url: '/base/captcha', 
    method: 'post' 
  })
}

// 用户登出
export function logout() {
  return request({ url: '/api/logout', method: 'delete' })
}
