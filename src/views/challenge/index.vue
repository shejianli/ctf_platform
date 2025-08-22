<template>
  <div class="challenge-container">
    <!-- 页面头部 -->
    <div class="challenge-header">
      <div class="header-content">
        <h1>🎯 闯关模式</h1>
        <p>挑战自我，突破极限！完成关卡获得积分和成就</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userProgress.completedLevels }}</div>
          <div class="stat-label">已完成关卡</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userProgress.totalScore }}</div>
          <div class="stat-label">总积分</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userProgress.currentLevel }}</div>
          <div class="stat-label">当前关卡</div>
        </div>
      </div>
    </div>

    <!-- 关卡选择区域 -->
    <div class="challenge-content">
      <!-- 分类筛选 -->
      <div class="category-filter">
        <div class="filter-header">
          <h3>🔍 分类筛选</h3>
          <a-button type="text" size="small" @click="clearFilters">
            清除筛选
          </a-button>
        </div>
        <div class="filter-options">
          <a-button
            v-for="category in categories"
            :key="category.value"
            :type="selectedCategories.includes(category.value) ? 'primary' : 'outline'"
            size="small"
            @click="toggleCategory(category.value)"
            class="category-btn"
          >
            {{ category.icon }} {{ category.label }}
          </a-button>
        </div>
      </div>

      <a-row :gutter="24">
        <a-col :span="18">
          <!-- 关卡网格 -->
          <div class="levels-grid">
            <div 
              v-for="level in filteredLevels" 
              :key="level.id"
              class="level-card"
              :class="{ 
                'completed': level.completed, 
                'locked': level.locked,
                'current': level.id === userProgress.currentLevel
              }"
              @click="selectLevel(level)"
            >
              <div class="level-header">
                <div class="level-number">{{ level.id }}</div>
                <div class="level-status">
                  <icon-check v-if="level.completed" class="status-icon completed" />
                  <icon-lock v-else-if="level.locked" class="status-icon locked" />
                  <icon-right v-else class="status-icon current" />
                </div>
              </div>
              <div class="level-content">
                <h3 class="level-title">{{ level.title }}</h3>
                <p class="level-description">{{ level.description }}</p>
                <div class="level-meta">
                  <div class="level-difficulty">
                    <a-tag :color="getDifficultyColor(level.difficulty)" size="small">
                      {{ level.difficulty }}
                    </a-tag>
                  </div>
                  <div class="level-points">
                    <icon-trophy />
                    {{ level.points }}分
                  </div>
                </div>
                <div class="level-tags">
                  <a-tag v-for="tag in level.tags" :key="tag" size="small" color="blue">
                    {{ tag }}
                  </a-tag>
                </div>
              </div>
              <div class="level-footer">
                <div class="level-progress" v-if="level.completed">
                  <span>完成时间: {{ formatTime(level.completedAt) }}</span>
                </div>
                <div class="level-requirements" v-else-if="level.locked">
                  <span>需要完成关卡 {{ level.requiredLevel }}</span>
                </div>
                <div class="level-action" v-else>
                  <a-button type="primary" size="small" @click.stop="startLevel(level)">
                    开始挑战
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </a-col>

        <a-col :span="6">
          <!-- 右侧信息面板 -->
          <div class="info-panel">
            <!-- 当前进度 -->
            <div class="progress-card">
              <h3>📊 闯关进度</h3>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
              <div class="progress-text">
                {{ userProgress.completedLevels }} / {{ totalLevels }} 关卡
              </div>
            </div>

            <!-- 最近成就 -->
            <div class="achievements-card">
              <h3>🏆 最近成就</h3>
              <div class="achievements-list">
                <div 
                  v-for="achievement in recentAchievements" 
                  :key="achievement.id"
                  class="achievement-item"
                >
                  <div class="achievement-icon">{{ achievement.icon }}</div>
                  <div class="achievement-info">
                    <div class="achievement-name">{{ achievement.name }}</div>
                    <div class="achievement-time">{{ formatTime(achievement.unlockedAt) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 排行榜 -->
            <div class="leaderboard-card">
              <h3>🥇 闯关排行榜</h3>
              <div class="leaderboard-list">
                <div 
                  v-for="(player, index) in topPlayers" 
                  :key="player.id"
                  class="leaderboard-item"
                >
                  <div class="rank">{{ index + 1 }}</div>
                  <div class="player-info">
                    <div class="player-name">{{ player.username }}</div>
                    <div class="player-score">{{ player.score }}分</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 关卡详情弹窗 -->
    <a-modal
      v-model:visible="isLevelModalVisible"
      :title="selectedLevel ? `关卡 ${selectedLevel.id}: ${selectedLevel.title}` : '关卡详情'"
      :width="800"
      :footer="false"
    >
      <div v-if="selectedLevel" class="level-detail">
        <div class="detail-header">
          <div class="level-info">
            <a-tag :color="getDifficultyColor(selectedLevel.difficulty)" size="medium">
              {{ selectedLevel.difficulty }}
            </a-tag>
            <span class="level-points">
              <icon-trophy />
              {{ selectedLevel.points }}分
            </span>
          </div>
        </div>
        
        <div class="detail-content">
          <div class="content-section">
            <h4>📝 关卡描述</h4>
            <p>{{ selectedLevel.fullDescription || selectedLevel.description }}</p>
          </div>
          
          <div class="content-section">
            <h4>🎯 学习目标</h4>
            <ul>
              <li v-for="objective in (selectedLevel.objectives || ['掌握相关技能', '完成挑战目标'])" :key="objective">
                {{ objective }}
              </li>
            </ul>
          </div>
        </div>
        
        <div class="detail-actions">
          <a-button 
            v-if="!selectedLevel.completed && !selectedLevel.locked"
            type="primary" 
            size="large"
            @click="startLevel(selectedLevel)"
          >
            <icon-right />
            开始挑战
          </a-button>
          <a-button @click="closeLevelModal">
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 挑战进行中弹窗 -->
    <a-modal
      v-model:visible="isChallengeModalVisible"
      :title="`挑战进行中 - 关卡 ${currentChallenge?.id}`"
      :width="900"
      :footer="false"
      :closable="false"
      :mask-closable="false"
    >
      <div v-if="currentChallenge" class="challenge-interface">
        <div class="challenge-header">
          <div class="challenge-info">
            <h3>{{ currentChallenge.title }}</h3>
            <p>{{ currentChallenge.description }}</p>
          </div>
          <div class="challenge-timer">
            <icon-clock-circle />
            <span class="time">{{ formatTimeRemaining(timeRemaining) }}</span>
          </div>
        </div>
        
        <div class="challenge-content">
          <div class="challenge-description">
            <h4>📋 任务说明</h4>
            <div class="task-content">
              <p>欢迎来到关卡 {{ currentChallenge.id }}！</p>
              <p>这是一个{{ currentChallenge.difficulty }}难度的挑战，你需要：</p>
              <ul>
                <li>仔细阅读任务说明</li>
                <li>分析相关附件</li>
                <li>找到隐藏的flag</li>
                <li>在时间限制内提交正确答案</li>
              </ul>
            </div>
          </div>
          
          <div class="challenge-submission">
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
                :loading="isSubmitting"
                @click="submitFlag"
              >
                提交答案
              </a-button>
            </div>
          </div>
        </div>
        
        <div class="challenge-footer">
          <a-button @click="giveUpChallenge" type="outline">
            放弃挑战
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  IconCheck, 
  IconLock, 
  IconRight, 
  IconTrophy, 
  IconClockCircle
} from '@arco-design/web-vue/es/icon'

// 用户进度
const userProgress = ref({
  completedLevels: 5,
  totalScore: 1250,
  currentLevel: 6
})

// 关卡数据
const levels = ref([
  {
    id: 1,
    title: 'Web入门',
    description: '学习基础的Web安全知识，包括HTTP协议、HTML基础等',
    difficulty: '简单',
    points: 100,
    tags: ['Web', '基础', 'HTTP', 'HTML'],
    category: 'web',
    completed: true,
    locked: false,
    completedAt: '2024-01-10 14:30:00',
    requiredLevel: null
  },
  {
    id: 2,
    title: 'SQL注入基础',
    description: '学习SQL注入的基本原理和利用方法',
    difficulty: '简单',
    points: 150,
    tags: ['SQL', '注入', '数据库', '基础'],
    category: 'sql',
    completed: true,
    locked: false,
    completedAt: '2024-01-12 16:45:00',
    requiredLevel: null
  },
  {
    id: 3,
    title: 'XSS跨站脚本',
    description: '学习XSS攻击的原理和防御方法',
    difficulty: '中等',
    points: 200,
    tags: ['XSS', '跨站', 'JavaScript', 'HTML'],
    category: 'xss',
    completed: true,
    locked: false,
    completedAt: '2024-01-15 19:20:00',
    requiredLevel: null
  },
  {
    id: 4,
    title: '密码学基础',
    description: '学习密码学的基本概念和算法',
    difficulty: '中等',
    points: 250,
    tags: ['密码学', '加密', '解密', 'Hash', '基础'],
    category: 'crypto',
    completed: true,
    locked: false,
    completedAt: '2024-01-18 21:15:00',
    requiredLevel: null
  },
  {
    id: 5,
    title: '逆向工程入门',
    description: '学习基本的逆向分析技术',
    difficulty: '中等',
    points: 200,
    tags: ['逆向', '反编译', '汇编', '分析'],
    category: 'reverse',
    completed: true,
    locked: false,
    completedAt: '2024-01-20 15:30:00',
    requiredLevel: null
  },
  {
    id: 6,
    title: 'PWN基础',
    description: '学习缓冲区溢出漏洞利用',
    difficulty: '困难',
    points: 300,
    tags: ['PWN', '溢出', '缓冲区', '栈', '汇编'],
    category: 'pwn',
    completed: false,
    locked: false,
    requiredLevel: 1
  },
  {
    id: 7,
    title: '隐写术挑战',
    description: '从各种文件中提取隐藏信息',
    difficulty: '困难',
    points: 350,
    tags: ['隐写', '隐写术', '图片', '音频', '文件分析'],
    category: 'stego',
    completed: false,
    locked: true,
    requiredLevel: 2
  },
  {
    id: 8,
    title: '取证分析',
    description: '学习数字取证的基本技术',
    difficulty: '专家',
    points: 500,
    tags: ['取证', '分析', '日志', '网络', '内存'],
    category: 'forensics',
    completed: false,
    locked: true,
    requiredLevel: 4
  }
])

// 分类筛选相关
const categories = ref([
  { value: 'all', label: '全部', icon: '🌟' },
  { value: 'web', label: 'Web安全', icon: '🌐' },
  { value: 'sql', label: 'SQL注入', icon: '💉' },
  { value: 'xss', label: 'XSS攻击', icon: '🕷️' },
  { value: 'crypto', label: '密码学', icon: '🔐' },
  { value: 'reverse', label: '逆向工程', icon: '🔄' },
  { value: 'pwn', label: 'PWN漏洞', icon: '💥' },
  { value: 'stego', label: '隐写术', icon: '📁' },
  { value: 'forensics', label: '取证分析', icon: '🔍' },
  { value: 'misc', label: '杂项', icon: '🎲' }
])

const selectedCategories = ref([])

// 根据分类筛选关卡
const filteredLevels = computed(() => {
  if (selectedCategories.value.length === 0) {
    return levels.value
  }
  
  // 如果选择了"全部"，显示所有关卡
  if (selectedCategories.value.includes('all')) {
    return levels.value
  }
  
  return levels.value.filter(level => {
    // 检查关卡的标签是否包含选中的分类
    return selectedCategories.value.some(category => {
      const levelTags = level.tags.map(tag => tag.toLowerCase())
      const categoryKeywords = getCategoryKeywords(category)
      return categoryKeywords.some(keyword => 
        levelTags.some(tag => tag.includes(keyword))
      )
    })
  })
})

// 获取分类关键词
const getCategoryKeywords = (category) => {
  const keywordMap = {
    'web': ['web', 'http', 'html', 'javascript', 'php', 'python'],
    'sql': ['sql', '注入', '数据库', 'mysql', 'postgresql'],
    'xss': ['xss', '跨站', '脚本', 'javascript', 'html'],
    'crypto': ['密码', '加密', '解密', 'hash', 'md5', 'sha'],
    'reverse': ['逆向', '反编译', '汇编', 'ida', 'gdb'],
    'pwn': ['pwn', '溢出', '缓冲区', '栈', '堆'],
    'stego': ['隐写', '隐写术', '图片', '音频', '文件'],
    'forensics': ['取证', '分析', '日志', '网络', '内存'],
    'misc': ['杂项', '其他', '综合', '混合']
  }
  return keywordMap[category] || []
}

// 切换分类选择
const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  
  if (category === 'all') {
    // 如果点击"全部"
    if (index > -1) {
      // 如果"全部"已经被选中，则取消选择
      selectedCategories.value.splice(index, 1)
    } else {
      // 如果"全部"未被选中，则只选择"全部"，清除其他选择
      selectedCategories.value = ['all']
    }
  } else {
    // 如果点击其他分类
    if (index > -1) {
      // 如果该分类已经被选中，则取消选择
      selectedCategories.value.splice(index, 1)
    } else {
      // 如果该分类未被选中，则添加该分类，并移除"全部"选择
      selectedCategories.value = selectedCategories.value.filter(cat => cat !== 'all')
      selectedCategories.value.push(category)
    }
  }
}

