import request from '@/utils/request'

// 获取闯关题目列表（开放接口）
export function getChallengePublic(params) {
  return request({
    url: '/C/getChallengePublic',
    method: 'get',
    params
  })
}

// 根据父ID获取子题目（开放接口）
export function getParentIdChallengePublic(params) {
  return request({
    url: '/C/getParentIdChallengePublic',
    method: 'get',
    params
  })
}
