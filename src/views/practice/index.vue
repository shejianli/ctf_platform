<template>
  <div class="practice-container">
    <div class="header-row">
      <div class="header-left">
        <h1>练习场</h1>
        <p>提升你的CTF技能，挑战各种类型的题目</p>
      </div>
      
      <div class="header-right">
        <a-input-search 
          v-model="filters.search" 
          placeholder="搜索题目..." 
          allow-clear
          size="large"
          class="search-input"
          search-button
          button-text="查询"
          @search="onSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input-search>
      </div>
    </div>

    <div class="filters">

        


      <!-- 筛选条件 -->
      <div class="filter-sections">
        <div class="filter-section">
          <span class="filter-label">题目分类</span>
          <a-tabs 
            v-model:active-key="filters.category" 
            size="small"
            @change="onCategoryChange"
            class="filter-tabs"
          >
            <a-tab-pane key="" title="全部"></a-tab-pane>
            <a-tab-pane key="web" title="Web安全"></a-tab-pane>
            <a-tab-pane key="crypto" title="密码学"></a-tab-pane>
            <a-tab-pane key="pwn" title="二进制漏洞"></a-tab-pane>
            <a-tab-pane key="misc" title="杂项"></a-tab-pane>
            <a-tab-pane key="reverse" title="逆向工程"></a-tab-pane>
          </a-tabs>
        </div>

        <div class="filter-section">
          <span class="filter-label">难度等级</span>
          <a-tabs 
            v-model:active-key="filters.difficulty" 
            size="small"
            @change="onDifficultyChange"
            class="filter-tabs"
          >
            <a-tab-pane key="" title="全部"></a-tab-pane>
            <a-tab-pane key="easy" title="简单"></a-tab-pane>
            <a-tab-pane key="medium" title="中等"></a-tab-pane>
            <a-tab-pane key="hard" title="困难"></a-tab-pane>
          </a-tabs>
        </div>

        <div class="filter-section">
          <span class="filter-label">分数范围</span>
          <a-tabs 
            v-model:active-key="filters.scoreRange" 
            size="small"
            @change="onScoreChange"
            class="filter-tabs"
          >
            <a-tab-pane key="" title="全部"></a-tab-pane>
            <a-tab-pane key="0-100" title="0-100分"></a-tab-pane>
            <a-tab-pane key="100-200" title="100-200分"></a-tab-pane>
            <a-tab-pane key="200-300" title="200-300分"></a-tab-pane>
            <a-tab-pane key="300+" title="300分以上"></a-tab-pane>
          </a-tabs>
        </div>

        <div class="filter-section">
          <span class="filter-label">完成状态</span>
          <a-tabs 
            v-model:active-key="filters.status" 
            size="small"
            @change="onStatusChange"
            class="filter-tabs"
          >
            <a-tab-pane key="" title="全部"></a-tab-pane>
            <a-tab-pane key="unsolved" title="未解决"></a-tab-pane>
            <a-tab-pane key="attempted" title="已尝试"></a-tab-pane>
            <a-tab-pane key="solved" title="已解决"></a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>

 
    <div class="practice-main">
      <div class="challenges-section">
        <div class="challenges-grid">
          <a-row :gutter="[12, 12]">
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
                :size="'small'"
                @click="openChallenge(challenge)"
              >
                <template #cover>
                  <div class="challenge-cover">
                  </div>
                </template>
                
                <div class="challenge-content">
                  <div class="challenge-header-row">
                    <h4 class="challenge-title">{{ challenge.title }}</h4>
                    <a-tag 
                      :color="getCategoryColor(challenge.category)" 
                      size="small"
                      class="category-tag-header"
                    >
                      {{ getCategoryName(challenge.category) }}
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

      <!-- 右侧解题动态 -->
      <div class="solving-dynamics">
        <div class="dynamics-header">
          <h3>🔥 解题动态</h3>
          <a-button type="text" size="small" @click="refreshDynamics">
            <icon-refresh />
          </a-button>
        </div>
        
        <div class="dynamics-list">
          <div 
            v-for="dynamic in solvingDynamics" 
            :key="dynamic.id" 
            class="dynamic-item"
            :class="dynamic.type"
          >
            <div class="dynamic-avatar">
              <a-avatar :size="32" :src="dynamic.userAvatar">
                {{ dynamic.userName.charAt(0) }}
              </a-avatar>
            </div>
            <div class="dynamic-content">
              <div class="dynamic-user">{{ dynamic.userName }}</div>
              <div class="dynamic-action">
                <span v-if="dynamic.type === 'solved'">解出了</span>
                <span v-else-if="dynamic.type === 'attempted'">尝试了</span>
                <span v-else-if="dynamic.type === 'first-blood'">首杀</span>
                <span class="challenge-name">{{ dynamic.challengeName }}</span>
              </div>
              <div class="dynamic-time">{{ formatTimeAgo(dynamic.timestamp) }}</div>
            </div>
            <div class="dynamic-badge" :class="dynamic.type">
              <icon-trophy v-if="dynamic.type === 'solved' || dynamic.type === 'first-blood'" />
              <icon-clock-circle v-else />
            </div>
          </div>
        </div>

        <div class="dynamics-footer">
          <a-button type="text" size="small" @click="viewAllDynamics">
            查看全部动态
          </a-button>
        </div>
      </div>
    </div>

    <!-- 题目弹窗 -->
    <a-modal
      v-model:visible="isChallengeModalVisible"
      :title="selectedChallenge ? selectedChallenge.title : '题目'"
      :width="680"
      :footer="false"
      unmount-on-close
      @close="onCloseChallenge"
    >
      <div v-if="selectedChallenge" class="challenge-modal">
        <div class="modal-header">
          <a-tag size="small">{{ getCategoryName(selectedChallenge.category) }}</a-tag>
          <a-tag size="small" :color="getStatusColor(selectedChallenge.status)" class="ml8">{{ getStatusText(selectedChallenge.status) }}</a-tag>
          <a-tag size="small" class="ml8">{{ getDifficultyName(selectedChallenge.difficulty) }}</a-tag>
          <a-tag size="small" class="ml8"><icon-trophy /> {{ selectedChallenge.points }}分</a-tag>
        </div>

        <div class="modal-body">
          <p class="desc">{{ selectedChallenge.description }}</p>

          <!-- 动态/静态 Flag 区分 -->
          <a-alert v-if="selectedChallenge.type === 'dynamic'" type="warning" show-icon class="mb12">
            本题为动态 Flag，倒计时结束后实例将失效。
          </a-alert>
          <a-alert v-else type="info" show-icon class="mb12">
            本题为静态 Flag，请下载附件或阅读描述完成解题。
          </a-alert>

          <!-- 动态 Flag 计时器 -->
          <div v-if="selectedChallenge.type === 'dynamic'" class="timer">
            <span>剩余时间：</span>
            <span class="time">{{ formatTime(remainingSec) }}</span>
            <a-button size="mini" type="text" class="ml8" @click="resetTimer">重置</a-button>
          </div>

          <!-- 静态 Flag 附件列表 -->
          <div v-else-if="selectedChallenge.attachments && selectedChallenge.attachments.length" class="attachments">
            <h5>附件下载</h5>
            <div class="attachment-list">
              <div class="attachment-item" v-for="(file, idx) in selectedChallenge.attachments" :key="idx">
                <span class="file-name">{{ file.name }}</span>
                <a-button type="primary" size="small" @click="downloadAttachment(file)">下载</a-button>
              </div>
            </div>
          </div>

          <!-- 提交 Flag -->
          <div class="flag-submit">
            <a-input v-model="flagInput" placeholder="提交你的 Flag，如 ctf{...}" allow-clear @keyup.enter="submitFlag" />
            <a-button type="primary" class="ml8" @click="submitFlag">提交</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { IconSearch, IconTrophy, IconUser, IconRefresh, IconClockCircle } from '@arco-design/web-vue/es/icon'

