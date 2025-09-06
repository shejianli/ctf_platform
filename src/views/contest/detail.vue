<template>
  <div class="contest-detail-container">
    <!-- 返回按钮 -->
    <div class="back-section">
      <a-button type="text" @click="goBack">
        <icon-left />
        返回赛事列表
      </a-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="加载中...">
        <div style="height: 200px;"></div>
      </a-spin>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && !contest" class="empty-container">
      <a-empty description="比赛信息不存在或已被删除">
        <a-button type="primary" @click="goBack">返回赛事列表</a-button>
      </a-empty>
    </div>

    <!-- 比赛详情 -->
    <div class="contest-detail" v-else-if="contest">
      <!-- 左侧：比赛封面图 -->
      <div class="contest-cover">
        <img 
          src="https://adworld.xctf.org.cn/media/picture/cover/b13dc2c4-fdf3-46fd-92d7-69f2748bfa53.png" 
          alt="比赛封面"
          class="cover-image"
        />
        <div class="cover-overlay">
          <div class="contest-status">
            <a-tag :color="getStatusColor(contest.status)" size="large">
              {{ getStatusText(contest.status) }}
            </a-tag>
          </div>
        </div>
      </div>

      <!-- 右侧：比赛信息 -->
      <div class="contest-info">
        <div class="contest-header">
          <h1 class="contest-title">{{ contest.name }}</h1>
          <div class="contest-meta">
            <a-tag :color="getEventTypeColor(contest.eventType)" size="medium">
              {{ getEventTypeText(contest.eventType) }}
            </a-tag>
            <a-tag :color="getStatusColor(contest.status)" size="medium">
              {{ getStatusText(contest.status) }}
            </a-tag>
          </div>
        </div>

        <div class="contest-description">
          {{ contest.eventDescription }}
        </div>

        <div class="contest-details">
          <div class="detail-item">
            <span class="detail-label">比赛时间：</span>
            <span class="detail-value">{{ formatStartTime() }} - {{ formatEndTime() }}</span>
          </div>
          
          <div class="detail-item">
            <span class="detail-label">报名时间：</span>
            <span class="detail-value">{{ formatRegistrationStartTime() }} - {{ formatRegistrationDeadline() }}</span>
          </div>
          
          <div class="detail-item" v-if="contest.organizer">
            <span class="detail-label">主办方：</span>
            <span class="detail-value">{{ contest.organizer }}</span>
          </div>
          
          <div class="detail-item" v-if="contest.sponsor">
            <span class="detail-label">承办方：</span>
            <span class="detail-value">{{ contest.sponsor }}</span>
          </div>
          
          <div class="detail-item" v-if="contest.technicalSupport">
            <span class="detail-label">技术支撑：</span>
            <span class="detail-value">{{ contest.technicalSupport }}</span>
          </div>
          
          <div class="detail-item" v-if="contest.contactNumber">
            <span class="detail-label">联系电话：</span>
            <span class="detail-value">{{ contest.contactNumber }}</span>
          </div>
        </div>

        <div class="contest-actions">
          <a-button 
            v-if="contest.status === 1 && !userRegistered" 
            type="primary" 
            size="large"
            :loading="registering"
            @click="handleRegister"
          >
            <icon-user-add />
            立即报名
          </a-button>
          
          <a-button 
            v-if="contest.status === 1 && userRegistered" 
            type="success" 
            size="large"
            disabled
          >
            <icon-user-add />
            已报名
          </a-button>
          
          <a-button 
            v-if="contest.status === 2 && userRegistered" 
            type="primary" 
            size="large"
            @click="enterContest"
          >
            <icon-play-circle />
            进入比赛
          </a-button>
          
          <a-button 
            v-if="contest.status === 2 && !userRegistered" 
            type="warning" 
            size="large"
            disabled
          >
            <icon-play-circle />
            未报名，无法参加
          </a-button>
          
          <!-- 比赛进行中但未报名的提示 -->
          <div v-if="contest && contest.status === 2 && !userRegistered" class="registration-tip">
            <a-alert type="warning" show-icon>
              <template #title>您尚未报名此比赛</template>
              <template #description>比赛进行中，只有已报名的用户才能参加比赛。</template>
            </a-alert>
          </div>
          
          
          <a-button 
            v-if="contest.status === 3" 
            type="default" 
            size="large"
            @click="viewResults"
          >
            <icon-trophy />
            查看结果
          </a-button>
          
          <a-button 
            type="outline" 
            size="large"
            @click="viewRanking"
          >
            <icon-bar-chart />
            排行榜
          </a-button>
        </div>
      </div>
    </div>

    <!-- 比赛介绍 -->
    <div class="contest-introduction" v-if="contest">
      <h2>比赛介绍</h2>
      <div class="introduction-content">
        <p>{{ contest.eventDescription }}</p>
        <p>这是一场高水平的网络安全竞赛，旨在提升参赛者的实战能力和技术水平。</p>
      </div>
    </div>

    <!-- 比赛规则 -->
    <div class="contest-rules" v-if="contest">
      <h2>比赛规则</h2>
      <div class="rules-content">
        <div class="rule-item">
          <h4>参赛资格</h4>
          <p>所有对网络安全感兴趣的个人和团队均可报名参加。</p>
        </div>
        <div class="rule-item">
          <h4>比赛形式</h4>
          <p>采用线上CTF解题模式，包含Web安全、密码学、逆向工程等多个方向。</p>
        </div>
        <div class="rule-item">
          <h4>评分标准</h4>
          <p>根据解题难度和完成时间进行评分，最终按总分排名。</p>
        </div>
      </div>
    </div>


    <!-- 奖项设置 -->
    <div class="contest-prizes" v-if="contest">
      <h2>奖项设置</h2>
      <div class="prizes-content">
        <div class="prize-item">
          <div class="prize-rank">🥇</div>
          <div class="prize-info">
            <h4>一等奖</h4>
            <p>奖金 + 证书 + 实习机会</p>
          </div>
        </div>
        <div class="prize-item">
          <div class="prize-rank">🥈</div>
          <div class="prize-info">
            <h4>二等奖</h4>
            <p>奖金 + 证书</p>
          </div>
        </div>
        <div class="prize-item">
          <div class="prize-rank">🥉</div>
          <div class="prize-info">
            <h4>三等奖</h4>
            <p>证书 + 纪念品</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconLeft, IconUserAdd, IconPlayCircle, IconTrophy, IconBarChart } from '@arco-design/web-vue/es/icon'
