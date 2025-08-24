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
          <div class="stat-value">{{ userProgress.completedChallenges }}</div>
          <div class="stat-label">已完成大题</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userProgress.totalScore }}</div>
          <div class="stat-label">总积分</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userProgress.completedSubChallenges }}</div>
          <div class="stat-label">已完成小题</div>
        </div>
      </div>
    </div>

    <!-- 大题选择区域 -->
    <div class="challenge-content">
      <!-- 分类筛选 -->
      <div class="category-filter">
        <div class="filter-header">
          <h3>🔍 分类筛选</h3>
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
        <a-col :span="24">
          <!-- 大题网格 -->
          <div class="challenges-grid">
            <div 
              v-for="challenge in filteredChallenges" 
              :key="challenge.id"
              class="challenge-card"
              :class="{ 
                'completed': challenge.completed, 
                'locked': challenge.locked,
                'current': challenge.id === userProgress.currentChallenge
              }"
              @click="selectChallenge(challenge)"
            >

              <div class="challenge-content">
                <h3 class="challenge-title">{{ challenge.title }}</h3>
                <p class="challenge-description">{{ challenge.description }}</p>
                <div class="challenge-meta">
                  <div class="challenge-difficulty">
                    <a-tag :color="getDifficultyColor(challenge.difficulty)" size="small">
                      {{ challenge.difficulty }}
                    </a-tag>
                  </div>
                  <div class="challenge-points">
                    <icon-trophy />
                    {{ challenge.totalPoints }}分
                  </div>
                </div>
                <div class="challenge-progress">
                  <div class="progress-info">
                    <span>{{ challenge.completedSubCount }}/{{ challenge.totalSubCount }} 小题</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (challenge.completedSubCount / challenge.totalSubCount) * 100 + '%' }"></div>
                  </div>
                </div>
                <div class="challenge-tags">
                  <a-tag v-for="tag in challenge.tags" :key="tag" size="small" color="blue">
                    {{ tag }}
                  </a-tag>
                </div>
              </div>

            </div>
          </div>
        </a-col>


      </a-row>
    </div>

    <!-- 小题选择弹窗 -->
    <a-modal
      v-model:visible="isSubChallengesModalVisible"
      :title="selectedChallenge ? `${selectedChallenge.title} - 关卡选择` : '关卡选择'"
      :width="700"
      :footer="false"
    >
      <div v-if="selectedChallenge" class="sub-challenges-selector">
        <!-- 大题信息 -->
        <div class="challenge-overview">
          <div class="overview-header">
            <div class="overview-icon">{{ selectedChallenge.icon }}</div>
            <div class="overview-info">
              <h3>{{ selectedChallenge.title }}</h3>
              <p>{{ selectedChallenge.description }}</p>
            </div>
            <div class="overview-stats">
              <div class="stat">
                <span class="stat-value">{{ selectedChallenge.completedSubCount }}</span>
                <span class="stat-label">已完成</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ selectedChallenge.totalSubCount }}</span>
                <span class="stat-label">总小题</span>
              </div>
              <div class="stat-nav">
                <a-button 
                  type="text" 
                  size="small" 
                  @click="prevSubChallenge"
                  :disabled="currentSubIndex === 0"
                  class="nav-btn"
                >
                  上一题
                </a-button>
                <a-button 
                  type="text" 
                  size="small" 
                  @click="nextSubChallenge"
                  :disabled="currentSubIndex === selectedChallenge.subChallenges.length - 1"
                  class="nav-btn"
                >
                  下一题
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 小题轮播选择器 -->
        <div class="sub-challenges-carousel">

          <div class="carousel-content">
            <div class="sub-challenge-card">
              <div class="sub-challenge-header">
                <div class="sub-challenge-right">
                  <div class="action-button">
                    <a-button 
                      v-if="!currentSubChallenge.completed && !currentSubChallenge.locked"
                      type="primary" 
                      size="small"
                      @click="startSubChallenge(currentSubChallenge)"
                      class="btn-challenge"
                    >
                      <icon-right />
                      开始挑战
                    </a-button>
                    <a-button 
                      v-else-if="currentSubChallenge.completed"
                      type="danger" 
                      size="small"
                      disabled
                      class="btn-completed"
                    >
                      <icon-check />
                      已完成
                    </a-button>
                    <a-button 
                      v-else
                      type="warning" 
                      size="small"
                      disabled
                      class="btn-locked"
                    >
                      <icon-lock />
                      已锁定
                    </a-button>
                  </div>
                </div>
              </div>
              
              <div class="sub-challenge-content">
                <h4 class="sub-challenge-title">{{ currentSubChallenge.title }}</h4>
                <p class="sub-challenge-description">{{ currentSubChallenge.description }}</p>
                
                <div class="sub-challenge-meta">
                  <div class="sub-challenge-difficulty">
                    <a-tag :color="getDifficultyColor(currentSubChallenge.difficulty)" size="small">
                      {{ currentSubChallenge.difficulty }}
                    </a-tag>
                  </div>
                  <div class="sub-challenge-points">
                    <icon-trophy />
                    {{ currentSubChallenge.points }}分
                  </div>
                </div>


              </div>
            </div>
          </div>


        </div>
      </div>
    </a-modal>

    <!-- 挑战进行中弹窗 -->
    <a-modal
      v-model:visible="isChallengeModalVisible"
      :title="`挑战进行中 - ${currentChallengeSub?.title}`"
      :width="900"
      :footer="false"
      :closable="false"
      :mask-closable="false"
    >
      <div v-if="currentChallengeSub" class="challenge-interface">
        <div class="challenge-header">
          <div class="challenge-info">
            <h3>{{ currentChallengeSub.title }}</h3>
            <p>{{ currentChallengeSub.description }}</p>
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
              <p>欢迎来到小题 {{ currentChallengeSub.id }}！</p>
              <p>这是一个{{ currentChallengeSub.difficulty }}难度的挑战，你需要：</p>
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
  IconClockCircle,
  IconLeft
} from '@arco-design/web-vue/es/icon'