// 筛选条件
const filters = reactive({
  category: '',
  difficulty: '',
  scoreRange: '',
  status: '',
  search: ''
})

// 筛选条件变化处理函数
const onCategoryChange = (key) => {
  filters.category = key
  resetPagination()
}

const onDifficultyChange = (key) => {
  filters.difficulty = key
  resetPagination()
}

const onScoreChange = (key) => {
  filters.scoreRange = key
  resetPagination()
}

const onStatusChange = (key) => {
  filters.status = key
  resetPagination()
}

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
    status: 'solved',
    type: 'static',
    attachments: [
      { name: '题目说明.pdf', url: '/api/attachments/sql_intro.pdf' }
    ]
  },
  {
    id: 2,
    title: 'RSA加密破解',
    description: '破解使用弱密钥的RSA加密',
    category: 'crypto',
    difficulty: 'medium',
    points: 200,
    solved: 89,
    status: 'attempted',
    type: 'static',
    attachments: [
      { name: '公钥.pem', url: '/api/attachments/rsa_pub.pem' },
      { name: '密文.txt', url: '/api/attachments/rsa_cipher.txt' }
    ]
  },
  {
    id: 3,
    title: '缓冲区溢出',
    description: '利用栈溢出漏洞获取shell',
    category: 'pwn',
    difficulty: 'hard',
    points: 300,
    solved: 34,
    status: 'unsolved',
    type: 'dynamic',
    durationSec: 1800
  },
  {
    id: 4,
    title: '隐写术挑战',
    description: '从图片中提取隐藏信息',
    category: 'misc',
    difficulty: 'easy',
    points: 150,
    solved: 102,
    status: 'solved',
    type: 'static',
    attachments: [
      { name: 'image.jpg', url: '/api/attachments/stego_image.jpg' }
    ]
  },
  {
    id: 5,
    title: '安卓逆向',
    description: '分析Android APK文件',
    category: 'reverse',
    difficulty: 'medium',
    points: 250,
    solved: 67,
    status: 'unsolved',
    type: 'static',
    attachments: [
      { name: 'demo.apk', url: '/api/attachments/demo.apk' }
    ]
  },
  {
    id: 6,
    title: 'XSS挑战',
    description: '绕过XSS过滤器',
    category: 'web',
    difficulty: 'medium',
    points: 180,
    solved: 91,
    status: 'attempted',
    type: 'dynamic',
    durationSec: 1200
  },
  {
    id: 7,
    title: '文件包含漏洞',
    description: '利用文件包含漏洞读取敏感文件',
    category: 'web',
    difficulty: 'medium',
    points: 220,
    solved: 75,
    status: 'unsolved',
    type: 'static',
    attachments: []
  },
  {
    id: 8,
    title: 'AES密码分析',
    description: '分析AES加密的实现缺陷',
    category: 'crypto',
    difficulty: 'hard',
    points: 350,
    solved: 28,
    status: 'unsolved',
    type: 'static',
    attachments: [
      { name: 'trace.bin', url: '/api/attachments/trace.bin' }
    ]
  },
  {
    id: 9,
    title: '栈溢出利用',
    description: '通过栈溢出获取系统权限',
    category: 'pwn',
    difficulty: 'medium',
    points: 280,
    solved: 45,
    status: 'unsolved',
    type: 'dynamic',
    durationSec: 1800
  },
  {
    id: 10,
    title: '音频隐写',
    description: '从音频文件中提取隐藏的flag',
    category: 'misc',
    difficulty: 'easy',
    points: 120,
    solved: 89,
    status: 'solved',
    type: 'static',
    attachments: [
      { name: 'audio.wav', url: '/api/attachments/audio.wav' }
    ]
  },
  {
    id: 11,
    title: 'JWT伪造',
    description: '伪造JWT令牌绕过身份验证',
    category: 'web',
    difficulty: 'medium',
    points: 230,
    solved: 67,
    status: 'attempted',
    type: 'dynamic',
    durationSec: 900
  },
  {
    id: 12,
    title: 'Windows逆向',
    description: '逆向分析Windows可执行文件',
    category: 'reverse',
    difficulty: 'hard',
    points: 320,
    solved: 23,
    status: 'unsolved',
    type: 'static',
    attachments: []
  },
  {
    id: 13,
    title: '哈希碰撞',
    description: '找到MD5哈希碰撞',
    category: 'crypto',
    difficulty: 'easy',
    points: 80,
    solved: 145,
    status: 'solved',
    type: 'static',
    attachments: []
  },
  {
    id: 14,
    title: 'SSRF漏洞',
    description: '利用服务端请求伪造漏洞',
    category: 'web',
    difficulty: 'medium',
    points: 190,
    solved: 58,
    status: 'attempted',
    type: 'dynamic',
    durationSec: 1200
  },
  {
    id: 15,
    title: '内存取证',
    description: '从内存dump中提取关键信息',
    category: 'misc',
    difficulty: 'hard',
    points: 380,
    solved: 19,
    status: 'unsolved',
    type: 'static',
    attachments: [
      { name: 'memory.dump', url: '/api/attachments/memory.dump' }
    ]
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

// 获取分类颜色
const getCategoryColor = (category) => {
  const map = {
    web: 'red',
    crypto: 'blue',
    pwn: 'green',
    misc: 'orange',
    reverse: 'purple'
  }
  return map[category] || 'gray'
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

// 触发搜索（按钮或回车）
const onSearch = () => {
  resetPagination()
}

// 弹窗相关
const isChallengeModalVisible = ref(false)
const selectedChallenge = ref(null)
const flagInput = ref('')
const remainingSec = ref(0)
let countdownTimer = null

// 解题动态数据
const solvingDynamics = ref([
  {
    id: 1,
    userName: 'CTF大师',
    userAvatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    challengeName: 'SQL注入入门',
    type: 'first-blood',
    timestamp: Date.now() - 1000 * 60 * 5 // 5分钟前
  },
  {
    id: 2,
    userName: '安全小白',
    userAvatar: '',
    challengeName: 'RSA加密破解',
    type: 'solved',
    timestamp: Date.now() - 1000 * 60 * 15 // 15分钟前
  },
  {
    id: 3,
    userName: '逆向工程师',
    userAvatar: '',
    challengeName: '安卓逆向',
    type: 'attempted',
    timestamp: Date.now() - 1000 * 60 * 30 // 30分钟前
  },
  {
    id: 4,
    userName: 'Web安全专家',
    userAvatar: '',
    challengeName: 'XSS挑战',
    type: 'solved',
    timestamp: Date.now() - 1000 * 60 * 45 // 45分钟前
  },
  {
    id: 5,
    userName: '密码学爱好者',
    userAvatar: '',
    challengeName: 'AES密码分析',
    type: 'attempted',
    timestamp: Date.now() - 1000 * 60 * 60 // 1小时前
  },
  {
    id: 6,
    userName: 'PWN高手',
    userAvatar: '',
    challengeName: '缓冲区溢出',
    type: 'solved',
    timestamp: Date.now() - 1000 * 60 * 90 // 1.5小时前
  }
])

// 刷新解题动态
const refreshDynamics = () => {
  // 模拟添加新的动态
  const newDynamic = {
    id: Date.now(),
    userName: '新用户' + Math.floor(Math.random() * 1000),
    userAvatar: '',
    challengeName: challenges.value[Math.floor(Math.random() * challenges.value.length)].title,
    type: ['solved', 'attempted', 'first-blood'][Math.floor(Math.random() * 3)],
    timestamp: Date.now()
  }
  solvingDynamics.value.unshift(newDynamic)
  
  // 保持最多显示10条动态
  if (solvingDynamics.value.length > 10) {
    solvingDynamics.value = solvingDynamics.value.slice(0, 10)
  }
}

// 查看全部动态
const viewAllDynamics = () => {
  console.log('查看全部解题动态')
  // TODO: 跳转到动态页面或展开更多
}

// 格式化时间
const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 1000 * 60) {
    return '刚刚'
  } else if (diff < 1000 * 60 * 60) {
    return Math.floor(diff / (1000 * 60)) + '分钟前'
  } else if (diff < 1000 * 60 * 60 * 24) {
    return Math.floor(diff / (1000 * 60 * 60)) + '小时前'
  } else {
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + '天前'
  }
}

