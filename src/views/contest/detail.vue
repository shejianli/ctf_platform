<template>
  <div class="contest-detail-container">
    <!-- 返回按钮 -->
    <div class="back-section">
      <a-button type="text" @click="goBack">
        <icon-left />
        返回赛事列表
      </a-button>
    </div>

    <!-- 比赛详情 -->
    <div class="contest-detail" v-if="contest">
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
            v-if="contest.status === 2" 
            type="primary" 
            size="large"
            :loading="registering"
            @click="handleRegister"
          >
            <icon-user-add />
            立即报名
          </a-button>
          
          <a-button 
            v-if="contest.status === 3" 
            type="primary" 
            size="large"
            @click="enterContest"
          >
            <icon-play-circle />
            进入比赛
          </a-button>
          
          <a-button 
            v-if="contest.status === 4" 
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
    <div class="contest-introduction">
      <h2>比赛介绍</h2>
      <div class="introduction-content">
        <p>{{ contest.eventDescription }}</p>
        <p>这是一场高水平的网络安全竞赛，旨在提升参赛者的实战能力和技术水平。</p>
      </div>
    </div>

    <!-- 比赛规则 -->
    <div class="contest-rules">
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

    <!-- 题目列表 -->
    <div class="contest-challenges">
      <div class="challenges-header">
        <h2>比赛题目</h2>
        <div class="challenges-filter">
          <div class="filter-option" 
               :class="{ active: statusFilter === 'all' }"
               @click="() => statusFilter = 'all'">
            全部题目
          </div>
          <div class="filter-option" 
               :class="{ active: statusFilter === 'solved' }"
               @click="() => statusFilter = 'solved'">
            已解决
          </div>
          <div class="filter-option" 
               :class="{ active: statusFilter === 'unsolved' }"
               @click="() => statusFilter = 'unsolved'">
            未解决
          </div>
        </div>
      </div>
      
      <div class="challenges-grid">
        <a-row :gutter="[16, 16]">
          <a-col
            v-for="challenge in filteredChallenges"
            :key="challenge.id"
            :xxl="6"
            :xl="8"
            :lg="12"
            :md="12"
            :sm="24"
            :xs="24"
          >
            <a-card
              class="challenge-card"
              hoverable
              @click="openChallenge(challenge)"
            >
              <template #cover>
                <div class="challenge-cover">
                  <div class="challenge-status">
                    <a-tag :color="getChallengeStatusColor(challenge.status)" size="small">
                      {{ getChallengeStatusText(challenge.status) }}
                    </a-tag>
                  </div>
                  <div class="challenge-points">
                    <icon-trophy />
                    {{ challenge.points }}分
                  </div>
                </div>
              </template>

              <div class="challenge-content">
                <div class="challenge-header">
                  <h4 class="challenge-title">{{ challenge.name }}</h4>
                  <a-tag :color="getCategoryColor(challenge.category)" size="small">
                    {{ getCategoryName(challenge.category) }}
                  </a-tag>
                </div>

                <div class="challenge-meta">
                  <span class="challenge-solved">
                    <icon-user />
                    {{ challenge.solvedCount }}人解决
                  </span>
                </div>

                <div class="challenge-tags">
                  <a-tag
                    v-for="tag in challenge.tags"
                    :key="tag"
                    size="small"
                    class="challenge-tag"
                  >
                    {{ tag }}
                  </a-tag>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 奖项设置 -->
    <div class="contest-prizes">
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

    <!-- 题目详情弹窗 -->
    <a-modal
      v-model:visible="challengeDetailVisible"
      :title="selectedChallenge?.name"
      :width="800"
      :footer="false"
    >
      <div v-if="selectedChallenge" class="challenge-detail-modal">
        <div class="detail-content">
          <h4>📋 题目描述</h4>
          <div class="description">{{ selectedChallenge.description }}</div>
          
          <h4>💡 提示信息</h4>
          <div class="hints">
            <div 
              v-for="(hint, index) in selectedChallenge.hints" 
              :key="index"
              class="hint-item"
            >
              <span class="hint-number">提示 {{ index + 1 }}</span>
              <span class="hint-content">{{ hint.content }}</span>
            </div>
          </div>
          
          <h4>📎 附件下载</h4>
          <div class="attachments">
            <a-button
              v-for="attachment in selectedChallenge.attachments"
              :key="attachment.id"
              type="outline"
              size="small"
              @click="downloadAttachment(attachment)"
            >
              <icon-download />
              {{ attachment.name }}
            </a-button>
          </div>
        </div>

        <div class="submission-section">
          <h4>🚩 提交答案</h4>
          <div class="submission-form">
            <a-input
              v-model="flagInput"
              placeholder="请输入flag格式: flag{...}"
              size="large"
              @keyup.enter="submitFlag"
            />
            <a-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="submitFlag"
            >
              提交答案
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconLeft, IconUserAdd, IconPlayCircle, IconTrophy, IconBarChart, IconUser, IconDownload } from '@arco-design/web-vue/es/icon'
// import { getEventCDetail, registerEvent, cancelRegistration } from '@/api/contest'