// 清除所有筛选
const clearFilters = () => {
  selectedCategories.value = []
}

// 弹窗状态
const isLevelModalVisible = ref(false)
const isChallengeModalVisible = ref(false)
const selectedLevel = ref(null)
const currentChallenge = ref(null)

// 挑战相关状态
const flagInput = ref('')
const isSubmitting = ref(false)
const timeRemaining = ref(0)
let challengeTimer = null

// 计算属性
const totalLevels = computed(() => levels.value.length)
const progressPercentage = computed(() => {
  return Math.round((userProgress.value.completedLevels / totalLevels.value) * 100)
})

// 最近成就
const recentAchievements = ref([
  { id: 1, name: '初出茅庐', icon: '🎯', unlockedAt: '2024-01-10 14:30:00' },
  { id: 2, name: '密码专家', icon: '🔐', unlockedAt: '2024-01-12 16:45:00' },
  { id: 3, name: '逆向大师', icon: '🔄', unlockedAt: '2024-01-15 19:20:00' }
])

// 排行榜
const topPlayers = ref([
  { id: 1, username: 'CyberMaster', score: 2850 },
  { id: 2, username: 'SecurityPro', score: 2720 },
  { id: 3, username: 'HackMaster', score: 2650 },
  { id: 4, username: 'CodeBreaker', score: 2580 },
  { id: 5, username: 'NetNinja', score: 2450 }
])

