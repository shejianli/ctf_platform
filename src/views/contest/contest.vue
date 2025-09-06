<template>
  <div class="contest-container">
    <!-- 顶部导航 -->
    <div class="header-row">
      <div class="header-left">
        <a-button type="text" @click="goBack" class="back-btn">
          <icon-left />
          返回比赛详情
        </a-button>
        <h1>{{ contestInfo.name || '比赛进行中' }}</h1>
        <p>{{ contestInfo.description || '挑战自我，突破极限！完成题目获得积分和排名' }}</p>
      </div>

      <div class="header-right">
        <div class="contest-timer">
          <div class="timer-label">距离比赛结束还有</div>
          <div class="timer-display">{{ timeRemaining }}</div>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filters">
      <!-- 分类筛选 -->
      <div class="filter-section">
        <h4 class="filter-title">题目分类</h4>
        <div class="filter-options">
          <div
            class="filter-option"
            :class="{ active: activeCategory === 'all' }"
            @click="() => { activeCategory = 'all'; resetPagination(); }"
          >
            <span class="option-icon">📋</span>
            <span class="option-text">全部</span>
          </div>
          <div
            class="filter-option"
            :class="{ active: activeCategory === 'web' }"
            @click="() => { activeCategory = 'web'; resetPagination(); }"
          >
            <span class="option-icon">🌐</span>
            <span class="option-text">Web安全</span>
          </div>
          <div
            class="filter-option"
            :class="{ active: activeCategory === 'crypto' }"
            @click="() => { activeCategory = 'crypto'; resetPagination(); }"
          >
            <span class="option-icon">🔐</span>
            <span class="option-text">密码学</span>
          </div>
          <div
            class="filter-option"
            :class="{ active: activeCategory === 'reverse' }"
            @click="() => { activeCategory = 'reverse'; resetPagination(); }"
          >
            <span class="option-icon">🔄</span>
            <span class="option-text">逆向工程</span>
          </div>
          <div
            class="filter-option"
            :class="{ active: activeCategory === 'pwn' }"
            @click="() => { activeCategory = 'pwn'; resetPagination(); }"
          >
            <span class="option-icon">💥</span>
            <span class="option-text">PWN漏洞</span>
          </div>
          <div
            class="filter-option"
            :class="{ active: activeCategory === 'misc' }"
            @click="() => { activeCategory = 'misc'; resetPagination(); }"
          >
            <span class="option-icon">🎯</span>
            <span class="option-text">杂项</span>
          </div>
        </div>
      </div>

      <!-- 解决状态筛选 -->
      <div class="filter-section">
        <h4 class="filter-title">解决状态</h4>
        <div class="filter-options">
          <div
            class="filter-option"
            :class="{ active: activeStatus === 'all' }"
            @click="() => { activeStatus = 'all'; resetPagination(); }"
          >
            <span class="option-icon">📋</span>
            <span class="option-text">全部</span>
          </div>
          <div
            class="filter-option"
            :class="{ active: activeStatus === 'unsolved' }"
            @click="() => { activeStatus = 'unsolved'; resetPagination(); }"
          >
            <span class="option-icon">❌</span>
            <span class="option-text">未解决</span>
          </div>
          <div
            class="filter-option"
            :class="{ active: activeStatus === 'solved' }"
            @click="() => { activeStatus = 'solved'; resetPagination(); }"
          >
            <span class="option-icon">✅</span>
            <span class="option-text">已解决</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧：题目列表 -->
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
                <div class="challenge-content">
                  <div class="challenge-header-row">
                    <h4 class="challenge-title">{{ challenge.name }}</h4>
                    <div class="challenge-header-right">
                      <a-tag
                        :color="getCategoryColor(challenge.category)"
                        size="small"
                        class="category-tag-header"
                      >
                        {{ getCategoryName(challenge.category) }}
                      </a-tag>
                      <span class="challenge-points">
                        <icon-trophy />
                        {{ challenge.points }}分
                      </span>
                    </div>
                  </div>

                  <div class="challenge-meta">
                    <span class="challenge-solved">
                      <icon-user />
                      {{ challenge.solvedCount }}人
                    </span>
                  </div>

                  <div class="challenge-tags">
                    <a-tag
                      v-for="tag in challenge.tags"
                      :key="tag"
                      size="small"
                      class="challenge-tag"
                    >
                      {{ tag }}
                    </a-tag>
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
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
        </div>
      </div>

      <!-- 右侧信息面板 -->
      <div class="info-panel">
        <!-- 比赛信息 -->
        <div class="panel-section">
          <h3>🏆 比赛信息</h3>
          <div class="contest-info-list">
            <div class="info-item">
              <div class="info-label">我的得分</div>
              <div class="info-value">{{ userScore }}分</div>
            </div>
            <div class="info-item">
              <div class="info-label">当前排名</div>
              <div class="info-value">第{{ userRank }}名</div>
            </div>
            <div class="info-item">
              <div class="info-label">已解决</div>
              <div class="info-value">{{ solvedCount }}/{{ totalChallenges }}</div>
            </div>
          </div>
          <a-button type="primary" block @click="showRanking">
            <icon-bar-chart />
            查看排行榜
          </a-button>
        </div>



        <!-- 解题动态 -->
        <div class="panel-section">
          <h3>🚀 解题动态</h3>
          <a-button type="text" size="small" @click="refreshDynamics" class="refresh-btn">
            <icon-refresh />
          </a-button>
          
          <a-spin :loading="dynamicsLoading" tip="加载中...">
            <div class="dynamics-list">
              <div
                v-if="solvingDynamics.length > 0"
                v-for="dynamic in solvingDynamics"
                :key="dynamic.id"
                class="dynamic-item"
                :class="dynamic.type"
              >
                <div class="dynamic-avatar">
                  <a-avatar :size="24" :src="dynamic.userAvatar">
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
                  <div class="dynamic-time">{{ dynamic.timeAgo }}</div>
                </div>
              </div>

              <div v-else-if="!dynamicsLoading" class="empty-dynamics">
                <div class="empty-icon">🏆</div>
                <p>暂无解题动态</p>
              </div>
            </div>
          </a-spin>
        </div>
      </div>
    </div>

    <!-- 题目详情弹窗 -->
    <a-modal
      v-model:visible="challengeDetailVisible"
      :title="selectedChallenge?.name"
      :width="800"
      :footer="false"
    >
      <div v-if="selectedChallenge" class="challenge-detail-modal">
        <div class="detail-content">
          <h4>📋 题目描述</h4>
          <div class="description">{{ selectedChallenge.description }}</div>
          

          
          <h4>📎 附件下载</h4>
          <div class="attachments">
            <a-button
              v-for="attachment in selectedChallenge.attachments"
              :key="attachment.id"
              type="outline"
              size="small"
              @click="downloadAttachment(attachment)"
            >
              <icon-download />
              {{ attachment.name }}
            </a-button>
          </div>
        </div>

        <div class="submission-section">
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
              :loading="submitting"
              @click="submitFlag"
            >
              提交答案
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 排行榜弹窗 -->
    <a-modal
      v-model:visible="rankingVisible"
      title="比赛排行榜"
      :width="800"
      :footer="false"
    >
      <div class="ranking-content">
        <a-table
          :columns="rankingColumns"
          :data="rankingData"
          :pagination="false"
          :scroll="{ y: 400 }"
        >
          <template #rank="{ record, rowIndex }">
            <div class="rank-display">
              <span v-if="rowIndex < 3" class="rank-medal">
                {{ ['🥇', '🥈', '🥉'][rowIndex] }}
              </span>
              <span v-else class="rank-number">{{ rowIndex + 1 }}</span>
            </div>
          </template>
          
          <template #score="{ record }">
            <span class="score-value">{{ record.score }}分</span>
          </template>
          
          <template #solved="{ record }">
            <span class="solved-count">{{ record.solved }}/{{ record.total }}</span>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { 
  IconLeft, IconTrophy, IconBarChart, IconUser, 
  IconStar, IconRefresh, IconCheckCircle, 
  IconClockCircle, IconDownload
} from '@arco-design/web-vue/es/icon'
import { findEventCPublic, getUserEventQList } from '@/api/contest'

