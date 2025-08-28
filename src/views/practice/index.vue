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
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-wrapper">
        <a-spin size="large" />
        <p>正在加载数据...</p>
      </div>

      <!-- 筛选条件 -->
      <div v-else class="filter-sections">
        <div class="filter-section">
          <span class="filter-label">题目分类</span>
          <a-tabs
            v-model:active-key="filters.category"
            size="small"
            @change="onCategoryChange"
            class="filter-tabs"
          >
            <a-tab-pane key="" title="全部"></a-tab-pane>
            <a-tab-pane
              v-for="category in questionClasses"
              :key="category.name"
              :title="category.name"
            ></a-tab-pane>
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
            <a-tab-pane
              v-for="level in difficultyLevels"
              :key="level.name"
              :title="level.name"
            ></a-tab-pane>
          </a-tabs>
        </div>




      </div>
    </div>


    <div class="practice-main">
      <div class="challenges-section">
        <div class="challenges-grid">
          <a-row :gutter="[12, 12]">
            <a-col
              v-for="challenge in challenges"
              :key="challenge.ID"
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
                    <h4 class="challenge-title">{{ challenge.name }}</h4>
                    <a-tag
                      :color="getCategoryColor(challenge.questionclassification)"
                      size="small"
                      class="category-tag-header"
                    >
                      {{ challenge.questionClass ? challenge.questionClass.name : getCategoryName(challenge.questionclassification) }}
                    </a-tag>
                  </div>

                  <div class="challenge-meta">
                    <span class="challenge-solved">
                      <icon-user />
                      {{ challenge.challengecompleted }}人
                    </span>
                    <span class="challenge-difficulty">
                      <icon-star />
                      {{ challenge.difficultyLevel ? challenge.difficultyLevel.name : getDifficultyName(challenge.level) }}
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
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
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
      :title="selectedChallenge ? selectedChallenge.name : '题目'"
      :width="680"
      :footer="false"
      unmount-on-close
      @close="onCloseChallenge"
    >
      <div v-if="selectedChallenge" class="challenge-modal">
        <div class="modal-header">
          <a-tag size="small">{{ selectedChallenge.questionClass ? selectedChallenge.questionClass.name : getCategoryName(selectedChallenge.questionclassification) }}</a-tag>
          <a-tag size="small" class="ml8" :color="getDifficultyColor(selectedChallenge.level)">
            {{ selectedChallenge.difficultyLevel ? selectedChallenge.difficultyLevel.name : getDifficultyName(selectedChallenge.level) }}
          </a-tag>
          <a-tag size="small" class="ml8" color="gold">
            <icon-coin />
            {{ selectedChallenge.coins_count }}金币
          </a-tag>
        </div>

        <div class="modal-body">
          <!-- 题目描述 -->
          <div class="challenge-info-section">
            <h4 class="section-title">题目描述</h4>
            <pre class="challenge-description">{{ selectedChallenge.description }}</pre>
          </div>



          <!-- 动态/静态 Flag 区分 -->
          <a-alert v-if="selectedChallenge.flagType === 1" type="warning" show-icon class="mb12">
            本题为动态 Flag，倒计时结束后实例将失效。
          </a-alert>
          <a-alert v-else type="info" show-icon class="mb12">
            本题为静态 Flag，请下载附件或阅读描述完成解题。
          </a-alert>

          <!-- 动态 Flag 靶机控制 -->
          <div v-if="selectedChallenge.flagType === 1" class="dynamic-flag-control">
            <div v-if="!isTargetStarted" class="start-target">
              <a-button type="primary" @click="startTarget" :loading="startingTarget">
                启动靶机
              </a-button>
              <p class="tip-text">点击启动靶机后开始计时，靶机将在30分钟后自动关闭</p>
            </div>

            <div v-else class="target-running">
              <div class="timer-info">
                <span>剩余时间：</span>
                <span class="time">{{ formatTime(remainingSec) }}</span>
              </div>

              <div class="progress-wrapper">
                <a-progress
                  :percent="progressPercent"
                  :show-text="false"
                  :stroke-color="progressColor"
                  size="small"
                />
                <span class="progress-text">{{ Math.ceil(remainingSec / 60) }}分钟</span>
              </div>

              <div class="target-actions">
                <a-button
                  size="small"
                  type="text"
                  @click="extendTarget"
                  :disabled="hasExtended"
                  v-if="!hasExtended"
                >
                  续期 (剩余1次)
                </a-button>
                <a-button size="small" type="text" @click="stopTarget">停止靶机</a-button>
              </div>
            </div>
          </div>

          <!-- 附件列表 -->
          <div v-if="selectedChallenge.attachment" class="attachments">
            <h5>附件下载</h5>
            <div class="attachment-list">
              <div class="attachment-item">
                <span class="file-name">{{ selectedChallenge.attachment }}</span>
                <a-button type="primary" size="small" @click="downloadAttachment(selectedChallenge.attachment)">下载</a-button>
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
import { getDifficultyLevels, getQuestionClasses, getQuestions } from '@/api/practice'

