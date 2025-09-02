<template>
  <div class="awd-game-container">
    <!-- 头部信息 -->
    <div class="game-header">
      <div class="header-left">
        <a-button type="text" @click="goBack">
          <icon-left />
          返回
        </a-button>
        <h1>{{ gameInfo.title }}</h1>
      </div>
      <div class="header-center">
        <div class="game-timer">
          <icon-clock-circle />
          <span class="timer-text">{{ timeRemaining }}</span>
        </div>
      </div>
      <div class="header-right">
        <a-tag :color="getStatusColor(gameInfo.status)" size="large">
          {{ getStatusText(gameInfo.status) }}
        </a-tag>
      </div>
    </div>

    <div class="game-content">
      <!-- 左侧：题目列表 -->
      <div class="challenges-section">
        <div class="section-header">
          <h3>🎯 题目列表</h3>
          <div class="challenge-stats">
            <span class="stat-item">
              <icon-trophy />
              已解决: {{ solvedCount }}/{{ gameInfo.totalChallenges }}
            </span>
            <span class="stat-item">
              <icon-shield />
              防守成功: {{ defenseCount }}次
            </span>
          </div>
        </div>
        
        <div class="challenges-list">
          <div 
            v-for="challenge in challenges" 
            :key="challenge.id"
            class="challenge-card"
            :class="{ 
              'solved': challenge.status === 'solved',
              'attacked': challenge.status === 'attacked',
              'vulnerable': challenge.status === 'vulnerable'
            }"
            @click="openChallenge(challenge)"
          >
            <div class="challenge-header">
              <div class="challenge-title">
                <h4>{{ challenge.name }}</h4>
                <a-tag 
                  :color="getChallengeStatusColor(challenge.status)"
                  size="small"
                >
                  {{ getChallengeStatusText(challenge.status) }}
                </a-tag>
              </div>
              <div class="challenge-score">
                <span class="score-value">{{ challenge.score }}分</span>
              </div>
            </div>
            
            <div class="challenge-meta">
              <div class="meta-item">
                <icon-user />
                <span>{{ challenge.solvedCount }}人解决</span>
              </div>
              <div class="meta-item">
                <icon-attachment />
                <span>{{ challenge.attacksCount }}次攻击</span>
              </div>
              <div class="meta-item">
                <icon-shield />
                <span>{{ challenge.defenseCount }}次防守</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间：实时排行榜 -->
      <div class="ranking-section">
        <div class="section-header">
          <h3>🏆 实时排行榜</h3>
          <a-button type="text" @click="refreshRanking">
            <icon-refresh />
            刷新
          </a-button>
        </div>
        
        <div class="ranking-list">
          <div 
            v-for="(team, index) in rankingList" 
            :key="team.id"
            class="ranking-item"
            :class="{ 'my-team': team.isMyTeam }"
          >
            <div class="rank-number">
              <span v-if="index < 3" class="medal">
                {{ ['🥇', '🥈', '🥉'][index] }}
              </span>
              <span v-else class="number">{{ index + 1 }}</span>
            </div>
            
            <div class="team-info">
              <div class="team-name">{{ team.name }}</div>
              <div class="team-stats">
                {{ team.solvedCount }}/{{ gameInfo.totalChallenges }}题 · 
                {{ team.attackCount }}次攻击 · 
                {{ team.defenseCount }}次防守
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
              <a-tag 
                v-else-if="team.status === 'online'"
                color="blue"
                size="small"
              >
                在线
              </a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：攻击日志 -->
      <div class="logs-section">
        <div class="section-header">
          <h3>📊 攻击日志</h3>
          <div class="log-filters">
            <a-select v-model="logFilter" size="small" style="width: 120px">
              <a-option value="all">全部</a-option>
              <a-option value="attack">攻击</a-option>
              <a-option value="defense">防守</a-option>
            </a-select>
          </div>
        </div>
        
        <div class="logs-list">
          <div 
            v-for="log in filteredLogs" 
            :key="log.id"
            class="log-item"
            :class="log.type"
          >
            <div class="log-header">
              <div class="log-time">{{ formatTime(log.timestamp) }}</div>
              <a-tag 
                :color="log.type === 'attack' ? 'red' : 'green'"
                size="small"
              >
                {{ log.type === 'attack' ? '攻击' : '防守' }}
              </a-tag>
            </div>
            
            <div class="log-content">
              <div class="log-target">
                <span class="target-label">目标:</span>
                <span class="target-value">{{ log.targetTeam }}</span>
              </div>
              <div class="log-challenge">
                <span class="challenge-label">题目:</span>
                <span class="challenge-value">{{ log.challengeName }}</span>
              </div>
              <div class="log-result">
                <span class="result-label">结果:</span>
                <span 
                  class="result-value"
                  :class="log.success ? 'success' : 'failed'"
                >
                  {{ log.success ? '成功' : '失败' }}
                </span>
              </div>
            </div>
            
            <div class="log-footer">
              <span class="log-score">
                {{ log.score > 0 ? '+' : '' }}{{ log.score }}分
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { 
  IconLeft, IconClockCircle, IconTrophy, IconShield, 
  IconUser, IconAttachment, IconRefresh
} from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()

