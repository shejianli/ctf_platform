<template>
  <div class="practice-container">
    <div class="header">
      <h1>练习场</h1>
      <p>提升你的CTF技能，挑战各种类型的题目</p>
    </div>

    <div class="filters">
      <!-- 搜索框 -->
      <div class="search-section">
        <a-input 
          v-model="filters.search" 
          placeholder="搜索题目..." 
          allow-clear
          size="large"
          class="search-input"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
      </div>

      <!-- 分类筛选 -->
      <div class="filter-section">
        <h4 class="filter-title">题目分类</h4>
        <div class="filter-options">
          <div 
            class="filter-option"
            :class="{ active: filters.category === '' }"
            @click="filters.category = ''"
            :style="filters.category === '' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">📋</span>
            <span class="option-text">全部</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.category === 'web' }"
            @click="filters.category = 'web'"
            :style="filters.category === 'web' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">🌐</span>
            <span class="option-text">Web安全</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.category === 'crypto' }"
            @click="filters.category = 'crypto'"
            :style="filters.category === 'crypto' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">🔐</span>
            <span class="option-text">密码学</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.category === 'pwn' }"
            @click="filters.category = 'pwn'"
            :style="filters.category === 'pwn' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">⚡</span>
            <span class="option-text">二进制漏洞</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.category === 'misc' }"
            @click="filters.category = 'misc'"
            :style="filters.category === 'misc' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">🎯</span>
            <span class="option-text">杂项</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.category === 'reverse' }"
            @click="filters.category = 'reverse'"
            :style="filters.category === 'reverse' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">🔄</span>
            <span class="option-text">逆向工程</span>
          </div>
        </div>
      </div>

      <!-- 难度筛选 -->
      <div class="filter-section">
        <h4 class="filter-title">难度等级</h4>
        <div class="filter-options">
          <div 
            class="filter-option"
            :class="{ active: filters.difficulty === '' }"
            @click="filters.difficulty = ''"
            :style="filters.difficulty === '' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">📊</span>
            <span class="option-text">全部</span>
          </div>
          <div 
            class="filter-option difficulty-easy"
            :class="{ active: filters.difficulty === 'easy' }"
            @click="filters.difficulty = 'easy'"
            :style="filters.difficulty === 'easy' ? 'background: #52c41a; color: white; border-color: #52c41a;' : ''"
          >
            <span class="option-icon">🟢</span>
            <span class="option-text">简单</span>
          </div>
          <div 
            class="filter-option difficulty-medium"
            :class="{ active: filters.difficulty === 'medium' }"
            @click="filters.difficulty = 'medium'"
            :style="filters.difficulty === 'medium' ? 'background: #fa8c16; color: white; border-color: #fa8c16;' : ''"
          >
            <span class="option-icon">🟡</span>
            <span class="option-text">中等</span>
          </div>
          <div 
            class="filter-option difficulty-hard"
            :class="{ active: filters.difficulty === 'hard' }"
            @click="filters.difficulty = 'hard'"
            :style="filters.difficulty === 'hard' ? 'background: #f5222d; color: white; border-color: #f5222d;' : ''"
          >
            <span class="option-icon">🔴</span>
            <span class="option-text">困难</span>
          </div>
        </div>
      </div>

      <!-- 分数筛选 -->
      <div class="filter-section">
        <h4 class="filter-title">分数范围</h4>
        <div class="filter-options">
          <div 
            class="filter-option"
            :class="{ active: filters.scoreRange === '' }"
            @click="filters.scoreRange = ''"
            :style="filters.scoreRange === '' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">💯</span>
            <span class="option-text">全部</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.scoreRange === '0-100' }"
            @click="filters.scoreRange = '0-100'"
            :style="filters.scoreRange === '0-100' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">🥉</span>
            <span class="option-text">0-100分</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.scoreRange === '100-200' }"
            @click="filters.scoreRange = '100-200'"
            :style="filters.scoreRange === '100-200' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">🥈</span>
            <span class="option-text">100-200分</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.scoreRange === '200-300' }"
            @click="filters.scoreRange = '200-300'"
            :style="filters.scoreRange === '200-300' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">🥇</span>
            <span class="option-text">200-300分</span>
          </div>
          <div 
            class="filter-option"
            :class="{ active: filters.scoreRange === '300+' }"
            @click="filters.scoreRange = '300+'"
            :style="filters.scoreRange === '300+' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">👑</span>
            <span class="option-text">300分以上</span>
          </div>
        </div>
      </div>

      <!-- 状态筛选 -->
      <div class="filter-section">
        <h4 class="filter-title">完成状态</h4>
        <div class="filter-options">
          <div 
            class="filter-option"
            :class="{ active: filters.status === '' }"
            @click="filters.status = ''"
            :style="filters.status === '' ? 'background: var(--color-primary-6); color: white; border-color: var(--color-primary-6);' : ''"
          >
            <span class="option-icon">📝</span>
            <span class="option-text">全部</span>
          </div>
          <div 
            class="filter-option status-unsolved"
            :class="{ active: filters.status === 'unsolved' }"
            @click="filters.status = 'unsolved'"
            :style="filters.status === 'unsolved' ? 'background: #8c8c8c; color: white; border-color: #8c8c8c;' : ''"
          >
            <span class="option-icon">⭕</span>
            <span class="option-text">未解决</span>
          </div>
          <div 
            class="filter-option status-attempted"
            :class="{ active: filters.status === 'attempted' }"
            @click="filters.status = 'attempted'"
            :style="filters.status === 'attempted' ? 'background: #fa8c16; color: white; border-color: #fa8c16;' : ''"
          >
            <span class="option-icon">⏳</span>
            <span class="option-text">已尝试</span>
          </div>
          <div 
            class="filter-option status-solved"
            :class="{ active: filters.status === 'solved' }"
            @click="filters.status = 'solved'"
            :style="filters.status === 'solved' ? 'background: #52c41a; color: white; border-color: #52c41a;' : ''"
          >
            <span class="option-icon">✅</span>
            <span class="option-text">已解决</span>
          </div>
        </div>
      </div>
    </div>

    <div class="challenges-grid">
      <a-row :gutter="[12, 12]">
        <a-col 
          v-for="challenge in filteredChallenges" 
          :key="challenge.id" 
          :xxl="4"
          :xl="5"
          :lg="6"
          :md="8"
          :sm="12"
          :xs="24"
        >
          <a-card 
            class="challenge-card" 
            hoverable
            :size="'small'"
            @click="openChallenge(challenge)"
          >
            <template #cover>
              <div class="challenge-cover">
                <div class="category-tag" :class="challenge.category">
                  {{ getCategoryName(challenge.category) }}
                </div>
                <div class="difficulty-badge" :class="challenge.difficulty">
                  {{ getDifficultyName(challenge.difficulty) }}
                </div>
              </div>
            </template>
            
            <div class="challenge-content">
              <div class="challenge-header-row">
                <h4 class="challenge-title">{{ challenge.title }}</h4>
                <a-tag 
                  :color="getStatusColor(challenge.status)" 
                  size="small"
                  class="status-tag"
                >
                  {{ getStatusText(challenge.status) }}
                </a-tag>
              </div>
              <p class="challenge-description">{{ challenge.description }}</p>
              
              <div class="challenge-meta">
                <span class="challenge-points">
                  <icon-trophy />
                  {{ challenge.points }}分
                </span>
                <span class="challenge-solved">
                  <icon-user />
                  {{ challenge.solved }}人
                </span>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        show-size-changer
        show-jumper
        show-total
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { IconSearch, IconTrophy, IconUser } from '@arco-design/web-vue/es/icon'