// 方法
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    '简单': 'green',
    '中等': 'orange',
    '困难': 'red',
    '专家': 'purple'
  }
  return colorMap[difficulty] || 'gray'
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

const formatTimeRemaining = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const selectLevel = (level) => {
  selectedLevel.value = level
  isLevelModalVisible.value = true
}

const closeLevelModal = () => {
  isLevelModalVisible.value = false
  selectedLevel.value = null
}

const startLevel = (level) => {
  currentChallenge.value = level
  
  // 设置时间限制（根据难度调整）
  const timeMap = {
    '简单': 1800,    // 30分钟
    '中等': 3600,    // 1小时
    '困难': 5400,    // 1.5小时
    '专家': 7200     // 2小时
  }
  timeRemaining.value = timeMap[level.difficulty] || 3600
  
  // 启动计时器
  startChallengeTimer()
  
  isChallengeModalVisible.value = true
  closeLevelModal()
}

const startChallengeTimer = () => {
  challengeTimer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      // 时间到，自动失败
      timeUp()
    }
  }, 1000)
}

const timeUp = () => {
  clearInterval(challengeTimer)
  isSubmitting.value = false
  isChallengeModalVisible.value = false
  currentChallenge.value = null
  
  // 显示时间到提示
  alert('时间到！挑战失败，请重新尝试。')
}

