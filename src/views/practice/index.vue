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
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-wrapper">
          <a-spin size="large" />
          <p>正在加载数据...</p>
        </div>

        <div class="challenges-grid" v-else>
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
        <!-- 运行中的靶机 -->
        <div v-if="currentTarget" class="running-target-card" @click="openTargetChallenge">
          <div class="target-card-header">
            <a-tag color="green" size="small">
              <icon-trophy />
              靶机运行中
            </a-tag>
            <span class="target-time">{{ formatTime(remainingSec) }}</span>
          </div>
          <div class="target-card-content">
            <div class="target-title">{{ currentTarget.question?.name || '未知题目' }}</div>
            <div class="target-url" v-if="targetUrls.length > 0">
              {{ targetUrls[0] }}
            </div>
          </div>
        </div>

        <div class="dynamics-header">
          <h3>🔥 解题动态</h3>
          <a-button type="text" size="small" @click="refreshDynamics">
            <icon-refresh />
          </a-button>
        </div>

        <a-spin :loading="dynamicsLoading" tip="加载中...">
          <div class="dynamics-list">
            <!-- 有数据时显示动态列表 -->
            <div
              v-if="solvingDynamics.length > 0"
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
                  <span v-if="dynamic.coinsNumber > 0" class="coins-info">
                    <icon-coin style="color: #faad14; margin-left: 4px;" />
                    +{{ dynamic.coinsNumber }}
                  </span>
                </div>
                <div class="dynamic-time">{{ formatTimeAgo(dynamic.timestamp) }}</div>
              </div>
              <div class="dynamic-badge" :class="dynamic.type">
                <icon-trophy v-if="dynamic.type === 'solved' || dynamic.type === 'first-blood'" />
                <icon-clock-circle v-else />
              </div>
            </div>

            <!-- 没有数据时显示空状态 -->
            <div v-else-if="!dynamicsLoading" class="empty-dynamics">
              <div class="empty-icon">📝</div>
              <div class="empty-text">暂无解题动态</div>
              <div class="empty-subtext">快来挑战第一道题目吧！</div>
            </div>
          </div>
        </a-spin>


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

          <!-- 已启动的靶机信息 -->
          <div v-if="isTargetStarted" class="active-target-info">
            <div class="active-target-header">
              <a-tag color="green" size="small">
                <icon-trophy />
                靶机运行中
              </a-tag>
              <span class="target-title">{{ selectedChallenge.name }}</span>
            </div>
            
            <div class="active-target-details">
              <div class="timer-info">
                <span>剩余时间：</span>
                <span class="time">{{ formatTime(remainingSec) }}</span>
              </div>
              
              <div v-if="targetUrls.length > 0" class="target-url-info">
                <div class="url-label">靶机访问地址：</div>
                <div
                  v-for="(url, index) in targetUrls"
                  :key="index"
                  class="url-item"
                >
                  <a
                    :href="url"
                    target="_blank"
                    class="target-link"
                  >
                    {{ url }}
                  </a>
                </div>
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

          <!-- 动态 Flag 靶机控制 -->
          <div v-if="selectedChallenge.flagType === 1" class="dynamic-flag-control">
            <div v-if="!isTargetStarted" class="start-target">
              <a-button type="primary" @click="startTarget" :loading="startingTarget">
                启动靶机
              </a-button>
              <p class="tip-text">点击启动靶机后开始计时，靶机将在30分钟后自动关闭</p>
            </div>

          </div>

          <!-- 启动中状态 - 显示进度条 -->
          <div v-if="startingTarget" class="target-starting">
            <div class="timer-info">
              <span>剩余时间：</span>
              <span class="time">{{ formatTime(remainingSec) }}</span>
            </div>


            <div class="starting-text">
              <a-spin size="small" />
              <span>正在启动靶机...</span>
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
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconTrophy, IconUser, IconRefresh, IconClockCircle } from '@arco-design/web-vue/es/icon'
import { getDifficultyLevels, getQuestionClasses, getQuestions, getTopicSuccessfully } from '@/api/practice'
import { startTarget as startTargetAPI, getUserBootRecordList } from '@/api/question'

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
const targetUrls = ref([])
const isTargetStarted = ref(false)
const startingTarget = ref(false)
const hasExtended = ref(false)
const currentTarget = ref(null) // 当前运行的靶机信息
let countdownTimer = null