// 响应式数据
const gameInfo = ref({
  id: 1,
  title: '2024春季AWD攻防演练',
  status: 'active',
  totalChallenges: 8,
  startTime: Date.now() - 1000 * 60 * 60, // 1小时前开始
  duration: 180 * 60 * 1000 // 3小时
})

const challenges = ref([
  {
    id: 1,
    name: 'Web基础注入',
    status: 'solved',
    score: 100,
    solvedCount: 12,
    attacksCount: 45,
    defenseCount: 8
  },
  {
    id: 2,
    name: '文件上传绕过',
    status: 'vulnerable',
    score: 200,
    solvedCount: 8,
    attacksCount: 23,
    defenseCount: 5
  },
  {
    id: 3,
    name: 'XSS反射型',
    status: 'attacked',
    score: 150,
    solvedCount: 15,
    attacksCount: 67,
    defenseCount: 12
  }
])

const rankingList = ref([
  { id: 1, name: '安全小分队', score: 1250, solvedCount: 6, attackCount: 45, defenseCount: 8, status: 'online', isMyTeam: true },
  { id: 2, name: '黑客联盟', score: 1180, solvedCount: 5, attackCount: 38, defenseCount: 6, status: 'online', isMyTeam: false },
  { id: 3, name: '代码审计者', score: 1120, solvedCount: 5, attackCount: 42, defenseCount: 7, status: 'online', isMyTeam: false }
])

const attackLogs = ref([
  {
    id: 1,
    type: 'attack',
    targetTeam: '黑客联盟',
    challengeName: 'Web基础注入',
    success: true,
    score: 50,
    timestamp: Date.now() - 1000 * 60 * 2
  },
  {
    id: 2,
    type: 'defense',
    targetTeam: '代码审计者',
    challengeName: '文件上传绕过',
    success: true,
    score: 30,
    timestamp: Date.now() - 1000 * 60 * 5
  }
])

const logFilter = ref('all')
let gameTimer = null