const route = useRoute()
const router = useRouter()

// 响应式数据
const contest = ref({
  id: 1,
  name: '第三届"陇剑杯"网络安全大赛',
  eventDescription: '陇剑再出鞘 金盾固网安 第三届"陇剑杯"网络安全大赛，这是一场全国性的网络安全竞赛，采用"防御优先"的理念，引入"AI人机对抗"模式，致力于构建全场景防御训练场，将AI技术应用于安全防御，保护数字经济安全。',
  eventType: 2, // 团队赛
  status: 2, // 报名中
  registrationStartTime: '2025-08-08T00:00:00Z',
  registrationDeadline: '2025-09-03T00:00:00Z',
  competitionStartTime: '2025-09-06T00:00:00Z',
  competitionDeadline: '2025-09-19T00:00:00Z',
  sponsor: '甘肃省公安厅',
  organizer: '甘肃省百万职工职业技能素质提升活动组委会',
  technicalSupport: '数链丝路安算未来',
  contactNumber: '0931-8888888'
})
const registering = ref(false)
const loading = ref(false)

// 题目相关数据
const statusFilter = ref('all')
const selectedChallenge = ref(null)
const challengeDetailVisible = ref(false)
const flagInput = ref('')
const submitting = ref(false)

// 题目数据
const challenges = ref([
  {
    id: 1,
    name: 'Web基础注入',
    category: 'web',
    points: 100,
    status: 'unsolved',
    solvedCount: 45,
    description: '这是一个基础的SQL注入题目，你需要找到隐藏在网页中的flag。',
    hints: [
      { content: '注意URL参数', cost: 10 },
      { content: '尝试单引号', cost: 20 }
    ],
    attachments: [
      { id: 1, name: 'web_injection.zip', url: '#' }
    ],
    tags: ['Web安全', 'SQL注入']
  },
  {
    id: 2,
    name: '文件上传绕过',
    category: 'web',
    points: 200,
    status: 'solved',
    solvedCount: 23,
    description: '绕过文件上传限制，上传webshell获取flag。',
    hints: [
      { content: '检查文件类型验证', cost: 10 },
      { content: '尝试双写绕过', cost: 20 }
    ],
    attachments: [
      { id: 2, name: 'file_upload.zip', url: '#' }
    ],
    tags: ['Web安全', '文件上传']
  },
  {
    id: 3,
    name: 'XSS反射型',
    category: 'web',
    points: 150,
    status: 'attempted',
    solvedCount: 67,
    description: '构造XSS payload，在页面中执行JavaScript代码。',
    hints: [
      { content: '注意输入过滤', cost: 15 }
    ],
    attachments: [],
    tags: ['Web安全', 'XSS']
  },
  {
    id: 4,
    name: 'RSA加密',
    category: 'crypto',
    points: 300,
    status: 'unsolved',
    solvedCount: 12,
    description: '破解RSA加密，找到明文flag。',
    hints: [
      { content: '检查公钥信息', cost: 25 },
      { content: '尝试共模攻击', cost: 50 }
    ],
    attachments: [
      { id: 4, name: 'rsa_challenge.zip', url: '#' }
    ],
    tags: ['密码学', 'RSA']
  },
  {
    id: 5,
    name: '逆向分析',
    category: 'reverse',
    points: 250,
    status: 'unsolved',
    solvedCount: 18,
    description: '分析二进制文件，找到隐藏的flag。',
    hints: [
      { content: '使用IDA Pro分析', cost: 20 }
    ],
    attachments: [
      { id: 5, name: 'reverse_binary.exe', url: '#' }
    ],
    tags: ['逆向工程', '二进制分析']
  },
  {
    id: 6,
    name: '缓冲区溢出',
    category: 'pwn',
    points: 350,
    status: 'unsolved',
    solvedCount: 8,
    description: '利用缓冲区溢出漏洞，获取shell权限。',
    hints: [
      { content: '检查栈保护', cost: 30 },
      { content: '构造ROP链', cost: 60 }
    ],
    attachments: [
      { id: 6, name: 'pwn_challenge', url: '#' }
    ],
    tags: ['PWN', '缓冲区溢出']
  }
])

// 计算属性
const filteredChallenges = computed(() => {
  if (statusFilter.value === 'all') {
    return challenges.value
  }
  return challenges.value.filter(challenge => challenge.status === statusFilter.value)
})

// 获取比赛详情 - 暂时注释掉，使用写死的数据
// const fetchContestDetail = async () => {
//   try {
//     loading.value = true
//     const contestId = route.params.id
//     const response = await getEventCDetail(contestId)
//     contest.value = response.data
//   } catch (error) {
//     console.error('获取比赛详情失败:', error)
//     Message.error('获取比赛详情失败')
//     }
//   } finally {
//     loading.value = false
//   }
// }

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    1: 'orange',    // 筹备中
    2: 'blue',      // 报名中
    3: 'green',     // 进行中
    4: 'gray',      // 已结束
    5: 'red'        // 已取消
  }
  return colorMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    1: '筹备中',
    2: '报名中',
    3: '进行中',
    4: '已结束',
    5: '已取消'
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