// 打开题目
const openChallenge = (challenge) => {
  selectedChallenge.value = challenge
  flagInput.value = ''
  isChallengeModalVisible.value = true

  stopTimer()
  if (challenge.type === 'dynamic') {
    remainingSec.value = challenge.durationSec || 1800
    startTimer()
  } else {
    remainingSec.value = 0
  }
}

const onCloseChallenge = () => {
  isChallengeModalVisible.value = false
  stopTimer()
}

const startTimer = () => {
  stopTimer()
  countdownTimer = setInterval(() => {
    if (remainingSec.value > 0) {
      remainingSec.value -= 1
    } else {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

const resetTimer = () => {
  if (selectedChallenge.value && selectedChallenge.value.type === 'dynamic') {
    remainingSec.value = selectedChallenge.value.durationSec || 1800
    startTimer()
  }
}

const formatTime = (total) => {
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const downloadAttachment = (file) => {
  window.open(file.url, '_blank')
}

const submitFlag = () => {
  console.log('提交 Flag:', flagInput.value)
  // TODO: 接口提交校验
}

onMounted(() => {
  pagination.total = challenges.value.length
})
</script>

<style scoped>
.practice-container {
  padding: 20px;
}

.practice-main {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.challenges-section {
  flex: 1;
  min-width: 0;
}

.solving-dynamics {
  width: 320px;
  flex-shrink: 0;
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 90px;
}

.dynamics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dynamics-header h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.dynamics-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dynamic-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-1);
  border-radius: 8px;
  border-left: 4px solid transparent;
  transition: all 0.3s;
}

.dynamic-item:hover {
  background: var(--color-fill-2);
  transform: translateX(2px);
}

.dynamic-item.solved {
  border-left-color: #52c41a;
}

.dynamic-item.attempted {
  border-left-color: #fa8c16;
}

.dynamic-item.first-blood {
  border-left-color: #f5222d;
}

.dynamic-avatar {
  flex-shrink: 0;
}

.dynamic-content {
  flex: 1;
  min-width: 0;
}

.dynamic-user {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.dynamic-action {
  font-size: 12px;
  color: var(--color-text-2);
  margin-bottom: 4px;
}

.challenge-name {
  color: var(--color-primary-6);
  font-weight: 500;
}

.dynamic-time {
  font-size: 11px;
  color: var(--color-text-3);
}

.dynamic-badge {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.dynamic-badge.solved {
  background: #f6ffed;
  color: #52c41a;
}

.dynamic-badge.attempted {
  background: #fff7e6;
  color: #fa8c16;
}

.dynamic-badge.first-blood {
  background: #fff1f0;
  color: #f5222d;
}

.dynamics-footer {
  margin-top: 16px;
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-left {
  flex: 1;
}

.header-left h1 {
  font-size: 28px;
  color: var(--color-text-1);
  margin-bottom: 8px;
  margin: 0 0 8px 0;
}

.header-left p {
  color: var(--color-text-3);
  font-size: 16px;
  margin: 0;
}

.header-right {
  flex-shrink: 0;
  margin-left: 20px;
}

.filters {
  margin-bottom: 30px;
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
}



.search-input {
  max-width: 400px;
}

/* 筛选条件样式 */
.filter-sections {
  margin-bottom: 24px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
  white-space: nowrap;
  min-width: 80px;
}

/* 筛选标签页样式 - 使用ArcoDesign原本样式 */
.filter-tabs {
  flex: 1;
}

.filter-tabs :deep(.arco-tabs-nav) {
  margin-bottom: 0;
}

.filter-tabs :deep(.arco-tabs-tab) {
  margin-right: 4px;
  padding-bottom: 8px;
}

.filter-tabs :deep(.arco-tabs-tab-active) {
  padding-bottom: 8px;
}

/* 圆角（胶囊）样式 */
.search-input :deep(.arco-input-search) {
  border-radius: 999px 0 0 999px;
  overflow: visible;
}

.search-input :deep(.arco-input-group),
.search-input :deep(.arco-input-wrapper) {
  border-radius: 999px 0 0 999px;
}

.search-input :deep(.arco-input) {
  border-radius: 999px 0 0 999px;
}

.search-input :deep(.arco-btn) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
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
  
  background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-6));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.challenge-content {
  padding: 10px;
}

.challenge-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.challenge-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-1);
  flex: 1;
  margin-right: 8px;
}

.category-tag-header {
  flex-shrink: 0;
}

.challenge-description {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 8px;
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

.challenge-modal .modal-header {
  display: flex;
  align-items: center;
}

.ml8 { margin-left: 8px; }
.mb12 { margin-bottom: 12px; }

.challenge-modal .desc {
  color: var(--color-text-2);
  margin-bottom: 12px;
}

.timer {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.timer .time {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 600;
  color: #0958d9;
}

.attachments h5 {
  margin: 8px 0;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-bg-2);
  border-radius: 8px;
}

.file-name { color: var(--color-text-1); }

.flag-submit {
  display: flex;
  align-items: center;
  margin-top: 16px;
}
</style>