const submitFlag = async () => {
  if (!flagInput.value.trim()) {
    alert('请输入flag！')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 模拟提交flag的API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 检查flag是否正确（这里简化处理）
    const correctFlag = `flag{level${currentChallenge.value.id}_${currentChallenge.value.id * 100 + 50}}`
    
    if (flagInput.value.trim() === correctFlag) {
      // 挑战成功
      clearInterval(challengeTimer)
      isChallengeModalVisible.value = false
      
      // 更新关卡状态
      const level = levels.value.find(l => l.id === currentChallenge.value.id)
      if (level) {
        level.completed = true
        level.completedAt = new Date().toLocaleString()
      }
      
      // 更新用户进度
      userProgress.value.completedLevels++
      userProgress.value.totalScore += currentChallenge.value.points
      userProgress.value.currentLevel = Math.max(userProgress.value.currentLevel, currentChallenge.value.id + 1)
      
      // 解锁下一关卡
      unlockNextLevel(currentChallenge.value.id)
      
      alert(`恭喜！挑战成功！获得 ${currentChallenge.value.points} 积分`)
    } else {
      alert('Flag错误，请重新尝试！')
    }
  } catch (error) {
    alert('提交失败，请重试！')
  } finally {
    isSubmitting.value = false
    flagInput.value = ''
  }
}

const unlockNextLevel = (completedLevelId) => {
  const nextLevel = levels.value.find(l => l.id === completedLevelId + 1)
  if (nextLevel && nextLevel.requiredLevel === completedLevelId) {
    nextLevel.locked = false
  }
}