// 报名比赛 - 暂时使用模拟数据
const handleRegister = async () => {
  try {
    registering.value = true
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    Message.success('报名成功！')
    // 更新状态为已报名
    contest.value.status = 3
  } catch (error) {
    console.error('报名失败:', error)
    Message.error('报名失败，请重试')
  } finally {
    registering.value = false
  }
}

// 进入比赛
const enterContest = () => {
  router.push(`/contest/contest/${contest.value.id}`)
}

// 题目相关方法
const openChallenge = (challenge) => {
  selectedChallenge.value = challenge
  challengeDetailVisible.value = true
}

const downloadAttachment = (attachment) => {
  Message.info(`下载附件: ${attachment.name}`)
}

const submitFlag = async () => {
  if (!flagInput.value.trim()) {
    Message.warning('请输入flag')
    return
  }
  
  try {
    submitting.value = true
    
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 检查flag是否正确（这里简化处理）
    const isCorrect = flagInput.value.includes('flag{') && flagInput.value.includes('}')
    
    if (isCorrect) {
      Message.success('恭喜！Flag正确！')
      
      // 更新题目状态
      selectedChallenge.value.status = 'solved'
      
      // 更新解题人数
      selectedChallenge.value.solvedCount++
      
      // 清空输入
      flagInput.value = ''
      
      // 关闭弹窗
      challengeDetailVisible.value = false
      
    } else {
      Message.error('Flag错误，请重试')
      
      // 标记为尝试过
      if (selectedChallenge.value.status === 'unsolved') {
        selectedChallenge.value.status = 'attempted'
      }
    }
    
  } catch (error) {
    Message.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 题目状态相关方法
const getChallengeStatusColor = (status) => {
  const colorMap = {
    unsolved: 'default',
    attempted: 'orange',
    solved: 'green'
  }
  return colorMap[status] || 'default'
}

const getChallengeStatusText = (status) => {
  const textMap = {
    unsolved: '未解决',
    attempted: '尝试中',
    solved: '已解决'
  }
  return textMap[status] || '未知'
}

const getCategoryColor = (category) => {
  const colorMap = {
    web: 'blue',
    crypto: 'green',
    reverse: 'orange',
    pwn: 'red',
    misc: 'purple'
  }
  return colorMap[category] || 'default'
}

const getCategoryName = (category) => {
  const nameMap = {
    web: 'Web安全',
    crypto: '密码学',
    reverse: '逆向工程',
    pwn: 'PWN漏洞',
    misc: '杂项'
  }
  return nameMap[category] || '未知'
}

// 查看结果
const viewResults = () => {
  Message.info('结果查看功能开发中...')
}

// 查看排行榜
const viewRanking = () => {
  Message.info('排行榜功能开发中...')
}

// 页面加载时获取比赛详情 - 暂时注释掉，使用写死的数据
// onMounted(() => {
//   fetchContestDetail()
// })
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

/* 题目列表样式 */
.contest-challenges {
  background: var(--color-bg-1);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.challenges-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.challenges-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.challenges-filter {
  display: flex;
  gap: 12px;
}

.filter-option {
  padding: 8px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--color-bg-2);
  color: var(--color-text-2);
  font-size: 14px;
  font-weight: 500;
}

.filter-option:hover {
  border-color: var(--color-primary-6);
  background: var(--color-primary-light-1);
}

.filter-option.active {
  border-color: var(--color-primary-6);
  background: var(--color-primary-6);
  color: white;
}

.challenges-grid {
  margin-bottom: 24px;
}

.challenge-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.challenge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.challenge-cover {
  height: 120px;
  background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-6));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.challenge-status {
  position: absolute;
  top: 8px;
  left: 8px;
}

.challenge-points {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.challenge-content {
  padding: 16px;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.challenge-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  line-height: 1.4;
  flex: 1;
}

.challenge-meta {
  margin-bottom: 8px;
}

.challenge-solved {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-3);
}

.challenge-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.challenge-tag {
  font-size: 10px;
  padding: 2px 6px;
  height: auto;
  line-height: 1.2;
}

/* 题目详情弹窗样式 */
.challenge-detail-modal {
  padding: 20px 0;
}

.detail-content h4 {
  margin: 20px 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.detail-content h4:first-child {
  margin-top: 0;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-2);
  margin-bottom: 20px;
}

.hints {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.hint-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-fill-2);
  border-radius: 6px;
}

.hint-number {
  font-weight: 500;
  color: var(--color-text-1);
}

.hint-content {
  color: var(--color-text-2);
  font-size: 13px;
}

.attachments {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.submission-section {
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.submission-form {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.submission-form .arco-input {
  flex: 1;
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
  
  .challenges-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .challenges-filter {
    flex-wrap: wrap;
  }
  
  .prizes-content {
    flex-direction: column;
  }
  
  .prize-item {
    min-width: auto;
  }
}
</style>