// 解题动态数据
const solvingDynamics = ref([])
const dynamicsLoading = ref(false)

// 获取解题动态
const fetchSolvingDynamics = async () => {
  try {
    dynamicsLoading.value = true
    const response = await getTopicSuccessfully({
      page: 1,
      pageSize: 10
    })

    if (response.data.code === 0) {
      const dynamicsList = response.data.data.list || []

      // 映射解题动态数据
      solvingDynamics.value = dynamicsList.map(dynamic => ({
        id: dynamic.ID,
        userName: dynamic.userModel?.nickName || dynamic.userModel?.username || '未知用户',
        userAvatar: dynamic.userModel?.avatar || '',
        challengeName: dynamic.titleModel?.name || '未知题目',
        type: dynamic.firstSuccess ? 'first-blood' : 'solved',
        timestamp: new Date(dynamic.CreatedAt).getTime(),
        coinsNumber: dynamic.coinsNumber || 0
      }))
    } else {
      console.error('获取解题动态失败:', response.data.msg)
    }
  } catch (error) {
    console.error('获取解题动态失败:', error)
  } finally {
    dynamicsLoading.value = false
  }
}

// 刷新解题动态
const refreshDynamics = () => {
  fetchSolvingDynamics()
}

// 获取用户靶机状态
const getTargetStatus = async () => {
  try {
    const response = await getUserBootRecordList()
    if (response.data.code === 0) {
      const records = response.data.data.list || []
      // 查找正在运行的靶机 (targetStatus === 1 表示运行中)
      const runningTarget = records.find(record => record.targetStatus === 1)
      if (runningTarget) {
        currentTarget.value = runningTarget
        isTargetStarted.value = true
        // 计算剩余时间
        const startTime = new Date(runningTarget.startupTime).getTime()
        const now = Date.now()
        const elapsed = Math.floor((now - startTime) / 1000)
        const totalTime = 1800 // 30分钟
        remainingSec.value = Math.max(0, totalTime - elapsed)
        
        
        // 如果剩余时间大于0，启动计时器
        if (remainingSec.value > 0) {
          startTimer()
        } else {
          // 如果时间已用完，停止靶机
          console.log('靶机时间已用完，停止靶机')
          currentTarget.value = null
          isTargetStarted.value = false
        }
        
        // 设置靶机地址 (这里需要根据实际API调整)
        // 暂时设置为空，等后端提供expose字段
        targetUrls.value = []
      } else {
        currentTarget.value = null
        isTargetStarted.value = false
        remainingSec.value = 0
        targetUrls.value = []
      }
    }
  } catch (error) {
    console.error('获取靶机状态失败:', error)
  }
}

// 点击靶机卡片打开题目详情
const openTargetChallenge = () => {
  if (currentTarget.value && currentTarget.value.titleId) {
    // 根据靶机信息找到对应的题目
    const challenge = challenges.value.find(c => c.ID === currentTarget.value.titleId)
    if (challenge) {
      openChallenge(challenge)
    }
  }
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

  // 如果打开的是当前运行的靶机，不要重置状态
  const isCurrentTarget = currentTarget.value && currentTarget.value.titleId === challenge.ID
  
  if (!isCurrentTarget) {
    // 只有打开其他题目时才重置状态
    stopTimer()
    isTargetStarted.value = false
    startingTarget.value = false
    hasExtended.value = false
    remainingSec.value = 0
  }
}

