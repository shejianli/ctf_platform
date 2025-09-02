<template>
  <div class="awd-detail-container">
    <!-- 头部信息 -->
    <div class="detail-header">
      <div class="header-left">
        <a-button type="text" @click="goBack">
          <icon-left />
          返回
        </a-button>
        <h1>{{ gameDetail.title }}</h1>
      </div>
      <div class="header-right">
        <a-tag :color="getStatusColor(gameDetail.status)" size="large">
          {{ getStatusText(gameDetail.status) }}
        </a-tag>
      </div>
    </div>

    <div class="detail-content">
      <!-- 左侧：比赛信息 -->
      <div class="main-section">
        <!-- 比赛概览 -->
        <div class="overview-card">
          <h3>📋 比赛概览</h3>
          <div class="overview-grid">
            <div class="overview-item">
              <div class="item-label">开始时间</div>
              <div class="item-value">{{ gameDetail.startTime }}</div>
            </div>
            <div class="overview-item">
              <div class="item-label">结束时间</div>
              <div class="item-value">{{ gameDetail.endTime }}</div>
            </div>
            <div class="overview-item">
              <div class="item-label">比赛时长</div>
              <div class="item-value">{{ gameDetail.duration }}分钟</div>
            </div>
            <div class="overview-item">
              <div class="item-label">题目数量</div>
              <div class="item-value">{{ gameDetail.totalChallenges }}道</div>
            </div>
            <div class="overview-item">
              <div class="item-label">参与队伍</div>
              <div class="item-value">{{ gameDetail.totalTeams }}支</div>
            </div>
            <div class="overview-item">
              <div class="item-label">比赛类型</div>
              <div class="item-value">{{ gameDetail.type }}</div>
            </div>
          </div>
        </div>

        <!-- 比赛描述 -->
        <div class="description-card">
          <h3>📝 比赛描述</h3>
          <p>{{ gameDetail.description }}</p>
          
          <div class="description-tags">
            <a-tag 
              v-for="tag in gameDetail.tags" 
              :key="tag"
              color="blue"
              size="small"
            >
              {{ tag }}
            </a-tag>
          </div>
        </div>

        <!-- 比赛规则 -->
        <div class="rules-card">
          <h3>📜 比赛规则</h3>
          <div class="rules-list">
            <div 
              v-for="(rule, index) in gameDetail.rules" 
              :key="index"
              class="rule-item"
            >
              <span class="rule-number">{{ index + 1 }}.</span>
              <span class="rule-text">{{ rule }}</span>
            </div>
          </div>
        </div>

        <!-- 队伍列表 -->
        <div class="teams-card">
          <div class="teams-header">
            <h3>👥 参与队伍 ({{ gameDetail.teams.length }})</h3>
            <a-button 
              v-if="gameDetail.status === 'upcoming' && !isRegistered"
              type="primary"
              @click="showRegistrationModal = true"
            >
              报名参加
            </a-button>
          </div>
          
          <div class="teams-list">
            <div 
              v-for="team in gameDetail.teams" 
              :key="team.id"
              class="team-item"
              :class="{ 'my-team': team.isMyTeam }"
            >
              <div class="team-rank">{{ team.rank }}</div>
              <div class="team-avatar">
                <a-avatar :size="40" :src="team.avatar" />
              </div>
              <div class="team-info">
                <div class="team-name">{{ team.name }}</div>
                <div class="team-members">
                  {{ team.memberCount }}人 · {{ team.solvedCount }}/{{ gameDetail.totalChallenges }}题
                </div>
              </div>
              <div class="team-score">
                <span class="score-value">{{ team.score }}分</span>
              </div>
              <div class="team-status">
                <a-tag 
                  v-if="team.isMyTeam"
                  color="green"
                  size="small"
                >
                  我的队伍
                </a-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：操作面板 -->
      <div class="action-panel">
        <!-- 我的队伍信息 -->
        <div class="my-team-card" v-if="myTeam">
          <h3>🏆 我的队伍</h3>
          <div class="team-info">
            <div class="team-header">
              <a-avatar :size="48" :src="myTeam.avatar" />
              <div class="team-details">
                <div class="team-name">{{ myTeam.name }}</div>
                <div class="team-rank">排名: {{ myTeam.rank }}</div>
              </div>
            </div>
            
            <div class="team-stats">
              <div class="stat-item">
                <div class="stat-label">得分</div>
                <div class="stat-value">{{ myTeam.score }}分</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">解题数</div>
                <div class="stat-value">{{ myTeam.solvedCount }}/{{ gameDetail.totalChallenges }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">防守成功</div>
                <div class="stat-value">{{ myTeam.defenseCount }}次</div>
              </div>
            </div>
            
            <div class="team-actions">
              <a-button 
                v-if="gameDetail.status === 'active'"
                type="primary"
                block
                @click="enterGame"
              >
                进入比赛
              </a-button>
              <a-button 
                v-else-if="gameDetail.status === 'finished'"
                type="outline"
                block
                @click="viewResult"
              >
                查看结果
              </a-button>
            </div>
          </div>
        </div>

        <!-- 比赛倒计时 -->
        <div class="countdown-card" v-if="gameDetail.status === 'upcoming'">
          <h3>⏰ 比赛倒计时</h3>
          <div class="countdown-timer">
            <div class="time-unit">
              <div class="time-value">{{ countdown.days }}</div>
              <div class="time-label">天</div>
            </div>
            <div class="time-unit">
              <div class="time-value">{{ countdown.hours }}</div>
              <div class="time-label">时</div>
            </div>
            <div class="time-unit">
              <div class="time-value">{{ countdown.minutes }}</div>
              <div class="time-label">分</div>
            </div>
            <div class="time-unit">
              <div class="time-value">{{ countdown.seconds }}</div>
              <div class="time-label">秒</div>
            </div>
          </div>
        </div>

        <!-- 比赛进度 -->
        <div class="progress-card" v-if="gameDetail.status === 'active'">
          <h3>📊 比赛进度</h3>
          <div class="progress-info">
            <div class="progress-text">
              已进行 {{ elapsedTime }}/{{ gameDetail.duration }} 分钟
            </div>
            <a-progress 
              :percent="(elapsedTime / gameDetail.duration) * 100" 
              :show-text="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 报名弹窗 -->
    <a-modal
      v-model:visible="showRegistrationModal"
      title="报名参加比赛"
      :width="500"
      @ok="registerTeam"
      @cancel="showRegistrationModal = false"
    >
      <div class="registration-form">
        <a-form :model="registrationForm" layout="vertical">
          <a-form-item label="选择队伍">
            <a-select
              v-model="registrationForm.teamId"
              placeholder="请选择要参赛的队伍"
            >
              <a-option 
                v-for="team in availableTeams" 
                :key="team.id"
                :value="team.id"
              >
                {{ team.name }} ({{ team.memberCount }}人)
              </a-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="确认信息">
            <div class="confirm-info">
              <p>比赛名称: {{ gameDetail.title }}</p>
              <p>开始时间: {{ gameDetail.startTime }}</p>
              <p>比赛时长: {{ gameDetail.duration }}分钟</p>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconLeft } from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()