const router = useRouter()
const route = useRoute()

// 响应式数据
const contestInfo = ref({}) // 比赛基本信息
const loading = ref(false) // 加载状态
const activeCategory = ref('all')
const activeStatus = ref('all')
const selectedChallenge = ref(null)
const flagInput = ref('')
const submitting = ref(false)
const challengeDetailVisible = ref(false)
const rankingVisible = ref(false)
const userScore = ref(0)
const userRank = ref(1)
const dynamicsLoading = ref(false)
const timeRemaining = ref('00:00:00')

// 搜索和筛选
const filters = ref({
  search: ''
})

// 分页数据
const pagination = ref({
  current: 1,
  pageSize: 12,
  total: 0
})

// 题目数据
const challenges = ref([])

// 解题动态数据
const solvingDynamics = ref([
  {
    id: 1,
    userName: 'CTF_Master',
    userAvatar: '',
    type: 'solved',
    challengeName: 'Web基础注入',
    coinsNumber: 100,
    timeAgo: '2分钟前'
  },
  {
    id: 2,
    userName: 'Security_Pro',
    userAvatar: '',
    type: 'first-blood',
    challengeName: 'RSA加密',
    coinsNumber: 300,
    timeAgo: '5分钟前'
  },
  {
    id: 3,
    userName: 'Hacker_King',
    userAvatar: '',
    type: 'attempted',
    challengeName: '逆向分析',
    coinsNumber: 0,
    timeAgo: '8分钟前'
  }
])