// 筛选条件
const filters = reactive({
  category: '',
  difficulty: '',
  scoreRange: '',
  status: '',
  search: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0
})

// 模拟题目数据
const challenges = ref([
  {
    id: 1,
    title: 'SQL注入入门',
    description: '学习基础的SQL注入攻击技术',
    category: 'web',
    difficulty: 'easy',
    points: 100,
    solved: 156,
    status: 'solved'
  },
  {
    id: 2,
    title: 'RSA加密破解',
    description: '破解使用弱密钥的RSA加密',
    category: 'crypto',
    difficulty: 'medium',
    points: 200,
    solved: 89,
    status: 'attempted'
  },
  {
    id: 3,
    title: '缓冲区溢出',
    description: '利用栈溢出漏洞获取shell',
    category: 'pwn',
    difficulty: 'hard',
    points: 300,
    solved: 34,
    status: 'unsolved'
  },
  {
    id: 4,
    title: '隐写术挑战',
    description: '从图片中提取隐藏信息',
    category: 'misc',
    difficulty: 'easy',
    points: 150,
    solved: 102,
    status: 'solved'
  },
  {
    id: 5,
    title: '安卓逆向',
    description: '分析Android APK文件',
    category: 'reverse',
    difficulty: 'medium',
    points: 250,
    solved: 67,
    status: 'unsolved'
  },
  {
    id: 6,
    title: 'XSS挑战',
    description: '绕过XSS过滤器',
    category: 'web',
    difficulty: 'medium',
    points: 180,
    solved: 91,
    status: 'attempted'
  },
  {
    id: 7,
    title: '文件包含漏洞',
    description: '利用文件包含漏洞读取敏感文件',
    category: 'web',
    difficulty: 'medium',
    points: 220,
    solved: 75,
    status: 'unsolved'
  },
  {
    id: 8,
    title: 'AES密码分析',
    description: '分析AES加密的实现缺陷',
    category: 'crypto',
    difficulty: 'hard',
    points: 350,
    solved: 28,
    status: 'unsolved'
  },
  {
    id: 9,
    title: '栈溢出利用',
    description: '通过栈溢出获取系统权限',
    category: 'pwn',
    difficulty: 'medium',
    points: 280,
    solved: 45,
    status: 'unsolved'
  },
  {
    id: 10,
    title: '音频隐写',
    description: '从音频文件中提取隐藏的flag',
    category: 'misc',
    difficulty: 'easy',
    points: 120,
    solved: 89,
    status: 'solved'
  },
  {
    id: 11,
    title: 'JWT伪造',
    description: '伪造JWT令牌绕过身份验证',
    category: 'web',
    difficulty: 'medium',
    points: 230,
    solved: 67,
    status: 'attempted'
  },
  {
    id: 12,
    title: 'Windows逆向',
    description: '逆向分析Windows可执行文件',
    category: 'reverse',
    difficulty: 'hard',
    points: 320,
    solved: 23,
    status: 'unsolved'
  },
  {
    id: 13,
    title: '哈希碰撞',
    description: '找到MD5哈希碰撞',
    category: 'crypto',
    difficulty: 'easy',
    points: 80,
    solved: 145,
    status: 'solved'
  },
  {
    id: 14,
    title: 'SSRF漏洞',
    description: '利用服务端请求伪造漏洞',
    category: 'web',
    difficulty: 'medium',
    points: 190,
    solved: 58,
    status: 'attempted'
  },
  {
    id: 15,
    title: '内存取证',
    description: '从内存dump中提取关键信息',
    category: 'misc',
    difficulty: 'hard',
    points: 380,
    solved: 19,
    status: 'unsolved'
  }
])