// 计算属性
const timeRemaining = computed(() => {
  const now = Date.now()
  const endTime = gameInfo.value.startTime + gameInfo.value.duration
  const remaining = endTime - now
  
  if (remaining <= 0) {
    return '比赛结束'
  }
  
  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const solvedCount = computed(() => {
  return challenges.value.filter(c => c.status === 'solved').length
})

const defenseCount = computed(() => {
  return challenges.value.reduce((sum, c) => sum + c.defenseCount, 0)
})

const filteredLogs = computed(() => {
  if (logFilter.value === 'all') {
    return attackLogs.value
  }
  return attackLogs.value.filter(log => log.type === logFilter.value)
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

// 获取题目状态颜色
const getChallengeStatusColor = (status) => {
  const colors = {
    solved: 'green',
    attacked: 'red',
    vulnerable: 'orange',
    normal: 'blue'
  }
  return colors[status] || 'blue'
}

// 获取题目状态文本
const getChallengeStatusText = (status) => {
  const texts = {
    solved: '已解决',
    attacked: '被攻击',
    vulnerable: '有漏洞',
    normal: '正常'
  }
  return texts[status] || '正常'
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 刷新排行榜
const refreshRanking = () => {
  Message.success('排行榜已刷新')
}

// 打开题目详情
const openChallenge = (challenge) => {
  Message.info(`打开题目: ${challenge.name}`)
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 1000 * 60) {
    return '刚刚'
  } else if (diff < 1000 * 60 * 60) {
    return Math.floor(diff / (1000 * 60)) + '分钟前'
  } else {
    return new Date(timestamp).toLocaleTimeString()
  }
}

onMounted(() => {
  const gameId = route.params.id
  console.log('进入AWD比赛:', gameId)
  
  // 启动游戏计时器
  gameTimer = setInterval(() => {
    // 检查比赛是否结束
    const now = Date.now()
    const endTime = gameInfo.value.startTime + gameInfo.value.duration
    if (now >= endTime) {
      clearInterval(gameTimer)
      Message.info('比赛已结束')
      router.push(`/awd/result/${gameId}`)
    }
  }, 1000)
})

onUnmounted(() => {
  if (gameTimer) {
    clearInterval(gameTimer)
  }
})
</script>

<style scoped>
.awd-game-container {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: 100vh;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: var(--color-text-1);
}

.game-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-6);
}

.timer-text {
  font-family: 'Courier New', monospace;
}

.game-content {
  display: grid;
  grid-template-columns: 1fr 350px 300px;
  gap: 20px;
  align-items: flex-start;
}

.challenges-section,
.ranking-section,
.logs-section {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.challenge-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-3);
}

.challenges-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-card {
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.challenge-card:hover {
  background: var(--color-fill-2);
}

.challenge-card.solved {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.challenge-card.attacked {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

.challenge-card.vulnerable {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.challenge-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.challenge-title h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.score-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-6);
}

.challenge-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-3);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-fill-1);
  border-radius: 8px;
  transition: all 0.3s;
}

.ranking-item:hover {
  background: var(--color-fill-2);
}

.ranking-item.my-team {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #10b981;
}

.rank-number {
  min-width: 30px;
  text-align: center;
}

.medal {
  font-size: 20px;
}

.number {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-2);
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.team-stats {
  font-size: 12px;
  color: var(--color-text-3);
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  overflow-y: auto;
}

.log-item {
  padding: 12px;
  background: var(--color-fill-1);
  border-radius: 8px;
  border-left: 4px solid transparent;
}

.log-item.attack {
  border-left-color: #ef4444;
}

.log-item.defense {
  border-left-color: #10b981;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-time {
  font-size: 12px;
  color: var(--color-text-3);
}

.log-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.log-target,
.log-challenge,
.log-result {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.target-label,
.challenge-label,
.result-label {
  color: var(--color-text-3);
  min-width: 40px;
}

.target-value,
.challenge-value {
  color: var(--color-text-1);
  font-weight: 500;
}

.result-value.success {
  color: #10b981;
  font-weight: 600;
}

.result-value.failed {
  color: #ef4444;
  font-weight: 600;
}

.log-footer {
  text-align: right;
}

.log-score {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-6);
}

@media (max-width: 1400px) {
  .game-content {
    grid-template-columns: 1fr 300px 250px;
  }
}

@media (max-width: 1200px) {
  .game-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .ranking-section,
  .logs-section {
    order: -1;
  }
}
</style>