// 排行榜数据
const rankingData = ref([
  { rank: 1, username: 'CTF_Master', score: 850, solved: 5, total: 6, team: '红队' },
  { rank: 2, username: 'Security_Pro', score: 720, solved: 4, total: 6, team: '蓝队' },
  { rank: 3, username: 'Hacker_King', score: 650, solved: 4, total: 6, team: '绿队' },
  { rank: 4, username: 'Crypto_Expert', score: 580, solved: 3, total: 6, team: '黄队' },
  { rank: 5, username: 'Web_Ninja', score: 520, solved: 3, total: 6, team: '紫队' }
])

const rankingColumns = [
  { title: '排名', dataIndex: 'rank', slotName: 'rank', width: 80 },
  { title: '用户名', dataIndex: 'username', width: 150 },
  { title: '团队', dataIndex: 'team', width: 100 },
  { title: '得分', dataIndex: 'score', slotName: 'score', width: 100 },
  { title: '解题数', dataIndex: 'solved', slotName: 'solved', width: 100 }
]

// 计算属性
const filteredChallenges = computed(() => {
  let filtered = challenges.value
  
  // 搜索筛选
  if (filters.value.search) {
    filtered = filtered.filter(challenge => 
      challenge.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      challenge.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      challenge.tags.some(tag => tag.toLowerCase().includes(filters.value.search.toLowerCase()))
    )
  }
  
  // 分类筛选
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(challenge => challenge.category === activeCategory.value)
  }
  
  // 解决状态筛选
  if (activeStatus.value !== 'all') {
    filtered = filtered.filter(challenge => challenge.status === activeStatus.value)
  }
  
  // 更新分页总数
  pagination.value.total = filtered.length
  
  return filtered
})

const solvedCount = computed(() => {
  return challenges.value.filter(challenge => challenge.status === 'solved').length
})

const totalChallenges = computed(() => challenges.value.length)