// 过滤后的题目
const filteredChallenges = computed(() => {
  let result = challenges.value

  // 分类筛选
  if (filters.category) {
    result = result.filter(c => c.category === filters.category)
  }
  
  // 难度筛选
  if (filters.difficulty) {
    result = result.filter(c => c.difficulty === filters.difficulty)
  }
  
  // 分数范围筛选
  if (filters.scoreRange) {
    result = result.filter(c => {
      const points = c.points
      switch (filters.scoreRange) {
        case '0-100':
          return points >= 0 && points <= 100
        case '100-200':
          return points > 100 && points <= 200
        case '200-300':
          return points > 200 && points <= 300
        case '300+':
          return points > 300
        default:
          return true
      }
    })
  }
  
  // 状态筛选
  if (filters.status) {
    result = result.filter(c => c.status === filters.status)
  }
  
  // 搜索筛选
  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(c => 
      c.title.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    )
  }

  pagination.total = result.length
  return result
})

// 获取分类名称
const getCategoryName = (category) => {
  const map = {
    web: 'Web',
    crypto: '密码学',
    pwn: 'PWN',
    misc: '杂项',
    reverse: '逆向'
  }
  return map[category] || category
}

// 获取难度名称
const getDifficultyName = (difficulty) => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[difficulty] || difficulty
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    solved: '已解决',
    attempted: '已尝试',
    unsolved: '未解决'
  }
  return map[status] || '未知'
}