// 筛选条件
const filters = reactive({
  category: '',
  difficulty: '',
  search: ''
})

// 从后端获取的数据
const difficultyLevels = ref([])
const questionClasses = ref([])
const questions = ref([])
const loading = ref(false)

// 筛选条件变化处理函数
const onCategoryChange = async (key) => {
  filters.category = key
  resetPagination()
  await fetchQuestions()
}

const onDifficultyChange = async (key) => {
  filters.difficulty = key
  resetPagination()
  await fetchQuestions()
}





// 分页处理
const onPageChange = async (page) => {
  pagination.current = page
  await fetchQuestions()
}

const onPageSizeChange = async (pageSize) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  await fetchQuestions()
}

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0
})

// 题目数据（从后端获取）
const challenges = ref([])



// 获取分类名称
const getCategoryName = (categoryId) => {
  // 从后端数据中查找分类名称
  const foundCategory = questionClasses.value.find(cat => cat.ID === categoryId)
  if (foundCategory) {
    return foundCategory.name
  }
  return '未知分类'
}

// 获取难度名称
const getDifficultyName = (levelId) => {
  // 从后端数据中查找难度名称
  const foundDifficulty = difficultyLevels.value.find(level => level.ID === levelId)
  if (foundDifficulty) {
    return foundDifficulty.name
  }
  return '未知难度'
}



// 获取分类颜色
const getCategoryColor = (categoryId) => {
  // 根据分类ID返回不同的颜色
  const colorMap = {
    1: 'red',    // Web安全
    2: 'purple', // 逆向工程
    3: 'blue',   // 密码学
    4: 'green',  // Pwn
    5: 'orange'  // 其他分类
  }
  return colorMap[categoryId] || 'gray'
}

// 获取难度颜色
const getDifficultyColor = (levelId) => {
  // 根据难度ID返回不同的颜色
  const colorMap = {
    1: 'green',   // 入门/简单
    2: 'orange',  // 中等
    3: 'red'      // 困难
  }
  return colorMap[levelId] || 'gray'
}



// 重置分页
const resetPagination = () => {
  pagination.current = 1
}

// 触发搜索（按钮或回车）
const onSearch = async () => {
  resetPagination()
  await fetchQuestions()
}

// 弹窗相关
const isChallengeModalVisible = ref(false)
const selectedChallenge = ref(null)
const flagInput = ref('')
const remainingSec = ref(0)
const isTargetStarted = ref(false)
const startingTarget = ref(false)
const hasExtended = ref(false)
let countdownTimer = null