const giveUpChallenge = () => {
  if (confirm('确定要放弃当前挑战吗？')) {
    clearInterval(challengeTimer)
    isChallengeModalVisible.value = false
    currentChallenge.value = null
    flagInput.value = ''
  }
}

// 生命周期
onMounted(() => {
  // 初始化数据
})

onUnmounted(() => {
  if (challengeTimer) {
    clearInterval(challengeTimer)
  }
})
</script>

<style scoped>
.challenge-container {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: 100vh;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.challenge-header {
  background: linear-gradient(135deg, var(--color-primary-6), var(--color-primary-4));
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 24px;
  color: var(--color-text-1);
  border: 2px solid var(--color-primary-3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-1);
}

.header-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
  color: var(--color-text-2);
}

.header-stats {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.challenge-content {
  margin-top: 24px;
}

.levels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.level-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.level-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #ffffff, #f1f5f9);
}

.level-card.completed:hover {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2);
}

.level-card.current:hover {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.2);
}

.level-card.locked:hover {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.level-card.completed {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.level-card.current {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fecaca);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.level-card.locked {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-color: #e2e8f0;
  opacity: 1;
  cursor: not-allowed;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.level-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-6);
}

.status-icon {
  font-size: 20px;
}

.status-icon.completed {
  color: var(--color-success-6);
}

.status-icon.locked {
  color: var(--color-text-3);
}

.status-icon.current {
  color: var(--color-primary-6);
}

.level-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.level-description {
  margin: 0 0 16px 0;
  color: var(--color-text-2);
  line-height: 1.5;
}

.level-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.level-points {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-warning-6);
  font-weight: 600;
}

.level-tags {
  margin-bottom: 16px;
}

.level-footer {
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.level-progress,
.level-requirements {
  font-size: 14px;
  color: var(--color-text-3);
}

.level-action {
  text-align: center;
}

.info-panel {
  position: sticky;
  top: 20px;
}

.progress-card,
.achievements-card,
.leaderboard-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-card h3,
.achievements-card h3,
.leaderboard-card h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
}

.progress-bar {
  height: 8px;
  background: var(--color-fill-3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary-6);
  transition: width 0.3s;
}

.progress-text {
  text-align: center;
  color: var(--color-text-2);
  font-size: 14px;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.achievement-icon {
  font-size: 24px;
}

.achievement-name {
  font-weight: 600;
  color: var(--color-text-1);
}

.achievement-time {
  font-size: 12px;
  color: var(--color-text-3);
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank {
  width: 24px;
  height: 24px;
  background: var(--color-primary-6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: 600;
  color: var(--color-text-1);
}

.player-score {
  font-size: 12px;
  color: var(--color-text-3);
}

/* 弹窗样式 */
.level-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.level-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-points {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-warning-6);
  font-weight: 600;
}

.content-section {
  margin-bottom: 24px;
}

.content-section h4 {
  margin: 0 0 12px 0;
  color: var(--color-text-1);
}

.content-section ul {
  margin: 0;
  padding-left: 20px;
}

.content-section li {
  margin-bottom: 8px;
  color: var(--color-text-2);
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

/* 分类筛选样式 */
.category-filter {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filter-header h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn {
  border-radius: 20px;
  font-size: 12px;
  padding: 4px 12px;
  height: 28px;
  transition: all 0.2s ease;
}

.category-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 挑战界面样式 */
.challenge-interface {
  max-height: 80vh;
  overflow-y: auto;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.challenge-info h3 {
  margin: 0 0 8px 0;
  color: var(--color-text-1);
}

.challenge-info p {
  margin: 0;
  color: var(--color-text-2);
}

.challenge-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-warning-6);
}

.challenge-content {
  margin-bottom: 24px;
}

.challenge-description,
.challenge-submission {
  margin-bottom: 24px;
}

.challenge-description h4,
.challenge-submission h4 {
  margin: 0 0 12px 0;
  color: var(--color-text-1);
}

.task-content {
  color: var(--color-text-2);
  line-height: 1.6;
}

.task-content ul {
  margin: 16px 0;
  padding-left: 20px;
}

.task-content li {
  margin-bottom: 8px;
}

.submission-form {
  display: flex;
  gap: 12px;
  align-items: center;
}

.submission-form .arco-input {
  flex: 1;
}

.challenge-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .levels-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .challenge-container {
    padding: 16px;
  }
  
  .challenge-header {
    padding: 20px;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .levels-grid {
    grid-template-columns: 1fr;
  }
  
  .challenge-content {
    flex-direction: column;
  }
  
  .info-panel {
    margin-top: 24px;
  }
}
</style>
