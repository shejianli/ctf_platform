import request from '@/utils/request'

// 获取公开赛事列表
export function getEventCPublic(params) {
  return request({
    url: '/EC/getEventCPublic',
    method: 'get',
    params
  })
}

// 获取赛事详情
export function getEventCDetail(id) {
  return request({
    url: `/EC/getEventCDetail/${id}`,
    method: 'get'
  })
}

// 报名参加赛事
export function registerEvent(id) {
  return request({
    url: `/EC/registerEvent/${id}`,
    method: 'post'
  })
}

// 取消报名
export function cancelRegistration(id) {
  return request({
    url: `/EC/cancelRegistration/${id}`,
    method: 'post'
  })
}