// 响应式数据
const gameDetail = ref({
  id: 1,
  title: '2024春季AWD攻防演练',
  description: '春季安全攻防演练，包含Web、PWN、逆向等多种题型，考验团队协作能力。比赛采用实时攻防模式，队伍需要在保护自己服务的同时攻击其他队伍的服务。',
  status: 'upcoming',
  type: 'AWD攻防',
  totalChallenges: 8,
  totalTeams: 24,
  duration: 180,
  startTime: '2024-03-15 09:00:00',
  endTime: '2024-03-15 12:00:00',
  tags: ['Web', 'PWN', '逆向', '密码学', '团队协作'],
  rules: [
    '每支队伍最多4人，最少2人',
    '比赛期间不得使用外部工具或资源',
    '攻击其他队伍服务时不得造成服务不可用',
    '发现漏洞需及时修复，否则会被扣分',
    '最终排名按得分高低排序'
  ],
  teams: [
    { id: 1, name: '安全小分队', rank: 1, score: 1250, memberCount: 4, solvedCount: 6, avatar: '', isMyTeam: true },
    { id: 2, name: '黑客联盟', rank: 2, score: 1180, memberCount: 3, solvedCount: 5, avatar: '', isMyTeam: false },
    { id: 3, name: '代码审计者', rank: 3, score: 1120, memberCount: 4, solvedCount: 5, avatar: '', isMyTeam: false },
    { id: 4, name: '渗透测试队', rank: 4, score: 1050, memberCount: 3, solvedCount: 4, avatar: '', isMyTeam: false },
    { id: 5, name: '逆向工程组', rank: 5, score: 980, memberCount: 4, solvedCount: 4, avatar: '', isMyTeam: false }
  ]
})

const myTeam = ref({
  id: 1,
  name: '安全小分队',
  avatar: '',
  rank: 1,
  score: 1250,
  solvedCount: 6,
  defenseCount: 8
})

const availableTeams = ref([
  { id: 1, name: '安全小分队', memberCount: 4 },
  { id: 2, name: '渗透测试队', memberCount: 3 },
  { id: 3, name: '代码审计者', memberCount: 4 }
])

const showRegistrationModal = ref(false)
const registrationForm = ref({
  teamId: null
})

