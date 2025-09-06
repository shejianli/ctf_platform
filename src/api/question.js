import request from '@/utils/request'

// 新建题目管理
export function createQu(data) {
  return request({
    url: '/Q/createQu',
    method: 'post',
    data
  })
}

// 删除题目管理
export function deleteQu(data) {
  return request({
    url: '/Q/deleteQu',
    method: 'delete',
    data
  })
}

// 批量删除题目管理
export function deleteQuByIds(data) {
  return request({
    url: '/Q/deleteQuByIds',
    method: 'delete',
    data
  })
}

// 更新题目管理
export function updateQu(data) {
  return request({
    url: '/Q/updateQu',
    method: 'put',
    data
  })
}

// 启动靶机
export function startTarget(data) {
  return request({
    url: '/Q/startTarget',
    method: 'post',
    data
  })
}

// 获取用户启动记录列表
export function getUserBootRecordList(params) {
  return request({
    url: '/Br/getUserBootRecordList',
    method: 'get',
    params: params  // GET 请求使用 params
  })
}

// 停止靶机
export function stopTarget(data) {
  return request({
    url: '/Q/stopTarget',
    method: 'post',
    data
  })
}