// 倒计时计算
const calculateTimeRemaining = () => {
  // 使用比赛数据中的结束时间
  if (contestInfo.value.competitionDeadline) {
    const endTime = new Date(contestInfo.value.competitionDeadline).getTime()
    const now = new Date().getTime()
    const timeLeft = endTime - now
    
    if (timeLeft <= 0) {
      timeRemaining.value = '比赛已结束'
      return
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
    
    if (days > 0) {
      timeRemaining.value = `${days}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      timeRemaining.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  } else {
    // 如果没有比赛数据，使用默认时间
    const endTime = new Date('2024-12-31T23:59:59').getTime()
    const now = new Date().getTime()
    const timeLeft = endTime - now
    
    if (timeLeft <= 0) {
      timeRemaining.value = '比赛已结束'
      return
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
    
    if (days > 0) {
      timeRemaining.value = `${days}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      timeRemaining.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }
}



// 方法
const goBack = () => {
  router.go(-1)
}

const getCategoryColor = (category) => {
  const colorMap = {
    web: 'blue',
    crypto: 'green',
    reverse: 'orange',
    pwn: 'red',
    misc: 'purple'
  }
  return colorMap[category] || 'default'
}

const getCategoryName = (category) => {
  const nameMap = {
    web: 'Web安全',
    crypto: '密码学',
    reverse: '逆向工程',
    pwn: 'PWN漏洞',
    misc: '杂项'
  }
  return nameMap[category] || '未知'
}

const getStatusColor = (status) => {
  const colorMap = {
    unsolved: 'default',
    attempted: 'orange',
    solved: 'green'
  }
  return colorMap[status] || 'default'
}

const getStatusText = (status) => {
  const textMap = {
    unsolved: '未解决',
    attempted: '尝试中',
    solved: '已解决'
  }
  return textMap[status] || '未知'
}

const onSearch = () => {
  pagination.value.current = 1
}

const resetPagination = () => {
  pagination.value.current = 1
}

const openChallenge = (challenge) => {
  selectedChallenge.value = challenge
  challengeDetailVisible.value = true
}

const downloadAttachment = (attachment) => {
  Message.info(`下载附件: ${attachment.name}`)
}

const submitFlag = async () => {
  if (!flagInput.value.trim()) {
    Message.warning('请输入flag')
    return
  }
  
  try {
    submitting.value = true
    
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 检查flag是否正确（这里简化处理）
    const isCorrect = flagInput.value.includes('flag{') && flagInput.value.includes('}')
    
    if (isCorrect) {
      Message.success('恭喜！Flag正确！')
      
      // 更新题目状态
      selectedChallenge.value.status = 'solved'
      
      // 更新用户分数
      userScore.value += selectedChallenge.value.points
      
      // 更新solvedCount
      selectedChallenge.value.solvedCount++
      
      // 清空输入
      flagInput.value = ''
      
      // 关闭弹窗
      challengeDetailVisible.value = false
      
    } else {
      Message.error('Flag错误，请重试')
      
      // 标记为尝试过
      if (selectedChallenge.value.status === 'unsolved') {
        selectedChallenge.value.status = 'attempted'
        selectedChallenge.value.attemptCount++
      }
    }
    
  } catch (error) {
    Message.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const showRanking = () => {
  rankingVisible.value = true
}

const refreshDynamics = () => {
  Message.info('刷新解题动态')
}

const onPageChange = (page) => {
  pagination.value.current = page
}

const onPageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  pagination.value.current = 1
}

// 获取比赛数据
const fetchContestData = async () => {
  try {
    loading.value = true
    const contestId = route.params.id
    console.log('获取比赛数据，ID:', contestId)
    
    const response = await findEventCPublic(contestId)
    console.log('比赛数据响应:', response.data)
    
    if (response.data.code === 0) {
      contestInfo.value = response.data.data
      // 根据比赛数据更新倒计时
      if (contestInfo.value.competitionDeadline) {
        updateTimer(contestInfo.value.competitionDeadline)
      }
      // 获取比赛题目列表
      await fetchContestQuestions(contestId)
    } else {
      Message.error(response.data.msg || '获取比赛数据失败')
    }
  } catch (error) {
    console.error('获取比赛数据失败:', error)
    Message.error('获取比赛数据失败，请重试')
  } finally {
    loading.value = false
  }
}

// 获取比赛题目列表
const fetchContestQuestions = async (eventId) => {
  try {
    console.log('获取比赛题目列表，eventId:', eventId)
    
    const response = await getUserEventQList(eventId)
    console.log('题目列表响应:', response.data)
    
    if (response.data.code === 0) {
      // 转换后端数据格式为前端需要的格式
      challenges.value = response.data.data.map(item => ({
        id: item.questionId,
        name: item.question?.name || '未知题目',
        category: getCategoryFromQuestion(item.question),
        points: item.score,
        status: 'unsolved', // 默认状态，后续可以根据用户提交记录更新
        solvedCount: item.question?.challengecompleted || 0, // 使用后端返回的solvedCount
        attemptCount: 0, // 默认值
        description: item.question?.description || '暂无描述',
        hints: [], // 默认空数组
        attachments: getAttachmentsFromQuestion(item.question), // 处理附件
        tags: getTagsFromQuestion(item.question)
      }))
      
      // 更新分页总数
      pagination.value.total = challenges.value.length
    } else {
      console.warn('获取题目列表失败:', response.data.msg)
      challenges.value = []
    }
  } catch (error) {
    console.error('获取题目列表失败:', error)
    challenges.value = []
  }
}

// 根据题目信息获取分类
const getCategoryFromQuestion = (question) => {
  if (!question) return 'misc'
  
  // 优先使用后端返回的分类字段
  if (question.questionclassification) {
    const classificationMap = {
      1: 'web',      // Web安全
      2: 'crypto',   // 密码学
      3: 'crypto',   // 密码学 (数独、乐谱等)
      4: 'reverse',  // 逆向工程
      5: 'pwn',      // PWN
      6: 'misc'      // 杂项
    }
    return classificationMap[question.questionclassification] || 'misc'
  }
  
  // 如果没有分类字段，根据题目名称判断
  const name = question.name?.toLowerCase() || ''
  if (name.includes('web') || name.includes('注入') || name.includes('xss')) return 'web'
  if (name.includes('crypto') || name.includes('rsa') || name.includes('加密') || name.includes('数独') || name.includes('乐谱')) return 'crypto'
  if (name.includes('reverse') || name.includes('逆向')) return 'reverse'
  if (name.includes('pwn') || name.includes('溢出')) return 'pwn'
  return 'misc'
}

// 根据题目信息获取标签
const getTagsFromQuestion = (question) => {
  if (!question) return []
  
  const tags = []
  const name = question.name?.toLowerCase() || ''
  
  // 根据分类字段生成基础标签
  if (question.questionclassification) {
    const classificationTags = {
      1: ['Web安全'],
      2: ['密码学'],
      3: ['密码学', '隐写术'],
      4: ['逆向工程'],
      5: ['PWN'],
      6: ['杂项']
    }
    tags.push(...(classificationTags[question.questionclassification] || ['CTF']))
  }
  
  // 根据题目名称添加具体标签
  if (name.includes('web')) tags.push('Web安全')
  if (name.includes('注入')) tags.push('SQL注入')
  if (name.includes('xss')) tags.push('XSS')
  if (name.includes('crypto')) tags.push('密码学')
  if (name.includes('rsa')) tags.push('RSA')
  if (name.includes('reverse')) tags.push('逆向工程')
  if (name.includes('pwn')) tags.push('PWN')
  if (name.includes('溢出')) tags.push('缓冲区溢出')
  if (name.includes('数独')) tags.push('数独')
  if (name.includes('乐谱')) tags.push('乐谱')
  if (name.includes('隐写')) tags.push('隐写术')
  
  // 去重并返回
  return [...new Set(tags)].length > 0 ? [...new Set(tags)] : ['CTF']
}

// 根据题目信息获取附件
const getAttachmentsFromQuestion = (question) => {
  if (!question || !question.attachment) return []
  
  // 从附件路径中提取文件名
  const attachmentPath = question.attachment
  const fileName = attachmentPath.split('/').pop() || 'attachment.zip'
  
  return [{
    id: question.ID,
    name: fileName,
    url: attachmentPath // 这里可能需要拼接完整的URL
  }]
}

// 更新倒计时
const updateTimer = (endTime) => {
  const end = new Date(endTime).getTime()
  const now = new Date().getTime()
  const timeLeft = end - now
  
  if (timeLeft > 0) {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
    
    timeRemaining.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    timeRemaining.value = '00:00:00'
  }
}

// 定时器
let timer = null

// 组件挂载时启动定时器
onMounted(() => {
  fetchContestData() // 获取比赛数据
  calculateTimeRemaining() // 立即计算一次
  timer = setInterval(calculateTimeRemaining, 1000) // 每秒更新一次
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.contest-container {
  background: var(--color-bg-2);
  min-height: 100vh;
  padding: 20px;
}

/* 顶部导航 */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-left {
  flex: 1;
}

.back-btn {
  margin-bottom: 16px;
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

.contest-timer {
  text-align: center;
  margin-bottom: 16px;
}

.timer-label {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 8px;
}

.timer-display {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-6);
  background: var(--color-primary-light-1);
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid var(--color-primary-6);
}

.contest-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-2);
}

/* 筛选条件 */
.filters {
  margin-bottom: 16px;
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
}

.filter-section {
  margin-bottom: 24px;
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
  border-color: #1677ff !important;
  background: #e6f4ff !important;
  color: #0958d9 !important;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.15) !important;
}

.filter-option.active .option-icon,
.filter-option.active .option-text {
  color: #0958d9 !important;
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

/* 主要内容区域 */
.main-content {
  display: flex;
  gap: 24px;
}

.challenges-section {
  flex: 1;
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





.challenge-points {
  color: #f7ba2a;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.challenge-content {
  padding: 16px;
}

.challenge-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.challenge-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  line-height: 1.4;
  flex: 1;
  margin-right: 8px;
}

.challenge-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.category-tag-header {
  flex-shrink: 0;
}

.challenge-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 8px;
}

.challenge-solved,
.challenge-difficulty {
  display: flex;
  align-items: center;
  gap: 4px;
}

.challenge-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.challenge-tag {
  font-size: 10px;
  padding: 2px 6px;
  height: auto;
  line-height: 1.2;
}

/* 右侧信息面板 */
.info-panel {
  width: 320px;
  background: var(--color-bg-1);
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.panel-section {
  margin-bottom: 24px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.panel-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-btn {
  padding: 0;
  height: auto;
  font-size: 14px;
}

/* 比赛信息 */
.contest-info-list {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: var(--color-text-2);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}



.dynamics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dynamics-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.dynamics-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dynamic-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-2);
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
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

.coins-info {
  font-size: 12px;
  color: #faad14;
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

.empty-dynamics {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-3);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-dynamics p {
  margin: 0;
  font-size: 14px;
}

/* 题目详情弹窗 */
.challenge-detail-modal {
  padding: 20px 0;
}

.detail-content h4 {
  margin: 20px 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.detail-content h4:first-child {
  margin-top: 0;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-2);
  margin-bottom: 20px;
}



.attachments {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.submission-section {
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.submission-form {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.submission-form .arco-input {
  flex: 1;
}

/* 排行榜弹窗 */
.ranking-content {
  padding: 16px 0;
}

.rank-display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-medal {
  font-size: 20px;
}

.rank-number {
  font-weight: 600;
  color: var(--color-text-1);
}

.score-value {
  font-weight: 600;
  color: var(--color-primary-6);
}

.solved-count {
  color: var(--color-text-2);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
  
  .info-panel {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .contest-container {
    padding: 16px;
  }
  
  .header-row {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-right {
    margin-left: 0;
    align-items: flex-start;
  }
  
  .contest-stats {
    gap: 16px;
  }
  
  .filters {
    padding: 16px;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .submission-form {
    flex-direction: column;
  }
}
</style>
