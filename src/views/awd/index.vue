<template>
  <div class="awd-container">
    <div class="header">
      <h1>⚔️ AWD攻防演练</h1>
      <p>实时攻防对抗，提升团队协作与安全防护能力</p>
    </div>

    <div class="main-content">
      <!-- 比赛列表 -->
      <div class="awd-games">
        <div class="section-header">
          <h3>🎯 比赛列表</h3>
          <div class="header-controls">
            <a-button type="primary" @click="createGame">
              <icon-plus />
              创建比赛
            </a-button>
          </div>
        </div>
        
        <div class="games-grid">
          <div 
            v-for="game in awdGames" 
            :key="game.id"
            class="game-card"
            :class="{ 
              'active': game.status === 'active',
              'upcoming': game.status === 'upcoming',
              'finished': game.status === 'finished'
            }"
            @click="enterGame(game)"
          >
            <div class="game-header">
              <div class="game-status-tag">
                <a-tag :color="getGameStatusColor(game.status)">
                  {{ getGameStatusText(game.status) }}
                </a-tag>
              </div>
              <div class="game-time">
                <icon-clock-circle />
                {{ formatGameTime(game) }}
              </div>
            </div>
            
            <div class="game-content">
              <h4 class="game-title">{{ game.title }}</h4>
              <p class="game-description">{{ game.description }}</p>
              
              <div class="game-meta">
                <div class="meta-item">
                  <icon-user />
                  <span>{{ game.totalTeams }}支队伍</span>
                </div>
                <div class="meta-item">
                  <icon-trophy />
                  <span>{{ game.totalChallenges }}道题目</span>
                </div>
                <div class="meta-item">
                  <icon-clock-circle />
                  <span>{{ game.duration }}分钟</span>
                </div>
              </div>
              
              <div class="game-tags">
                <a-tag 
                  v-for="tag in game.tags" 
                  :key="tag"
                  size="small"
                  color="blue"
                >
                  {{ tag }}
                </a-tag>
              </div>
            </div>
            
            <div class="game-footer">
              <div class="game-actions">
                <a-button 
                  v-if="game.status === 'upcoming'"
                  type="primary" 
                  size="small"
                  @click.stop="joinGame(game)"
                >
                  报名参加
                </a-button>
                <a-button 
                  v-else-if="game.status === 'active'"
                  type="success" 
                  size="small"
                  @click.stop="enterGame(game)"
                >
                  进入比赛
                </a-button>
                <a-button 
                  v-else
                  type="outline" 
                  size="small"
                  @click.stop="viewResult(game)"
                >
                  查看结果
                </a-button>
              </div>
              
              <div class="game-progress" v-if="game.status === 'active'">
                <div class="progress-text">
                  进行中 {{ game.elapsedTime }}/{{ game.duration }}分钟
                </div>
                <a-progress 
                  :percent="(game.elapsedTime / game.duration) * 100" 
                  size="small"
                  :show-text="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧信息面板 -->
      <div class="info-panel">
        <!-- 我的队伍 -->
        <div class="panel-section">
          <h3>👥 我的队伍</h3>
          <div v-if="myTeam" class="my-team">
            <div class="team-header">
              <a-avatar :size="48" :src="myTeam.avatar" />
              <div class="team-info">
                <div class="team-name">{{ myTeam.teamName }}</div>
                <div class="team-score">得分: {{ myTeam.score }}</div>
              </div>
            </div>
            
            <div class="team-members">
              <div 
                v-for="member in myTeam.members" 
                :key="member.id"
                class="member-item"
              >
                <a-avatar :size="24" :src="member.avatar" />
                <span class="member-name">{{ member.name }}</span>
                <span class="member-role">{{ member.role }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="no-team">
            <a-empty description="暂无队伍">
              <template #image>
                <icon-user-group />
              </template>
              <a-button type="primary" size="small">
                创建队伍
              </a-button>
            </a-empty>
          </div>
        </div>
        
        <!-- 最近比赛 -->
        <div class="panel-section">
          <h3>📅 最近比赛</h3>
          <div class="recent-games">
            <div 
              v-for="game in recentGames" 
              :key="game.id"
              class="recent-game-item"
              @click="enterGame(game)"
            >
              <div class="game-info">
                <div class="game-name">{{ game.title }}</div>
                <div class="game-time">{{ formatTimeAgo(game.endTime) }}</div>
              </div>
              <div class="game-result">
                <a-tag :color="game.result === 'win' ? 'green' : 'red'">
                  {{ game.result === 'win' ? '胜利' : '失败' }}
                </a-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 报名弹窗 -->
    <a-modal
      v-model:visible="showRegistrationModal"
      title="报名参加比赛"
      :width="500"
      @ok="confirmRegistration"
      @cancel="() => { showRegistrationModal = false; registrationForm.teamId = null; selectedGame = null; }"
    >
      <div class="registration-form">
        <a-form :model="registrationForm" layout="vertical">
          <a-form-item label="比赛信息">
            <div class="game-info">
              <p><strong>比赛名称:</strong> {{ selectedGame?.title }}</p>
              <p><strong>开始时间:</strong> {{ selectedGame?.startTime }}</p>
              <p><strong>比赛时长:</strong> {{ selectedGame?.duration }}分钟</p>
              <p><strong>题目数量:</strong> {{ selectedGame?.totalChallenges }}道</p>
            </div>
          </a-form-item>
          
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
              <p>请确认以上信息无误，报名后将无法更改。</p>
              <p>比赛开始前30分钟可以取消报名。</p>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconPlus, IconClockCircle, IconUser, IconTrophy, IconUserGroup } from '@arco-design/web-vue/es/icon'