const onCloseChallenge = () => {
  isChallengeModalVisible.value = false
  
  // 如果关闭的是当前运行的靶机，不要停止计时器
  const isCurrentTarget = currentTarget.value && selectedChallenge.value && 
    currentTarget.value.titleId === selectedChallenge.value.ID
  
  if (!isCurrentTarget) {
    stopTimer()
  }
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


// 靶机控制函数
const startTarget = async () => {
  startingTarget.value = true

  // 立即开始计时和进度条
  remainingSec.value = 1800 // 30分钟
  startTimer()

  try {
    // 检查选中的题目
    if (!selectedChallenge.value) {
      Message.error('请先选择题目')
      return
    }

    console.log('选中的题目信息:', selectedChallenge.value) // 调试日志

    // 调用后端API启动靶机
    const requestData = {
      questionId: selectedChallenge.value.ID
    }
    console.log('启动靶机请求参数:', requestData) // 调试日志

    const response = await startTargetAPI(requestData)

    console.log('启动靶机响应:', response.data) // 调试日志

    if (response.data.code === 0) {
      isTargetStarted.value = true

      // 保存靶机访问地址
      if (response.data.data && response.data.data.expose && response.data.data.expose.length > 0) {
        targetUrls.value = response.data.data.expose
        console.log('靶机访问地址列表:', targetUrls.value)
      }

      Message.success('靶机启动成功！')
    } else {
      Message.error(response.data.msg || '启动靶机失败')
      // 启动失败时停止计时
      stopTimer()
      remainingSec.value = 0
    }
  } catch (error) {
    console.error('启动靶机失败:', error)
    Message.error('启动靶机失败，请重试')
    // 启动失败时停止计时
    stopTimer()
    remainingSec.value = 0
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
      pageSize: 100,
      category: 'ctf'
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
    fetchQuestions(),
    fetchSolvingDynamics(),
    getTargetStatus()
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

.empty-dynamics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 8px;
  font-weight: 500;
}

.empty-subtext {
  font-size: 12px;
  color: var(--color-text-3);
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
  margin-bottom: 16px;
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

.target-starting {
  padding: 16px;
  background: var(--color-fill-1);
  border-radius: 8px;
  border: 1px solid var(--color-border-2);
}

.starting-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: var(--color-text-2);
  font-size: 13px;
}

.target-url-info {
  margin-top: 16px;
  padding: 12px;
  background: var(--color-bg-1);
  border-radius: 6px;
  border: 1px solid var(--color-border-2);
}

.url-label {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 8px;
  font-weight: 500;
}

.url-item {
  margin-bottom: 8px;
}

.url-item:last-child {
  margin-bottom: 0;
}

.target-link {
  display: block;
  padding: 8px 12px;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border-2);
  border-radius: 6px;
  color: var(--color-link-6);
  text-decoration: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  word-break: break-all;
  transition: all 0.2s ease;
}

.target-link:hover {
  background: var(--color-fill-3);
  border-color: var(--color-link-6);
  color: var(--color-link-5);
  text-decoration: none;
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


.active-target-info {
  margin: 16px 0;
  padding: 16px;
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
  border: 1px solid #52c41a;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.1);
}

.active-target-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9f7be;
}

.target-title {
  font-weight: 600;
  color: var(--color-text-1);
  font-size: 14px;
}

.active-target-details {
  padding-left: 4px;
}

.target-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}

/* 运行中靶机卡片样式 */
.running-target-card {
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
  border: 1px solid #52c41a;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.1);
}

.running-target-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.2);
  border-color: #389e0d;
}

.target-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.target-time {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 600;
  color: #0958d9;
  font-size: 13px;
}

.target-card-content {
  padding-left: 4px;
}

.target-card-content .target-title {
  font-weight: 600;
  color: var(--color-text-1);
  font-size: 14px;
  margin-bottom: 4px;
}

.target-url {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: var(--color-text-3);
  background: var(--color-fill-2);
  padding: 4px 8px;
  border-radius: 4px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
