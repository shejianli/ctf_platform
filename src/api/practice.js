import request from '@/utils/request'

// 获取难度等级（开放接口）
export function getDifficultyLevels(params) {
  return request({
    url: '/Dl/getDifficultyLevelPublic',
    method: 'get',
    params
  })
}

// 获取题目分类（开放接口）
export function getQuestionClasses(params) {
  return request({
    url: '/Q/getQuestionClassPublic',
    method: 'get',
    params
  })
}

// 获取题目管理（开放接口）
export function getQuestions(params) {
  return request({
    url: '/Q/getQuPublic',
    method: 'get',
    params
  })
}