// 用户进度
const userProgress = ref({
  completedChallenges: 2,
  totalScore: 1250,
  completedSubChallenges: 5,
  currentChallenge: 1
})

// 大题数据
const challenges = ref([
  {
    id: 1,
    title: 'Web安全基础',
    description: '学习基础的Web安全知识，包括HTTP协议、HTML基础等',
    difficulty: '简单',
    totalPoints: 100,
    tags: ['Web', '基础', 'HTTP', 'HTML'],
    category: 'web',
    completed: true,
    locked: false,
    completedAt: '2024-01-10 14:30:00',
    requiredChallenge: null,
    completedSubCount: 1,
    totalSubCount: 3,
    subChallenges: [
      { id: 1, title: 'HTTP协议基础', description: '学习HTTP协议的基本概念和请求方法', difficulty: '简单', points: 50, hint: 'HTTP协议是基于TCP/IP的应用层协议。', completed: true, locked: false },
      { id: 2, title: 'XSS跨站脚本', description: '学习XSS攻击的原理和防御方法', difficulty: '中等', points: 50, hint: 'XSS攻击是通过在网页中注入恶意脚本实现的。', completed: false, locked: false },
      { id: 3, title: 'SQL注入基础', description: '学习SQL注入的基本原理和利用方法', difficulty: '简单', points: 50, hint: 'SQL注入是通过在SQL查询中插入恶意代码实现的。', completed: false, locked: true }
    ]
  },
  {
    id: 2,
    title: '密码学进阶',
    description: '学习密码学的基本概念和算法',
    difficulty: '中等',
    totalPoints: 200,
    tags: ['密码学', '加密', '解密', 'Hash', '基础'],
    category: 'crypto',
    completed: false,
    locked: false,
    completedAt: null,
    requiredChallenge: null,
    completedSubCount: 0,
    totalSubCount: 3,
    subChallenges: [
      { id: 1, title: 'MD5加密', description: '学习MD5加密算法的原理和应用', difficulty: '简单', points: 50, hint: 'MD5是一种不可逆的哈希算法。', completed: false, locked: false },
      { id: 2, title: 'AES加密', description: '学习AES加密算法的原理和应用', difficulty: '中等', points: 50, hint: 'AES是一种对称加密算法。', completed: false, locked: false },
      { id: 3, title: 'RSA加密', description: '学习RSA加密算法的原理和应用', difficulty: '困难', points: 100, hint: 'RSA是一种非对称加密算法。', completed: false, locked: true }
    ]
  },
  {
    id: 3,
    title: '逆向工程',
    description: '学习基本的逆向分析技术',
    difficulty: '中等',
    totalPoints: 150,
    tags: ['逆向', '反编译', '汇编', '分析'],
    category: 'reverse',
    completed: false,
    locked: true,
    completedAt: null,
    requiredChallenge: 1,
    completedSubCount: 0,
    totalSubCount: 3,
    subChallenges: [
      { id: 1, title: 'IDA Pro基础', description: '学习IDA Pro的基本使用方法', difficulty: '简单', points: 50, hint: 'IDA Pro是一款强大的反编译工具。', completed: false, locked: false },
      { id: 2, title: '汇编语言基础', description: '学习汇编语言的基本语法和指令', difficulty: '中等', points: 50, hint: '汇编语言是低级语言，直接操作硬件。', completed: false, locked: false },
      { id: 3, title: 'PE文件结构', description: '学习PE文件的结构和加载原理', difficulty: '困难', points: 50, hint: 'PE文件是Windows可执行文件的格式。', completed: false, locked: false }
    ]
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

const selectedCategories = ref(['all'])

// 根据分类筛选大题
const filteredChallenges = computed(() => {
  // 如果选择了"全部"，显示所有大题
  if (selectedCategories.value.includes('all')) {
    return challenges.value
  }
  
  return challenges.value.filter(challenge => {
    // 检查大题的标签是否包含选中的分类
    return selectedCategories.value.some(category => {
      const challengeTags = challenge.tags.map(tag => tag.toLowerCase())
      const categoryKeywords = getCategoryKeywords(category)
      return categoryKeywords.some(keyword => 
        challengeTags.some(tag => tag.includes(keyword))
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
      // 如果"全部"已经被选中，则取消选择，但至少保持一个选择
      selectedCategories.value.splice(index, 1)
      if (selectedCategories.value.length === 0) {
        selectedCategories.value = ['all']
      }
    } else {
      // 如果"全部"未被选中，则只选择"全部"，清除其他选择
      selectedCategories.value = ['all']
    }
  } else {
    // 如果点击其他分类
    if (index > -1) {
      // 如果该分类已经被选中，则取消选择
      selectedCategories.value.splice(index, 1)
      // 如果没有选中任何分类，自动选中"全部"
      if (selectedCategories.value.length === 0) {
        selectedCategories.value = ['all']
      }
    } else {
      // 如果该分类未被选中，则添加该分类，并移除"全部"选择
      selectedCategories.value = selectedCategories.value.filter(cat => cat !== 'all')
      selectedCategories.value.push(category)
    }
  }
}



// 弹窗状态
const isSubChallengesModalVisible = ref(false)
const isChallengeModalVisible = ref(false)
const selectedChallenge = ref(null)

// 挑战相关状态
const flagInput = ref('')
const isSubmitting = ref(false)
const timeRemaining = ref(0)
let challengeTimer = null

// 小题轮播相关状态
const currentSubIndex = ref(0)

// 计算属性
const totalChallenges = computed(() => challenges.value.length)
const totalSubChallenges = computed(() => {
  if (!selectedChallenge.value) return 0;
  return selectedChallenge.value.subChallenges.length;
})
const progressPercentage = computed(() => {
  return Math.round((userProgress.value.completedSubChallenges / totalSubChallenges.value) * 100)
})

// 当前显示的小题
const currentSubChallenge = computed(() => {
  if (!selectedChallenge.value || !selectedChallenge.value.subChallenges) return null;
  return selectedChallenge.value.subChallenges[currentSubIndex.value] || null;
})

// 当前挑战的小题（用于挑战进行中）
const currentChallengeSub = ref(null)

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

const selectChallenge = (challenge) => {
  selectedChallenge.value = challenge
  isSubChallengesModalVisible.value = true
}

const viewSubChallenges = (challenge) => {
  selectedChallenge.value = challenge
  currentSubIndex.value = 0 // 默认显示第一个小题
  isSubChallengesModalVisible.value = true
}

const prevSubChallenge = () => {
  if (currentSubIndex.value > 0) {
    currentSubIndex.value--
  }
}

const nextSubChallenge = () => {
  if (currentSubIndex.value < selectedChallenge.value.subChallenges.length - 1) {
    currentSubIndex.value++
  }
}

const goToSubChallenge = (index) => {
  currentSubIndex.value = index
}

const startSubChallenge = (subChallenge) => {
  currentChallengeSub.value = subChallenge
  
  // 设置时间限制（根据难度调整）
  const timeMap = {
    '简单': 1800,    // 30分钟
    '中等': 3600,    // 1小时
    '困难': 5400,    // 1.5小时
    '专家': 7200     // 2小时
  }
  timeRemaining.value = timeMap[subChallenge.difficulty] || 3600
  
  // 启动计时器
  startChallengeTimer()
  
  isChallengeModalVisible.value = true
  // isSubChallengesModalVisible.value = false // 关闭小题选择弹窗
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
  currentChallengeSub.value = null
  
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
    const correctFlag = `flag{sub${currentChallengeSub.value.id}_${currentChallengeSub.value.id * 100 + 50}}`
    
    if (flagInput.value.trim() === correctFlag) {
      // 挑战成功
      clearInterval(challengeTimer)
      isChallengeModalVisible.value = false
      
      // 更新小题状态
      const subChallenge = selectedChallenge.value.subChallenges.find(s => s.id === currentChallengeSub.value.id)
      if (subChallenge) {
        subChallenge.completed = true
        subChallenge.completedAt = new Date().toLocaleString()
        
        // 更新大题完成状态
        const completedCount = selectedChallenge.value.subChallenges.filter(s => s.completed).length
        selectedChallenge.value.completedSubCount = completedCount
        
        if (completedCount === selectedChallenge.value.subChallenges.length) {
          selectedChallenge.value.completed = true
          selectedChallenge.value.completedAt = new Date().toLocaleString()
          userProgress.value.completedChallenges++
        }
      }
      
      // 更新用户进度
      userProgress.value.completedSubChallenges++
      userProgress.value.totalScore += currentChallengeSub.value.points
      
      alert(`恭喜！挑战成功！获得 ${currentChallengeSub.value.points} 积分`)
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

const unlockNextChallenge = (completedChallengeId) => {
  const nextChallenge = challenges.value.find(c => c.id === completedChallengeId + 1)
  if (nextChallenge && nextChallenge.requiredChallenge === completedChallengeId) {
    nextChallenge.locked = false
  }
}

const giveUpChallenge = () => {
  if (confirm('确定要放弃当前挑战吗？')) {
    clearInterval(challengeTimer)
    isChallengeModalVisible.value = false
    currentChallengeSub.value = null
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

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.challenge-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #ffffff, #f1f5f9);
}

.challenge-card.completed:hover {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2);
}

.challenge-card.current:hover {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.2);
}

.challenge-card.locked:hover {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.challenge-card.completed {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.challenge-card.current {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fecaca);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.challenge-card.locked {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-color: #e2e8f0;
  opacity: 1;
  cursor: not-allowed;
}



.challenge-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.challenge-description {
  margin: 0;
  color: var(--color-text-2);
  line-height: 1.5;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.challenge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.challenge-points {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-warning-6);
  font-weight: 600;
}

.challenge-progress {
  padding: 6px 0;
}

.progress-info {
  font-size: 14px;
  color: var(--color-text-3);
  margin-bottom: 8px;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background: var(--color-fill-3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary-6);
  transition: width 0.3s;
}

.challenge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 0;
}

.challenge-tags .arco-tag {
  margin: 0;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 16px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  color: #0369a1;
}

.challenge-tags .arco-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(3, 105, 161, 0.2);
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
}







/* 弹窗样式 */
.sub-challenges-selector {
  max-height: 80vh;
  overflow-y: auto;
}

.challenge-overview {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
}

.overview-icon {
  font-size: 48px;
  color: var(--color-primary-6);
  flex-shrink: 0;
}

.overview-info {
  flex: 1;
  min-width: 0;
  margin-right: 20px;
}

.overview-info h3 {
  margin: 0 0 4px 0;
  color: var(--color-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.overview-info p {
  margin: 0;
  color: var(--color-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.overview-stats {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-shrink: 0;
}

.stat-nav {
  display: flex;
  gap: 8px;
  margin-left: 20px;
}

.nav-btn {
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border: 1px solid #d1d5db;
  color: var(--color-text-1);
}

.nav-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f3f4f6;
  color: #9ca3af;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary-6);
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.sub-challenges-carousel {
  position: relative;
  margin-bottom: 24px;
}







.carousel-content {
  position: relative;
  width: 100%;
  height: 220px; /* 轮播图高度 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  padding: 16px;
  box-sizing: border-box;
}

.sub-challenge-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  gap: 12px;
}

.sub-challenge-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;
}

.sub-challenge-right {
  display: flex;
  align-items: center;
}



.action-button .arco-btn {
  margin: 0;
  font-size: 12px;
  padding: 6px 16px;
  height: 32px;
  border-radius: 16px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

/* 可挑战按钮 - 蓝色 */
.btn-challenge {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-challenge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

/* 已完成按钮 - 红色 */
.btn-completed {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-completed:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #f87171, #ef4444);
}

/* 已锁定按钮 - 橙色 */
.btn-locked {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.btn-locked:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}





.sub-challenge-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-challenge-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.sub-challenge-description {
  margin: 0;
  color: var(--color-text-2);
  line-height: 1.5;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.sub-challenge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.sub-challenge-points {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-warning-6);
  font-weight: 600;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.challenge-info p {
  margin: 0;
  color: var(--color-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
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
  gap: 12px;
}

.category-btn {
  border-radius: 20px;
  font-size: 12px;
  padding: 6px 16px;
  height: 32px;
  transition: all 0.2s ease;
  margin: 0;
}

.category-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .challenges-grid {
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
  
  .challenges-grid {
    grid-template-columns: 1fr;
  }
  
  .challenge-content {
    flex-direction: column;
  }
  

  
  .carousel-content {
    height: 200px;
  }
  

  
  .challenge-card {
    padding: 16px;
    gap: 10px;
  }
  

  
  .overview-stats {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .stat-nav {
    margin-left: 0;
    margin-top: 8px;
  }
  
  .overview-info h3,
  .overview-info p {
    max-width: 200px;
  }
  
  .challenge-title,
  .challenge-description,
  .sub-challenge-title,
  .sub-challenge-description,
  .overview-info h3,
  .overview-info p,
  .challenge-info h3,
  .challenge-info p {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
