<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="profile-info">
        <a-avatar :size="100" class="avatar">
          <img :src="userInfo.avatar" :alt="userInfo.username" />
        </a-avatar>
        <div class="user-details">
          <h2 class="username">{{ userInfo.username }}</h2>
          <p class="bio">{{ userInfo.bio }}</p>
          <div class="user-tags">
            <a-tag :color="getLevelColor(userInfo.level)">{{ userInfo.level }}</a-tag>
            <a-tag color="blue">{{ userInfo.school }}</a-tag>
            <a-tag color="green">{{ userInfo.department }}</a-tag>
          </div>
        </div>
        <div class="profile-actions">
          <a-button type="primary" @click="editProfile">
            编辑资料
          </a-button>
          <a-button type="outline" @click="shareProfile">
            分享
          </a-button>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <a-row :gutter="24">
        <a-col :span="8">
          <div class="stats-card">
            <h3>个人统计</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ userStats.totalScore }}</div>
                <div class="stat-label">总积分</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.solved }}</div>
                <div class="stat-label">解题数量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.rank }}</div>
                <div class="stat-label">全站排名</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.contests }}</div>
                <div class="stat-label">参赛次数</div>
              </div>
            </div>
          </div>

          <div class="achievements-card">
            <h3>成就徽章</h3>
            <div class="achievements-grid">
              <div 
                v-for="achievement in achievements" 
                :key="achievement.id"
                class="achievement-item"
                :class="{ unlocked: achievement.unlocked }"
              >
                <div class="achievement-icon">{{ achievement.icon }}</div>
                <div class="achievement-name">{{ achievement.name }}</div>
              </div>
            </div>
          </div>
        </a-col>

        <a-col :span="16">
          <div class="activity-section">
            <a-tabs v-model:active-key="activeTab">
              <a-tab-pane key="activity" title="最近活动">
                <div class="activity-list">
                  <div 
                    v-for="activity in recentActivities" 
                    :key="activity.id"
                    class="activity-item"
                  >
                    <div class="activity-icon">
                      <icon-trophy v-if="activity.type === 'solve'" />
                      <icon-fire v-if="activity.type === 'contest'" />
                      <icon-user v-if="activity.type === 'profile'" />
                    </div>
                    <div class="activity-content">
                      <p class="activity-text">{{ activity.description }}</p>
                      <span class="activity-time">{{ formatTime(activity.time) }}</span>
                    </div>
                  </div>
                </div>
              </a-tab-pane>

              <a-tab-pane key="solved" title="解题记录">
                <div class="solved-challenges">
                  <a-row :gutter="[16, 16]">
                    <a-col 
                      v-for="challenge in solvedChallenges" 
                      :key="challenge.id"
                      :span="12"
                    >
                      <div class="challenge-card">
                        <div class="challenge-header">
                          <h4>{{ challenge.title }}</h4>
                          <a-tag :color="getCategoryColor(challenge.category)" size="small">
                            {{ challenge.category }}
                          </a-tag>
                        </div>
                        <div class="challenge-info">
                          <span>{{ challenge.points }} 分</span>
                          <span>{{ formatTime(challenge.solvedAt) }}</span>
                        </div>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </a-tab-pane>

              <a-tab-pane key="contests" title="参赛记录">
                <div class="contest-history">
                  <div 
                    v-for="contest in contestHistory" 
                    :key="contest.id"
                    class="contest-record"
                  >
                    <div class="contest-info">
                      <h4>{{ contest.name }}</h4>
                      <p>{{ contest.description }}</p>
                      <span class="contest-time">{{ formatTime(contest.time) }}</span>
                    </div>
                    <div class="contest-result">
                      <div class="rank">第 {{ contest.rank }} 名</div>
                      <div class="score">{{ contest.score }} 分</div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IconTrophy, IconFire, IconUser } from '@arco-design/web-vue/es/icon'

const activeTab = ref('activity')

// 用户信息
const userInfo = ref({
  username: 'CyberMaster',
  avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
  bio: '热爱网络安全的CTF爱好者，专注于Web安全和密码学研究',
  level: 'Master',
  school: '清华大学',
  department: '计算机科学与技术'
})

// 用户统计
const userStats = ref({
  totalScore: 2850,
  solved: 156,
  rank: 1,
  contests: 23
})