const router = useRouter()

// 响应式数据
const showRegistrationModal = ref(false)
const selectedGame = ref(null)
const registrationForm = ref({
  teamId: null
})

// 可用队伍列表
const availableTeams = ref([
  { id: 1, name: '安全小分队', memberCount: 4 },
  { id: 2, name: '渗透测试队', memberCount: 3 },
  { id: 3, name: '代码审计者', memberCount: 4 }
])

// AWD比赛数据
const awdGames = ref([
  {
    id: 1,
    title: '2024春季AWD攻防演练',
    description: '春季安全攻防演练，包含Web、PWN、逆向等多种题型，考验团队协作能力',
    status: 'active',
    totalTeams: 24,
    totalChallenges: 8,
    duration: 180,
    elapsedTime: 120,
    tags: ['Web', 'PWN', '逆向', '密码学'],
    startTime: '2024-03-15 09:00:00',
    endTime: '2024-03-15 12:00:00'
  },
  {
    id: 2,
    title: '新手入门AWD挑战赛',
    description: '专为新手设计的AWD比赛，题目难度适中，适合初学者参与',
    status: 'upcoming',
    totalTeams: 16,
    totalChallenges: 5,
    duration: 120,
    elapsedTime: 0,
    tags: ['入门', 'Web', '基础'],
    startTime: '2024-03-20 14:00:00',
    endTime: '2024-03-20 16:00:00'
  },
  {
    id: 3,
    title: '企业级AWD安全竞赛',
    description: '高难度企业级安全竞赛，模拟真实攻击场景，适合高级安全工程师',
    status: 'finished',
    totalTeams: 32,
    totalChallenges: 12,
    duration: 240,
    elapsedTime: 240,
    tags: ['企业级', '高级', '实战'],
    startTime: '2024-03-10 09:00:00',
    endTime: '2024-03-10 13:00:00'
  },
  {
    id: 4,
    title: 'CTF战队选拔赛',
    description: 'CTF战队选拔赛，表现优秀者可加入校队参加省级比赛',
    status: 'upcoming',
    totalTeams: 20,
    totalChallenges: 6,
    duration: 150,
    elapsedTime: 0,
    tags: ['选拔赛', '校队', '省级'],
    startTime: '2024-03-25 09:00:00',
    endTime: '2024-03-25 11:30:00'
  }
])

// 我的队伍信息
const myTeam = ref({
  id: 1,
  teamName: '安全小分队',
  avatar: '',
  score: 1250,
  members: [
    { id: 1, name: '张三', role: '队长', avatar: '' },
    { id: 2, name: '李四', role: 'Web专家', avatar: '' },
    { id: 3, name: '王五', role: 'PWN专家', avatar: '' },
    { id: 4, name: '赵六', role: '逆向专家', avatar: '' }
  ]
})

