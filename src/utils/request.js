import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: 'http://192.168.31.228:8888'
})

// 请求拦截器 - 自动添加token
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['x-token'] = token
      console.log('请求头已添加token:', token.substring(0, 20) + '...') // 调试日志
    } else {
      console.log('未找到token，跳过添加') // 调试日志
    }
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // 直接返回响应，让业务层处理业务状态码
    return response
  },
  error => {
    console.error('请求错误:', error)
    Message.error(error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service