import { findEventCPublic, registerEvent, cancelRegistration, userRegisterEvent, checkUserRegistration } from '@/api/contest'

const route = useRoute()
const router = useRouter()

// 响应式数据
const contest = ref(null)
const registering = ref(false)
const loading = ref(false)
const userRegistered = ref(false) // 用户是否已报名
const checkingRegistration = ref(false) // 检查报名状态中


// 获取比赛详情
const fetchContestDetail = async () => {
  try {
    loading.value = true
    const contestId = route.params.id
    console.log('获取比赛详情，ID:', contestId)
    
    const response = await findEventCPublic(contestId)
    console.log('比赛详情响应:', response.data)
    
    if (response.data.code === 0) {
      contest.value = response.data.data
      // 获取比赛详情后，检查用户报名状态
      await checkUserRegistrationStatus(contestId)
    } else {
      Message.error(response.data.msg || '获取比赛详情失败')
    }
  } catch (error) {
    console.error('获取比赛详情失败:', error)
    Message.error('获取比赛详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// 检查用户报名状态
const checkUserRegistrationStatus = async (eventId) => {
  try {
    checkingRegistration.value = true
    console.log('检查用户报名状态，eventId:', eventId)
    
    const response = await checkUserRegistration(eventId)
    console.log('报名状态响应:', response.data)
    
    if (response.data.code === 0) {
      userRegistered.value = response.data.data.isRegistered || false
    } else {
      console.warn('检查报名状态失败:', response.data.msg)
      userRegistered.value = false
    }
  } catch (error) {
    console.error('检查报名状态失败:', error)
    userRegistered.value = false
  } finally {
    checkingRegistration.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    1: 'blue',      // 报名中
    2: 'green',     // 进行中
    3: 'gray'       // 已结束
  }
  return colorMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    1: '报名中',
    2: '进行中',
    3: '已结束'
  }
  return textMap[status] || '未知状态'
}

// 获取赛事类型颜色
const getEventTypeColor = (eventType) => {
  return eventType === 1 ? 'purple' : 'cyan'
}

// 获取赛事类型文本
const getEventTypeText = (eventType) => {
  return eventType === 1 ? '个人赛' : '团队赛'
}

// 格式化时间
const formatStartTime = () => {
  if (!contest.value?.competitionStartTime) return '待定'
  const start = new Date(contest.value.competitionStartTime)
  return `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')} ${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`
}

const formatEndTime = () => {
  if (!contest.value?.competitionDeadline) return '待定'
  const end = new Date(contest.value.competitionDeadline)
  return `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')} ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
}

const formatRegistrationStartTime = () => {
  if (!contest.value?.registrationStartTime) return '待定'
  const start = new Date(contest.value.registrationStartTime)
  return `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')} ${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`
}

const formatRegistrationDeadline = () => {
  if (!contest.value?.registrationDeadline) return '待定'
  const deadline = new Date(contest.value.registrationDeadline)
  return `${deadline.getFullYear()}-${(deadline.getMonth() + 1).toString().padStart(2, '0')}-${deadline.getDate().toString().padStart(2, '0')} ${deadline.getHours().toString().padStart(2, '0')}:${deadline.getMinutes().toString().padStart(2, '0')}`
}

// 报名比赛
const handleRegister = async () => {
  try {
    registering.value = true
    const contestId = contest.value.ID
    
    console.log('报名比赛，ID:', contestId)
    
    // 使用新的用户报名接口
    const requestData = {
      eventId: contestId
    }
    
    const response = await userRegisterEvent(requestData)
    console.log('报名响应:', response.data)
    
    if (response.data.code === 0) {
      Message.success('报名成功！')
      // 更新报名状态
      userRegistered.value = true
      // 注意：这里不更新比赛状态，比赛状态由后端管理
      // 如果比赛还在报名期，状态保持为1
      // 如果比赛已经开始，状态为2
    } else {
      Message.error(response.data.msg || '报名失败')
    }
  } catch (error) {
    console.error('报名失败:', error)
    Message.error('报名失败，请重试')
  } finally {
    registering.value = false
  }
}

// 进入比赛
const enterContest = () => {
  router.push(`/contest/contest/${contest.value.ID}`)
}


// 查看结果
const viewResults = () => {
  Message.info('结果查看功能开发中...')
}

// 查看排行榜
const viewRanking = () => {
  Message.info('排行榜功能开发中...')
}

// 页面加载时获取比赛详情
onMounted(() => {
  fetchContestDetail()
})
</script>

<style scoped>
.contest-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-section {
  margin-bottom: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.contest-detail {
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  background: var(--color-bg-1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.contest-cover {
  flex: 0 0 400px;
  position: relative;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
}

.contest-info {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contest-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.contest-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-1);
  line-height: 1.3;
  flex: 1;
}

.contest-meta {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.contest-description {
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text-2);
  margin: 0;
}

.contest-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-label {
  font-weight: 600;
  color: var(--color-text-1);
  min-width: 80px;
}

.detail-value {
  color: var(--color-text-2);
  flex: 1;
}

.contest-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: auto;
}

.registration-tip {
  width: 100%;
  margin-top: 16px;
}

.contest-introduction,
.contest-rules,
.contest-prizes {
  background: var(--color-bg-1);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.contest-introduction h2,
.contest-rules h2,
.contest-prizes h2 {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.introduction-content p {
  margin: 0 0 16px 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text-2);
}

.rules-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.rule-item h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.rule-item p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text-2);
}

.prizes-content {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.prize-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-bg-2);
  border-radius: 8px;
  flex: 1;
  min-width: 200px;
}

.prize-rank {
  font-size: 32px;
  flex-shrink: 0;
}

.prize-info h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.prize-info p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-3);
}


/* 响应式设计 */
@media (max-width: 768px) {
  .contest-detail-container {
    padding: 16px;
  }
  
  .contest-detail {
    flex-direction: column;
    gap: 0;
  }
  
  .contest-cover {
    flex: none;
    height: 200px;
  }
  
  .contest-info {
    padding: 24px;
  }
  
  .contest-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .contest-title {
    font-size: 24px;
  }
  
  .contest-actions {
    justify-content: center;
  }
  
  .prizes-content {
    flex-direction: column;
  }
  
  .prize-item {
    min-width: auto;
  }
}
</style>
