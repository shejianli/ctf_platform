import axios from 'axios'
import { Message } from '@arco-design/web-vue'

const service = axios.create({
  baseURL: 'http://192.168.34.161:8888'
})

service.interceptors.response.use(
  response => {
    const res = response.data

    if (response.status >= 400) {
      Message.error(response.data.message || '请求失败')
      return Promise.reject(new Error(res.message || 'Error'))
    }

    return response
  },
  error => {
    console.error('请求错误:', error)
    Message.error(error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service
