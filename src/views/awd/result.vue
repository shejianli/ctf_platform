<template>
  <div class="awd-result-container">
    <!-- 头部信息 -->
    <div class="result-header">
      <div class="header-left">
        <a-button type="text" @click="goBack">
          <icon-left />
          返回
        </a-button>
        <h1>{{ gameInfo.title }} - 比赛结果</h1>
      </div>
      <div class="header-right">
        <a-tag color="gray" size="large">已结束</a-tag>
      </div>
    </div>

    <div class="result-content">
      <!-- 左侧：最终排名 -->
      <div class="ranking-section">
        <div class="section-header">
          <h3>🏆 最终排名</h3>
          <div class="my-rank" v-if="myTeam">
            <span>我的排名: </span>
            <span class="rank-number">{{ myTeam.rank }}</span>
          </div>
        </div>
        
        <div class="ranking-list">
          <div 
            v-for="(team, index) in finalRanking" 
            :key="team.id"
            class="ranking-item"
            :class="{ 
              'my-team': team.isMyTeam,
              'top-3': index < 3
            }"
          >
            <div class="rank-number">
              <span v-if="index < 3" class="medal">
                {{ ['🥇', '🥈', '🥉'][index] }}
              </span>
              <span v-else class="number">{{ index + 1 }}</span>
            </div>
            
            <div class="team-avatar">
              <a-avatar :size="40" :src="team.avatar" />
            </div>
            
            <div class="team-info">
              <div class="team-name">{{ team.name }}</div>
              <div class="team-members">{{ team.memberCount }}人</div>
            </div>
            
            <div class="team-stats">
              <div class="stat-item">
                <div class="stat-label">得分</div>
                <div class="stat-value">{{ team.score }}分</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">解题</div>
                <div class="stat-value">{{ team.solvedCount }}/{{ gameInfo.totalChallenges }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">攻击</div>
                <div class="stat-value">{{ team.attackCount }}次</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">防守</div>
                <div class="stat-value">{{ team.defenseCount }}次</div>
              </div>
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
                v-else-if="index < 3"
                :color="['gold', 'silver', 'bronze'][index]"
                size="small"
              >
                {{ ['冠军', '亚军', '季军'][index] }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：详细统计 -->
      <div class="stats-section">
        <!-- 我的队伍统计 -->
        <div class="my-team-stats" v-if="myTeam">
          <h3>📊 我的队伍统计</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-content">
                <div class="stat-value">{{ myTeam.score }}分</div>
                <div class="stat-label">总得分</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value">{{ myTeam.solvedCount }}/{{ gameInfo.totalChallenges }}</div>
                <div class="stat-label">解题数</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⚔️</div>
              <div class="stat-content">
                <div class="stat-value">{{ myTeam.attackCount }}次</div>
                <div class="stat-label">攻击次数</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🛡️</div>
              <div class="stat-content">
                <div class="stat-value">{{ myTeam.defenseCount }}次</div>
                <div class="stat-label">防守次数</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 比赛统计 -->
        <div class="game-stats">
          <h3>📈 比赛统计</h3>
          <div class="stats-list">
            <div class="stat-row">
              <span class="stat-label">参与队伍</span>
              <span class="stat-value">{{ gameInfo.totalTeams }}支</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">题目数量</span>
              <span class="stat-value">{{ gameInfo.totalChallenges }}道</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">比赛时长</span>
              <span class="stat-value">{{ gameInfo.duration }}分钟</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">总攻击次数</span>
              <span class="stat-value">{{ totalAttacks }}次</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">总防守次数</span>
              <span class="stat-value">{{ totalDefenses }}次</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">平均得分</span>
              <span class="stat-value">{{ averageScore }}分</span>
            </div>
          </div>
        </div>

        <!-- 题目统计 -->
        <div class="challenge-stats">
          <h3>🎯 题目统计</h3>
          <div class="challenge-list">
            <div 
              v-for="challenge in challengeStats" 
              :key="challenge.id"
              class="challenge-item"
            >
              <div class="challenge-header">
                <div class="challenge-name">{{ challenge.name }}</div>
                <div class="challenge-score">{{ challenge.score }}分</div>
              </div>
              <div class="challenge-meta">
                <span class="meta-item">{{ challenge.solvedCount }}人解决</span>
                <span class="meta-item">{{ challenge.attackCount }}次攻击</span>
                <span class="meta-item">{{ challenge.defenseCount }}次防守</span>
              </div>
              <div class="challenge-progress">
                <a-progress 
                  :percent="(challenge.solvedCount / gameInfo.totalTeams) * 100" 
                  size="small"
                  :show-text="false"
                />
                <span class="progress-text">{{ ((challenge.solvedCount / gameInfo.totalTeams) * 100).toFixed(1) }}%解决率</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconLeft } from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()

// 响应式数据
const gameInfo = ref({
  id: 1,
  title: '2024春季AWD攻防演练',
  totalChallenges: 8,
  totalTeams: 24,
  duration: 180,
  startTime: '2024-03-15 09:00:00',
  endTime: '2024-03-15 12:00:00'
})

const finalRanking = ref([
  { id: 1, name: '安全小分队', avatar: '', memberCount: 4, score: 1250, solvedCount: 6, attackCount: 45, defenseCount: 8, isMyTeam: true },
  { id: 2, name: '黑客联盟', avatar: '', memberCount: 3, score: 1180, solvedCount: 5, attackCount: 38, defenseCount: 6, isMyTeam: false },
  { id: 3, name: '代码审计者', avatar: '', memberCount: 4, score: 1120, solvedCount: 5, attackCount: 42, defenseCount: 7, isMyTeam: false },
  { id: 4, name: '渗透测试队', avatar: '', memberCount: 3, score: 1050, solvedCount: 4, attackCount: 35, defenseCount: 5, isMyTeam: false },
  { id: 5, name: '逆向工程组', avatar: '', memberCount: 4, score: 980, solvedCount: 4, attackCount: 28, defenseCount: 4, isMyTeam: false },
  { id: 6, name: '网络安全队', avatar: '', memberCount: 3, score: 920, solvedCount: 3, attackCount: 25, defenseCount: 3, isMyTeam: false }
])

const challengeStats = ref([
  { id: 1, name: 'Web基础注入', score: 100, solvedCount: 12, attackCount: 45, defenseCount: 8 },
  { id: 2, name: '文件上传绕过', score: 200, solvedCount: 8, attackCount: 23, defenseCount: 5 },
  { id: 3, name: 'XSS反射型', score: 150, solvedCount: 15, attackCount: 67, defenseCount: 12 },
  { id: 4, name: 'RSA加密', score: 300, solvedCount: 6, attackCount: 18, defenseCount: 3 },
  { id: 5, name: '逆向分析', score: 250, solvedCount: 9, attackCount: 32, defenseCount: 7 },
  { id: 6, name: '缓冲区溢出', score: 350, solvedCount: 4, attackCount: 15, defenseCount: 2 }
])

// 计算属性
const myTeam = computed(() => {
  return finalRanking.value.find(team => team.isMyTeam)
})

const totalAttacks = computed(() => {
  return finalRanking.value.reduce((sum, team) => sum + team.attackCount, 0)
})

const totalDefenses = computed(() => {
  return finalRanking.value.reduce((sum, team) => sum + team.defenseCount, 0)
})

const averageScore = computed(() => {
  const totalScore = finalRanking.value.reduce((sum, team) => sum + team.score, 0)
  return Math.round(totalScore / finalRanking.value.length)
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  const gameId = route.params.id
  console.log('查看AWD比赛结果:', gameId)
  
  // TODO: 获取比赛结果数据
})
</script>

<style scoped>
.awd-result-container {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: 100vh;
}

.result-header {
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

.result-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.ranking-section {
  flex: 1;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 18px;
  font-weight: 600;
}

.my-rank {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-2);
}

.rank-number {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-6);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.ranking-item:hover {
  background: var(--color-fill-2);
}

.ranking-item.my-team {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border-color: #10b981;
}

.ranking-item.top-3 {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-color: #f59e0b;
}

.rank-number {
  min-width: 40px;
  text-align: center;
}

.medal {
  font-size: 24px;
}

.number {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-2);
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

.team-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 0 20px;
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
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.stats-section {
  width: 400px;
  flex-shrink: 0;
}

.my-team-stats,
.game-stats,
.challenge-stats {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.my-team-stats h3,
.game-stats h3,
.challenge-stats h3 {
  margin: 0 0 20px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
}

.stat-icon {
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-content .stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.stat-content .stat-label {
  font-size: 12px;
  color: var(--color-text-3);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--color-fill-1);
  border-radius: 8px;
}

.stat-row .stat-label {
  font-size: 14px;
  color: var(--color-text-2);
}

.stat-row .stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.challenge-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-item {
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.challenge-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.challenge-score {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-primary-6);
}

.challenge-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  font-size: 12px;
  color: var(--color-text-3);
}

.challenge-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-3);
  min-width: 60px;
}

@media (max-width: 1200px) {
  .result-content {
    flex-direction: column;
  }
  
  .stats-section {
    width: 100%;
  }
  
  .team-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 0 12px;
  }
}
</style>