// 解题动态数据
const solvingDynamics = ref([
  {
    id: 1,
    userName: 'CTF大师',
    userAvatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    challengeName: 'SQL注入基础',
    type: 'first-blood',
    timestamp: Date.now() - 1000 * 60 * 5 // 5分钟前
  },
  {
    id: 2,
    userName: '安全小白',
    userAvatar: '',
    challengeName: 'XSS跨站脚本',
    type: 'solved',
    timestamp: Date.now() - 1000 * 60 * 15 // 15分钟前
  },
  {
    id: 3,
    userName: '逆向工程师',
    userAvatar: '',
    challengeName: '缓冲区溢出',
    type: 'attempted',
    timestamp: Date.now() - 1000 * 60 * 30 // 30分钟前
  },
  {
    id: 4,
    userName: 'Web安全专家',
    userAvatar: '',
    challengeName: 'XSS跨站脚本',
    type: 'solved',
    timestamp: Date.now() - 1000 * 60 * 45 // 45分钟前
  },
  {
    id: 5,
    userName: '密码学爱好者',
    userAvatar: '',
    challengeName: '缓冲区溢出',
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
    challengeName: challenges.value.length > 0 ? challenges.value[Math.floor(Math.random() * challenges.value.length)].name : '题目',
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
  isTargetStarted.value = false
  startingTarget.value = false
  hasExtended.value = false

  if (challenge.flagType === 1) {
    // 动态Flag，重置状态
    remainingSec.value = 0
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

// 进度条相关计算属性
const progressPercent = computed(() => {
  if (remainingSec.value <= 0) return 0
  return Math.round(((1800 - remainingSec.value) / 1800) * 100)
})

const progressColor = computed(() => {
  const percent = progressPercent.value
  if (percent < 50) return '#52c41a'
  if (percent < 80) return '#fa8c16'
  return '#f5222d'
})

// 靶机控制函数
const startTarget = async () => {
  startingTarget.value = true
  try {
    // TODO: 调用后端API启动靶机
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用

    isTargetStarted.value = true
    remainingSec.value = 1800 // 30分钟
    startTimer()
  } catch (error) {
    console.error('启动靶机失败:', error)
  } finally {
    startingTarget.value = false
  }
}

const extendTarget = async () => {
  try {
    // TODO: 调用后端API续期靶机
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API调用

    remainingSec.value = 1800 // 续期30分钟
    hasExtended.value = true
    startTimer()
  } catch (error) {
    console.error('续期靶机失败:', error)
  }
}

const stopTarget = async () => {
  try {
    // TODO: 调用后端API停止靶机
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API调用

    isTargetStarted.value = false
    stopTimer()
    remainingSec.value = 0
  } catch (error) {
    console.error('停止靶机失败:', error)
  }
}

const resetTimer = () => {
  if (selectedChallenge.value && selectedChallenge.value.flagType === 1) {
    remainingSec.value = 1800
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

const downloadAttachment = (attachment) => {
  // 构建下载链接
  const downloadUrl = `http://192.168.1.18:8888/uploads/${attachment}`
  window.open(downloadUrl, '_blank')
}

const submitFlag = () => {
  console.log('提交 Flag:', flagInput.value)
  // TODO: 接口提交校验
}

// 获取难度等级数据
const fetchDifficultyLevels = async () => {
  try {
    loading.value = true
    const response = await getDifficultyLevels({
      page: 1,
      pageSize: 100
    })
    if (response.data && response.data.code === 0) {
      difficultyLevels.value = response.data.data.list || []
    }
  } catch (error) {
    console.error('获取难度等级失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取题目分类数据
const fetchQuestionClasses = async () => {
  try {
    loading.value = true
    const response = await getQuestionClasses({
      page: 1,
      pageSize: 100
    })
    if (response.data && response.data.code === 0) {
      questionClasses.value = response.data.data.list || []
    }
  } catch (error) {
    console.error('获取题目分类失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取题目数据
const fetchQuestions = async () => {
  try {
    loading.value = true

    // 构建请求参数
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize
    }

    // 添加搜索参数
    if (filters.search) {
      params.name = filters.search
    }

    // 添加分类筛选
    if (filters.category) {
      const selectedCategory = questionClasses.value.find(cat => cat.name === filters.category)
      if (selectedCategory) {
        params.questionclassification = selectedCategory.ID
      }
    }

    // 添加难度筛选
    if (filters.difficulty) {
      const selectedDifficulty = difficultyLevels.value.find(level => level.name === filters.difficulty)
      if (selectedDifficulty) {
        params.level = selectedDifficulty.ID
      }
    }

    const response = await getQuestions(params)
    if (response.data && response.data.code === 0) {
      challenges.value = response.data.data.list || []
      pagination.total = response.data.data.total || 0
    }
  } catch (error) {
    console.error('获取题目数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 获取后端数据
  await Promise.all([
    fetchDifficultyLevels(),
    fetchQuestionClasses(),
    fetchQuestions()
  ])
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
  /*-webkit-line-clamp: 10;*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.challenge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.challenge-difficulty {
  flex-shrink: 0;
}



.challenge-card :deep(.arco-card-actions) {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
}

.challenge-points,
.challenge-solved,
.challenge-difficulty {
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

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-wrapper p {
  margin-top: 16px;
  color: var(--color-text-3);
  font-size: 14px;
}

.challenge-info-section {
  margin-bottom: 20px;
  margin-top: 20px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
}

.challenge-description {
  color: var(--color-text-2);
  line-height: 1.5;
  margin: 0;
  font-size: 13px;
}

.challenge-tip {
  color: var(--color-text-2);
  line-height: 1.5;
  margin: 0;
  padding: 10px;
  background: var(--color-fill-2);
  border-radius: 6px;
  border-left: 3px solid var(--color-primary-6);
  font-size: 13px;
}

.dynamic-flag-control {
  margin: 16px 0;
}

.start-target {
  text-align: center;
  padding: 20px;
  background: var(--color-fill-1);
  border-radius: 8px;
}

.tip-text {
  margin: 12px 0 0 0;
  font-size: 12px;
  color: var(--color-text-3);
}

.target-running {
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
}

.timer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.timer-info .time {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 600;
  color: #0958d9;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-wrapper :deep(.arco-progress) {
  flex: 1;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-3);
  min-width: 50px;
}

.target-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
