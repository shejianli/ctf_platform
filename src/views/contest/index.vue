<template>
  <div class="contest-container">
    <div class="header">
      <div class="header-left">
      <h1>赛事中心</h1>
      <p>参与精彩的CTF比赛，与全球顶尖选手同台竞技</p>
      </div>
      <div class="header-right">
        <a-button type="outline" @click="refreshContests" :loading="loading">
          <icon-refresh />
          刷新
        </a-button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="category-filters">
      <div class="filter-options">
        <div 
          class="filter-option"
          :class="{ active: selectedCategory === '' }"
          @click="selectedCategory = ''"
        >
          <span class="option-icon">🏆</span>
          <span class="option-text">全部</span>
        </div>
        <div 
          class="filter-option"
          :class="{ active: selectedCategory === 1 }"
          @click="selectedCategory = 1"
        >
          <span class="option-icon">👤</span>
          <span class="option-text">个人赛</span>
        </div>
        <div 
          class="filter-option"
          :class="{ active: selectedCategory === 2 }"
          @click="selectedCategory = 2"
        >
          <span class="option-icon">👥</span>
          <span class="option-text">团队赛</span>
        </div>
      </div>
    </div>

    <div class="tabs-wrapper">
      <a-tabs v-model:active-key="activeTab" @change="onTabChange">
        <a-tab-pane key="all" title="全部">
          <div class="contest-list">
            <a-spin :spinning="loading" tip="加载中...">
              <div v-if="!loading && filteredAllContests.length === 0" class="empty-state">
                <div class="empty-icon">🏆</div>
                <div class="empty-text">暂无赛事</div>
                <div class="empty-subtext">敬请期待更多精彩赛事</div>
              </div>
              <div v-else class="contest-list-container">
                <div 
                  v-for="contest in filteredAllContests" 
                  :key="contest.ID" 
                  class="contest-list-item"
                >
                  <contest-card :contest="contest" :type="getContestType(contest)" />
                </div>
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
        
        
        <a-tab-pane key="2" title="报名中">
          <div class="contest-list">
            <a-spin :spinning="loading" tip="加载中...">
              <div v-if="!loading && filteredStatusContests(2).length === 0" class="empty-state">
                <div class="empty-icon">📝</div>
                <div class="empty-text">暂无报名中的赛事</div>
                <div class="empty-subtext">敬请期待更多精彩赛事</div>
              </div>
              <div v-else class="contest-list-container">
                <div 
                  v-for="contest in filteredStatusContests(2)" 
                  :key="contest.ID" 
                  class="contest-list-item"
                >
                  <contest-card :contest="contest" :type="getContestType(contest)" />
                </div>
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
        
        <a-tab-pane key="3" title="进行中">
          <div class="contest-list">
            <a-spin :spinning="loading" tip="加载中...">
              <div v-if="!loading && filteredStatusContests(3).length === 0" class="empty-state">
                <div class="empty-icon">🚀</div>
                <div class="empty-text">暂无进行中的赛事</div>
                <div class="empty-subtext">敬请期待更多精彩赛事</div>
              </div>
              <div v-else class="contest-list-container">
                <div 
                  v-for="contest in filteredStatusContests(3)" 
                  :key="contest.ID" 
                  class="contest-list-item"
                >
                  <contest-card :contest="contest" :type="getContestType(contest)" />
                </div>
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
        
        <a-tab-pane key="4" title="已结束">
          <div class="contest-list">
            <a-spin :spinning="loading" tip="加载中...">
              <div v-if="!loading && filteredStatusContests(4).length === 0" class="empty-state">
                <div class="empty-icon">🏁</div>
                <div class="empty-text">暂无已结束的赛事</div>
                <div class="empty-subtext">敬请期待更多精彩赛事</div>
              </div>
              <div v-else class="contest-list-container">
                <div 
                  v-for="contest in filteredStatusContests(4)" 
                  :key="contest.ID" 
                  class="contest-list-item"
                >
                  <contest-card :contest="contest" :type="getContestType(contest)" />
                </div>
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
        
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ContestCard from './components/ContestCard.vue'
import { getEventCPublic } from '@/api/contest'
import { IconRefresh } from '@arco-design/web-vue/es/icon'

const activeTab = ref('all')
const selectedCategory = ref('')
const loading = ref(false)
const contests = ref([])

// 分类筛选
const filterContests = (contests) => {
  if (!selectedCategory.value) {
    return contests
  }
  return contests.filter(contest => {
    return contest.eventType === selectedCategory.value
  })
}

// 根据状态过滤比赛
const getContestsByStatus = (status) => {
  if (status === 'all') {
    return contests.value
  }
  return contests.value.filter(contest => contest.status === parseInt(status))
}

// 过滤后的比赛列表
const filteredAllContests = computed(() => filterContests(getContestsByStatus('all')))
const filteredStatusContests = (status) => filterContests(getContestsByStatus(status))

// 获取赛事数据
const fetchContests = async () => {
  try {
    loading.value = true
    const response = await getEventCPublic({
      page: 1,
      pageSize: 100
    })
    
    if (response.data.code === 0) {
      contests.value = response.data.data.list || []
    } else {
      console.error('获取赛事数据失败:', response.data.msg)
    }
  } catch (error) {
    console.error('获取赛事数据失败:', error)
  } finally {
    loading.value = false
  }
}

const onTabChange = (key) => {
  console.log('切换到标签:', key)
}

const refreshContests = () => {
  fetchContests()
}

// 根据赛事状态确定显示类型
const getContestType = (contest) => {
  switch (contest.status) {
    case 1:
      return 'registering' // 报名中
    case 2:
      return 'ongoing' // 进行中
    case 3:
      return 'finished' // 已结束
    default:
      return 'unknown'
  }
}

onMounted(() => {
  // 获取赛事数据
  fetchContests()
})
</script>

<style scoped>
.contest-container {
  padding: 20px 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
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

.category-filters {
  margin-bottom: 24px;
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
}

.filter-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--color-bg-1);
  user-select: none;
  color: var(--color-text-2);
}

.filter-option:hover {
  border-color: var(--color-primary-6);
  background: var(--color-primary-light-1);
  transform: translateY(-1px);
}

.filter-option.active {
  border-color: #1677ff;
  background: #e6f4ff;
  color: #0958d9;
}

.option-icon {
  font-size: 16px;
}

.option-text {
  font-size: 14px;
  font-weight: 500;
}

.tabs-wrapper {
  margin-top: 20px;
}

.contest-list {
  padding: 20px 0;
}

/* 2列网格布局 */
.contest-list-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.contest-list-item {
  width: 100%;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .contest-container {
    padding: 16px;
  }
  
  .contest-list-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .header {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-right {
    margin-left: 0;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-2);
  margin-bottom: 8px;
  font-weight: 500;
}

.empty-subtext {
  font-size: 14px;
  color: var(--color-text-3);
}
</style>
