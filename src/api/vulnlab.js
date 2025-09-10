import request from '@/utils/request'

// 基础URL
const BASE_URL = ''

/**
 * 获取漏洞靶场列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页大小，默认12
 * @param {string} params.name - 靶场名称搜索
 * @param {number} params.categoryId - 分类ID
 * @param {number} params.difficultyLevelId - 难度等级ID
 * @param {number} params.environmentType - 环境类型 (1:在线, 2:下载)
 * @param {string} params.vulnerabilityType - 漏洞类型
 * @param {string} params.tag - 标签搜索
 * @returns {Promise} API响应
 */
export function getVulnLabs(params = {}) {
  return request({
    url: `${BASE_URL}/Vs/getVulnerabilityShootingPublic`,
    method: 'get',
    params: {
      page: 1,
      pageSize: 12,
      ...params
    }
  })
}

/**
 * 获取靶场分类列表
 * @returns {Promise} API响应
 */
export function getVulnLabCategories() {
  return request({
    url: `${BASE_URL}/Q/getQuestionClassPublic`,
    method: 'get'
  })
}

/**
 * 获取难度等级列表
 * @returns {Promise} API响应
 */
export function getDifficultyLevels() {
  return request({
    url: `${BASE_URL}/Dl/getDifficultyLevelPublic`,
    method: 'get'
  })
}

/**
 * 启动漏洞靶机
 * @param {Object} data
 * @returns {Promise}
 */
export function startVulnTarget(data = {}) {
  return request({
    url: `${BASE_URL}/VbR/startVulnTarget`,
    method: 'post',
    data
  })
}

/**
 * 停止漏洞靶机
 * @param {Object} data
 * @returns {Promise}
 */
export function stopVulnTarget(data = {}) {
  return request({
    url: `${BASE_URL}/VbR/stopVulnTarget`,
    method: 'post',
    data
  })
}