// 成就徽章
const achievements = ref([
  { id: 1, name: '初试牛刀', icon: '🎯', unlocked: true },
  { id: 2, name: 'Web大师', icon: '🌐', unlocked: true },
  { id: 3, name: '密码专家', icon: '🔐', unlocked: true },
  { id: 4, name: '比赛达人', icon: '🏆', unlocked: true },
  { id: 5, name: '连胜王者', icon: '👑', unlocked: false },
  { id: 6, name: '全能选手', icon: '⭐', unlocked: false }
])

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'solve',
    description: '解决了 "SQL注入高级技巧" 挑战，获得 200 分',
    time: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    type: 'contest',
    description: '参加了 "全国大学生网络安全大赛"，排名第 3',
    time: '2024-01-14 18:00:00'
  },
  {
    id: 3,
    type: 'solve',
    description: '解决了 "RSA密钥分解" 挑战，获得 300 分',
    time: '2024-01-13 20:15:00'
  }
])

// 解题记录
const solvedChallenges = ref([
  {
    id: 1,
    title: 'SQL注入高级技巧',
    category: 'Web',
    points: 200,
    solvedAt: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    title: 'RSA密钥分解',
    category: '密码学',
    points: 300,
    solvedAt: '2024-01-13 20:15:00'
  }
])

// 参赛记录
const contestHistory = ref([
  {
    id: 1,
    name: '全国大学生网络安全大赛',
    description: '面向全国大学生的综合性网络安全竞赛',
    time: '2024-01-14 18:00:00',
    rank: 3,
    score: 2100
  },
  {
    id: 2,
    name: '春季新生友谊赛',
    description: '专为CTF新手设计的友谊赛',
    time: '2024-01-10 16:00:00',
    rank: 1,
    score: 1500
  }
])

const getLevelColor = (level) => {
  const colorMap = {
    'Beginner': 'gray',
    'Intermediate': 'blue',
    'Advanced': 'purple',
    'Expert': 'orange',
    'Master': 'red'
  }
  return colorMap[level] || 'gray'
}

const getCategoryColor = (category) => {
  const colorMap = {
    'Web': 'red',
    '密码学': 'blue',
    'PWN': 'green',
    '逆向': 'purple',
    '杂项': 'orange'
  }
  return colorMap[category] || 'gray'
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const editProfile = () => {
  console.log('编辑资料')
}

const shareProfile = () => {
  console.log('分享资料')
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.profile-container {
  padding: 0;
}

.profile-header {
  position: relative;
  margin-bottom: 30px;
}

.header-bg {
  height: 200px;
  background: linear-gradient(135deg, var(--color-primary-6), var(--color-primary-4));
  border-radius: 0 0 16px 16px;
}

.profile-info {
  position: absolute;
  bottom: -50px;
  left: 40px;
  right: 40px;
  display: flex;
  align-items: end;
  gap: 20px;
}

.avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-details {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.username {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text-1);
}

.bio {
  color: var(--color-text-3);
  margin-bottom: 12px;
  line-height: 1.5;
}

.user-tags .arco-tag {
  margin-right: 8px;
}

.profile-actions {
  display: flex;
  gap: 12px;
  align-items: end;
  padding-bottom: 20px;
}

.profile-content {
  padding: 0 40px;
  margin-top: 70px;
}

.stats-card,
.achievements-card {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.stats-card h3,
.achievements-card h3 {
  margin-bottom: 16px;
  color: var(--color-text-1);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-6);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-3);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.achievement-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: var(--color-fill-1);
  opacity: 0.4;
  transition: all 0.3s;
}

.achievement-item.unlocked {
  opacity: 1;
  background: var(--color-primary-light-1);
}

.achievement-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.achievement-name {
  font-size: 11px;
  color: var(--color-text-2);
}

.activity-section {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-light-1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-6);
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin-bottom: 4px;
  color: var(--color-text-2);
}

.activity-time {
  font-size: 12px;
  color: var(--color-text-4);
}

.solved-challenges,
.contest-history {
  max-height: 400px;
  overflow-y: auto;
}

.challenge-card {
  background: var(--color-fill-1);
  border-radius: 8px;
  padding: 16px;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.challenge-header h4 {
  margin: 0;
  color: var(--color-text-1);
}

.challenge-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-3);
}

.contest-record {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
  margin-bottom: 12px;
}

.contest-info h4 {
  margin-bottom: 4px;
  color: var(--color-text-1);
}

.contest-info p {
  margin-bottom: 4px;
  color: var(--color-text-3);
  font-size: 14px;
}

.contest-time {
  font-size: 12px;
  color: var(--color-text-4);
}

.contest-result {
  text-align: right;
}

.rank {
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.score {
  font-size: 14px;
  color: var(--color-primary-6);
}
</style>