// 最近比赛
const recentGames = ref([
  {
    id: 5,
    title: '寒假AWD练习赛',
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 7,
    result: 'win'
  },
  {
    id: 6,
    title: '网络安全月AWD竞赛',
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 14,
    result: 'win'
  },
  {
    id: 7,
    title: '校际AWD友谊赛',
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 21,
    result: 'lose'
  }
])

// 获取比赛状态颜色
const getGameStatusColor = (status) => {
  const colors = {
    active: 'green',
    upcoming: 'blue',
    finished: 'gray'
  }
  return colors[status] || 'gray'
}

// 获取比赛状态文本
const getGameStatusText = (status) => {
  const texts = {
    active: '进行中',
    upcoming: '即将开始',
    finished: '已结束'
  }
  return texts[status] || '未知'
}

// 格式化比赛时间
const formatGameTime = (game) => {
  if (game.status === 'active') {
    return `剩余 ${game.duration - game.elapsedTime} 分钟`
  } else if (game.status === 'upcoming') {
    return `开始于 ${game.startTime}`
  } else {
    return `结束于 ${game.endTime}`
  }
}

// 格式化时间
const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 1000 * 60 * 60 * 24) {
    return Math.floor(diff / (1000 * 60 * 60)) + '小时前'
  } else {
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + '天前'
  }
}

// 进入比赛
const enterGame = (game) => {
  console.log('进入比赛:', game.title)
  router.push(`/awd/detail/${game.id}`)
}

// 报名参加比赛
const joinGame = (game) => {
  console.log('报名参加比赛:', game.title)
  showRegistrationModal.value = true
  selectedGame.value = game
}

// 查看比赛结果
const viewResult = (game) => {
  console.log('查看比赛结果:', game.title)
  router.push(`/awd/result/${game.id}`)
}

// 创建比赛
const createGame = () => {
  console.log('创建新比赛')
  // TODO: 实现创建比赛逻辑
}

// 确认报名
const confirmRegistration = () => {
  if (!registrationForm.value.teamId) {
    Message.error('请选择参赛队伍')
    return
  }
  
  // TODO: 调用报名API
  Message.success('报名成功！')
  showRegistrationModal.value = false
  registrationForm.value.teamId = null
  selectedGame.value = null
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.awd-container {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.header p {
  color: var(--color-text-3);
  font-size: 16px;
}

.main-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.awd-games {
  flex: 1;
  min-width: 0;
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
  font-size: 18px;
  font-weight: 600;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.game-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.game-card.active {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.game-card.upcoming {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.game-card.finished {
  border-color: #6b7280;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.game-status-tag {
  flex-shrink: 0;
}

.game-time {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-3);
  font-size: 12px;
}

.game-content {
  margin-bottom: 16px;
}

.game-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0 0 8px 0;
}

.game-description {
  color: var(--color-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.game-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-3);
  font-size: 12px;
}

.game-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.game-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.game-actions {
  margin-bottom: 12px;
}

.game-progress {
  margin-top: 12px;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 8px;
}

.info-panel {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
}

.panel-section {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.panel-section h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.my-team .team-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.team-info .team-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.team-info .team-score {
  font-size: 14px;
  color: var(--color-text-2);
}

.team-members {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-name {
  font-size: 14px;
  color: var(--color-text-1);
  flex: 1;
}

.member-role {
  font-size: 12px;
  color: var(--color-text-3);
  background: var(--color-fill-2);
  padding: 2px 6px;
  border-radius: 4px;
}

.no-team {
  text-align: center;
}

.recent-games {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-game-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--color-fill-1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.recent-game-item:hover {
  background: var(--color-fill-2);
}

.game-info .game-name {
  font-size: 14px;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

  .game-info .game-time {
    font-size: 12px;
    color: var(--color-text-3);
  }

  /* 报名弹窗样式 */
  .registration-form {
    padding: 16px 0;
  }

  .game-info {
    background: var(--color-fill-1);
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .game-info p {
    margin: 0 0 8px 0;
    color: var(--color-text-2);
    font-size: 14px;
  }

  .game-info p:last-child {
    margin-bottom: 0;
  }

  .confirm-info {
    background: var(--color-fill-1);
    padding: 16px;
    border-radius: 8px;
  }

  .confirm-info p {
    margin: 0 0 8px 0;
    color: var(--color-text-2);
    font-size: 14px;
  }

  .confirm-info p:last-child {
    margin-bottom: 0;
  }
</style>
