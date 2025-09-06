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

// 根据ID获取赛事详情 (新接口)
export function findEventCPublic(id) {
  return request({
    url: '/EC/findEventCPublic',
    method: 'get',
    params: { ID: id }
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

// 普通用户报名接口
export function userRegisterEvent(data) {
  return request({
    url: '/ERr/userRegisterEvent',
    method: 'post',
    data
  })
}

// 查询用户是否报名某个比赛
export function checkUserRegistration(eventId) {
  return request({
    url: '/ERr/checkUserRegistration',
    method: 'get',
    params: { eventId }
  })
}

// 普通用户获取比赛赛题列表
export function getUserEventQList(eventId) {
  return request({
    url: '/Eq/getUserEventQList',
    method: 'get',
    params: { eventId }
  })
}