const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const elapsedTime = ref(0)
let countdownTimer = null

// 计算属性
const isRegistered = computed(() => {
  return gameDetail.value.teams.some(team => team.isMyTeam)
})

// 获取状态颜色
const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    upcoming: 'blue',
    finished: 'gray'
  }
  return colors[status] || 'gray'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    active: '进行中',
    upcoming: '即将开始',
    finished: '已结束'
  }
  return texts[status] || '未知'
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 进入比赛
const enterGame = () => {
  router.push(`/awd/game/${gameDetail.value.id}`)
}

// 查看结果
const viewResult = () => {
  router.push(`/awd/result/${gameDetail.value.id}`)
}

// 报名参加
const registerTeam = () => {
  if (!registrationForm.value.teamId) {
    Message.error('请选择参赛队伍')
    return
  }
  
  // TODO: 调用报名API
  Message.success('报名成功！')
  showRegistrationModal.value = false
  
  // 更新比赛状态
  gameDetail.value.teams.push({
    id: registrationForm.value.teamId,
    name: availableTeams.value.find(t => t.id === registrationForm.value.teamId)?.name,
    rank: gameDetail.value.teams.length + 1,
    score: 0,
    memberCount: availableTeams.value.find(t => t.id === registrationForm.value.teamId)?.memberCount,
    solvedCount: 0,
    avatar: '',
    isMyTeam: true
  })
}

// 计算倒计时
const calculateCountdown = () => {
  const now = Date.now()
  const startTime = new Date(gameDetail.value.startTime).getTime()
  const diff = startTime - now
  
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    countdown.value = { days, hours, minutes, seconds }
  }
}

// 计算已进行时间
const calculateElapsedTime = () => {
  if (gameDetail.value.status === 'active') {
    const now = Date.now()
    const startTime = new Date(gameDetail.value.startTime).getTime()
    const elapsed = Math.floor((now - startTime) / (1000 * 60))
    elapsedTime.value = Math.min(elapsed, gameDetail.value.duration)
  }
}

onMounted(() => {
  // 获取比赛详情
  const gameId = route.params.id
  console.log('获取比赛详情:', gameId)
  
  // 启动倒计时
  if (gameDetail.value.status === 'upcoming') {
    calculateCountdown()
    countdownTimer = setInterval(calculateCountdown, 1000)
  }
  
  // 启动进度计时
  if (gameDetail.value.status === 'active') {
    calculateElapsedTime()
    countdownTimer = setInterval(calculateElapsedTime, 60000) // 每分钟更新一次
  }
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.awd-detail-container {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: 100vh;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text-1);
}

.detail-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.main-section {
  flex: 1;
  min-width: 0;
}

.overview-card,
.description-card,
.rules-card,
.teams-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.overview-card h3,
.description-card h3,
.rules-card h3,
.teams-card h3 {
  margin: 0 0 20px 0;
  color: var(--color-text-1);
  font-size: 18px;
  font-weight: 600;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-label {
  font-size: 14px;
  color: var(--color-text-3);
}

.item-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.description-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.rule-number {
  font-weight: 600;
  color: var(--color-primary-6);
  min-width: 20px;
}

.rule-text {
  color: var(--color-text-2);
  line-height: 1.6;
}

.teams-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.teams-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
  transition: all 0.3s;
}

.team-item:hover {
  background: var(--color-fill-2);
}

.team-item.my-team {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #10b981;
}

.team-rank {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-6);
  min-width: 30px;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.team-members {
  font-size: 14px;
  color: var(--color-text-3);
}

.score-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-6);
}

.action-panel {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
}

.my-team-card,
.countdown-card,
.progress-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.my-team-card h3,
.countdown-card h3,
.progress-card h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.team-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.team-details .team-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.team-details .team-rank {
  font-size: 14px;
  color: var(--color-text-2);
}

.team-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.countdown-timer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.time-unit {
  text-align: center;
}

.time-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-6);
  background: var(--color-fill-2);
  padding: 8px 12px;
  border-radius: 8px;
  min-width: 50px;
}

.time-label {
  font-size: 12px;
  color: var(--color-text-3);
  margin-top: 4px;
}

.progress-info {
  text-align: center;
}

.progress-text {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 12px;
}

.registration-form {
  padding: 16px 0;
}

.confirm-info {
  background: var(--color-fill-1);
  padding: 16px;
  border-radius: 8px;
}

.confirm-info p {
  margin: 0 0 8px 0;
  color: var(--color-text-2);
}

.confirm-info p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1200px) {
  .detail-content {
    flex-direction: column;
  }
  
  .action-panel {
    width: 100%;
    position: static;
  }
}
</style>
