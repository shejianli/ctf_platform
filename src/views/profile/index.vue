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
            <a-tag color="orange">{{ userInfo.joinDate }}</a-tag>
          </div>
        </div>
        <div class="profile-actions">
          <a-button type="primary" @click="editProfile">
            <icon-edit />
            编辑资料
          </a-button>
          <a-button type="outline" @click="shareProfile">
            <icon-download />
            分享
          </a-button>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <a-row :gutter="24">
        <a-col :span="8">
          <div class="stats-card">
            <h3>📊 个人统计</h3>
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
            <h3>🏆 成就徽章</h3>
            <div class="achievements-grid">
              <div 
                v-for="achievement in achievements" 
                :key="achievement.id"
                class="achievement-item"
                :class="{ unlocked: achievement.unlocked }"
                @click="viewAchievement(achievement)"
              >
                <div class="achievement-icon">{{ achievement.icon }}</div>
                <div class="achievement-name">{{ achievement.name }}</div>
              </div>
            </div>
          </div>

          <div class="skills-card">
            <h3>💻 技能分布</h3>
            <div class="skills-list">
              <div 
                v-for="skill in skills" 
                :key="skill.name"
                class="skill-item"
              >
                <div class="skill-info">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-score">{{ skill.score }}分</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: skill.percentage + '%' }"></div>
                </div>
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
                      <icon-star v-if="activity.type === 'achievement'" />
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
                  <div class="challenges-header">
                    <h4>已解决 {{ solvedChallenges.length }} 道题目</h4>
                    <a-input-search 
                      v-model="challengeSearch" 
                      placeholder="搜索题目..." 
                      size="small"
                      style="width: 200px"
                    />
                  </div>
                  <a-row :gutter="[16, 16]">
                    <a-col 
                      v-for="challenge in filteredChallenges" 
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

              <a-tab-pane key="settings" title="账户设置">
                <div class="settings-section">
                  <div class="setting-group">
                    <h4>基本信息</h4>
                    <a-form :model="profileForm" layout="vertical">
                      <a-form-item label="用户名">
                        <a-input v-model="profileForm.username" />
                      </a-form-item>
                      <a-form-item label="个人简介">
                        <a-textarea v-model="profileForm.bio" :rows="3" />
                      </a-form-item>
                      <a-form-item label="学校">
                        <a-input v-model="profileForm.school" />
                      </a-form-item>
                      <a-form-item label="专业">
                        <a-input v-model="profileForm.department" />
                      </a-form-item>
                      <a-form-item>
                        <a-button type="primary" @click="saveProfile">
                          保存修改
                        </a-button>
                      </a-form-item>
                    </a-form>
                  </div>

                  <div class="setting-group">
                    <h4>安全设置</h4>
                    <a-form layout="vertical">
                      <a-form-item>
                        <a-button type="outline" @click="changePassword">
                          修改密码
                        </a-button>
                      </a-form-item>
                      <a-form-item>
                        <a-button type="outline" @click="enable2FA">
                          启用双因素认证
                        </a-button>
                      </a-form-item>
                    </a-form>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 编辑资料弹窗 -->
    <a-modal
      v-model:visible="isEditModalVisible"
      title="编辑个人资料"
      :width="600"
      @ok="saveEditProfile"
      @cancel="cancelEditProfile"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="头像">
          <a-upload
            list-type="picture-card"
            :show-file-list="false"
            @change="onAvatarChange"
          >
            <div class="avatar-upload">
              <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar-preview" />
              <div v-else class="avatar-placeholder">
                <icon-plus />
                <div>上传头像</div>
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model="editForm.username" />
        </a-form-item>
        <a-form-item label="个人简介">
          <a-textarea v-model="editForm.bio" :rows="3" />
        </a-form-item>
        <a-form-item label="学校">
          <a-input v-model="editForm.school" />
        </a-form-item>
        <a-form-item label="专业">
          <a-input v-model="editForm.department" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 成就详情弹窗 -->
    <a-modal
      v-model:visible="isAchievementModalVisible"
      title="成就详情"
      :width="500"
      :footer="false"
    >
      <div v-if="selectedAchievement" class="achievement-detail">
        <div class="achievement-header">
          <div class="achievement-icon-large">{{ selectedAchievement.icon }}</div>
          <h3>{{ selectedAchievement.name }}</h3>
          <p>{{ selectedAchievement.description }}</p>
        </div>
        <div class="achievement-stats">
          <div class="stat-item">
            <span class="label">解锁时间：</span>
            <span>{{ selectedAchievement.unlockedAt || '未解锁' }}</span>
          </div>
          <div class="stat-item">
            <span class="label">解锁条件：</span>
            <span>{{ selectedAchievement.requirement }}</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { IconTrophy, IconFire, IconUser, IconEdit, IconDownload, IconPlus, IconStar } from '@arco-design/web-vue/es/icon'

const activeTab = ref('activity')

// 弹窗状态
const isEditModalVisible = ref(false)
const isAchievementModalVisible = ref(false)

// 表单数据
const profileForm = ref({
  username: '',
  bio: '',
  school: '',
  department: ''
})

const editForm = ref({
  username: '',
  bio: '',
  school: '',
  department: '',
  avatar: ''
})