// 获取状态颜色
const getStatusColor = (status) => {
  const map = {
    solved: 'green',
    attempted: 'orange',
    unsolved: 'gray'
  }
  return map[status] || 'gray'
}

// 重置分页
const resetPagination = () => {
  pagination.current = 1
}

// 打开题目
const openChallenge = (challenge) => {
  console.log('打开题目:', challenge)
  // TODO: 跳转到题目详情页面
}

onMounted(() => {
  pagination.total = challenges.value.length
})
</script>

<style scoped>
.practice-container {
  padding: 20px;
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

.filters {
  margin-bottom: 30px;
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
}

.search-section {
  margin-bottom: 24px;
}

.search-input {
  max-width: 400px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0 0 12px 0;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--color-bg-1);
  user-select: none;
  color: var(--color-text-2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-option:hover {
  border-color: var(--color-primary-6);
  background: var(--color-primary-light-1);
  transform: translateY(-1px);
}

.filter-option.active {
  border-color: var(--color-primary-6) !important;
  background: var(--color-primary-6) !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(var(--primary-6), 0.3) !important;
}

.filter-option.active .option-icon,
.filter-option.active .option-text {
  color: white !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.option-icon {
  font-size: 14px;
  color: inherit;
}

.option-text {
  font-size: 13px;
  font-weight: 500;
  color: inherit;
}

/* 特殊主题样式 */
.difficulty-easy.active {
  background: var(--color-success-6) !important;
  border-color: var(--color-success-6) !important;
  color: white !important;
}

.difficulty-easy.active .option-icon,
.difficulty-easy.active .option-text {
  color: white !important;
}

.difficulty-medium.active {
  background: var(--color-warning-6) !important;
  border-color: var(--color-warning-6) !important;
  color: white !important;
}

.difficulty-medium.active .option-icon,
.difficulty-medium.active .option-text {
  color: white !important;
}

.difficulty-hard.active {
  background: var(--color-danger-6) !important;
  border-color: var(--color-danger-6) !important;
  color: white !important;
}

.difficulty-hard.active .option-icon,
.difficulty-hard.active .option-text {
  color: white !important;
}

.status-solved.active {
  background: var(--color-success-6) !important;
  border-color: var(--color-success-6) !important;
  color: white !important;
}

.status-solved.active .option-icon,
.status-solved.active .option-text {
  color: white !important;
}

.status-attempted.active {
  background: var(--color-warning-6) !important;
  border-color: var(--color-warning-6) !important;
  color: white !important;
}

.status-attempted.active .option-icon,
.status-attempted.active .option-text {
  color: white !important;
}

.status-unsolved.active {
  background: var(--color-text-3) !important;
  border-color: var(--color-text-3) !important;
  color: white !important;
}

.status-unsolved.active .option-icon,
.status-unsolved.active .option-text {
  color: white !important;
}

.challenges-grid {
  margin-bottom: 30px;
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
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-6));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.challenge-content {
  padding: 12px;
}

.challenge-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.challenge-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-1);
  flex: 1;
  margin-right: 8px;
}

.status-tag {
  flex-shrink: 0;
}

.challenge-description {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.challenge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.category-tag.web { background-color: #ff4757; }
.category-tag.crypto { background-color: #3742fa; }
.category-tag.pwn { background-color: #2ed573; }
.category-tag.misc { background-color: #ffa502; }
.category-tag.reverse { background-color: #9c88ff; }

.difficulty-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.difficulty-badge.easy { background-color: #7bed9f; }
.difficulty-badge.medium { background-color: #ffa502; }
.difficulty-badge.hard { background-color: #ff4757; }

.challenge-card :deep(.arco-card-actions) {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
}

.challenge-points,
.challenge-solved {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-3);
  font-size: 11px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