// 选中的成就
const selectedAchievement = ref(null)

// 用户信息
const userInfo = ref({
  username: 'CyberMaster',
  avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
  bio: '热爱网络安全的CTF爱好者，专注于Web安全和密码学研究',
  level: 'Master',
  school: '清华大学',
  department: '计算机科学与技术',
  joinDate: '2023-01-01'
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
  { id: 1, name: '初试牛刀', icon: '🎯', unlocked: true, unlockedAt: '2023-01-01', requirement: '完成第一道题目' },
  { id: 2, name: 'Web大师', icon: '🌐', unlocked: true, unlockedAt: '2023-02-15', requirement: '解决10个Web题目' },
  { id: 3, name: '密码专家', icon: '🔐', unlocked: true, unlockedAt: '2023-03-01', requirement: '解决5个密码学题目' },
  { id: 4, name: '比赛达人', icon: '🏆', unlocked: true, unlockedAt: '2023-04-10', requirement: '参加10次CTF比赛' },
  { id: 5, name: '连胜王者', icon: '👑', unlocked: false, unlockedAt: null, requirement: '连续解决10道题目' },
  { id: 6, name: '全能选手', icon: '⭐', unlocked: false, unlockedAt: null, requirement: '解锁所有成就' }
])

// 技能分布
const skills = ref([
  { name: 'Web安全', score: 85, percentage: 85 },
  { name: '密码学', score: 75, percentage: 75 },
  { name: 'PWN', score: 90, percentage: 90 },
  { name: '逆向', score: 60, percentage: 60 },
  { name: '杂项', score: 70, percentage: 70 }
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
  isEditModalVisible.value = true
  editForm.value = { ...userInfo.value }
}

const saveProfile = () => {
  // 保存基本信息
  userInfo.value.username = profileForm.value.username
  userInfo.value.bio = profileForm.value.bio
  userInfo.value.school = profileForm.value.school
  userInfo.value.department = profileForm.value.department
  console.log('保存基本信息:', userInfo.value)
}

const shareProfile = () => {
  console.log('分享资料')
}

const viewAchievement = (achievement) => {
  selectedAchievement.value = achievement
  isAchievementModalVisible.value = true
}

const saveEditProfile = () => {
  Object.assign(userInfo.value, editForm.value)
  isEditModalVisible.value = false
  console.log('保存编辑资料:', userInfo.value)
}

const cancelEditProfile = () => {
  isEditModalVisible.value = false
}

const changePassword = () => {
  console.log('修改密码')
}

const enable2FA = () => {
  console.log('启用双因素认证')
}

const onAvatarChange = (file) => {
  if (file.status === 'done') {
    editForm.value.avatar = file.response.url || file.url
  }
}

const challengeSearch = ref('')
const filteredChallenges = ref(solvedChallenges.value)

watch(challengeSearch, (newVal) => {
  filteredChallenges.value = solvedChallenges.value.filter(challenge => 
    challenge.title.toLowerCase().includes(newVal.toLowerCase())
  )
})

onMounted(() => {
  // 初始化数据
  profileForm.value = {
    username: userInfo.value.username,
    bio: userInfo.value.bio,
    school: userInfo.value.school,
    department: userInfo.value.department
  }
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
.achievements-card,
.skills-card {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.stats-card h3,
.achievements-card h3,
.skills-card h3 {
  margin-bottom: 16px;
  color: var(--color-text-1);
}

.stats-grid,
.achievements-grid,
.skills-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item,
.skill-item {
  text-align: center;
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
}

.stat-value,
.skill-score {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-6);
  margin-bottom: 4px;
}

.stat-label,
.skill-name {
  font-size: 12px;
  color: var(--color-text-3);
}

.achievements-grid {
  grid-template-columns: repeat(3, 1fr);
}

.achievement-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: var(--color-fill-1);
  opacity: 0.4;
  transition: all 0.3s;
  cursor: pointer;
}

.achievement-item.unlocked {
  opacity: 1;
  background: var(--color-primary-light-1);
}

.achievement-item:hover {
  opacity: 0.8;
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

.challenges-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.challenges-header h4 {
  margin: 0;
  color: var(--color-text-1);
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

.settings-section {
  margin-top: 20px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group h4 {
  margin-bottom: 16px;
  color: var(--color-text-1);
}

.avatar-upload {
  width: 100px;
  height: 100px;
  border: 1px dashed var(--color-border);
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-fill-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.avatar-upload:hover {
  border-color: var(--color-primary-6);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text-4);
}

.avatar-placeholder .arco-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.achievement-detail {
  text-align: center;
}

.achievement-header {
  margin-bottom: 16px;
}

.achievement-icon-large {
  font-size: 60px;
  margin-bottom: 12px;
}

.achievement-detail h3 {
  margin-bottom: 8px;
  color: var(--color-text-1);
}

.achievement-detail p {
  color: var(--color-text-3);
  margin-bottom: 16px;
}

.achievement-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  text-align: left;
  padding: 8px 12px;
  background: var(--color-fill-2);
  border-radius: 6px;
}

.label {
  font-size: 12px;
  color: var(--color-text-3);
  margin-right: 8px;
}
</style>
