<template>
  <div class="contest-container">
    <div class="header">
      <h1>赛事中心</h1>
      <p>参与精彩的CTF比赛，与全球顶尖选手同台竞技</p>
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
          :class="{ active: selectedCategory === 'emergency' }"
          @click="selectedCategory = 'emergency'"
        >
          <span class="option-icon">🚨</span>
          <span class="option-text">应急响应</span>
        </div>
        <div 
          class="filter-option"
          :class="{ active: selectedCategory === 'mixed' }"
          @click="selectedCategory = 'mixed'"
        >
          <span class="option-icon">🔄</span>
          <span class="option-text">混合模式</span>
        </div>
        <div 
          class="filter-option"
          :class="{ active: selectedCategory === 'theory' }"
          @click="selectedCategory = 'theory'"
        >
          <span class="option-icon">📚</span>
          <span class="option-text">理论赛</span>
        </div>
        <div 
          class="filter-option"
          :class="{ active: selectedCategory === 'solve' }"
          @click="selectedCategory = 'solve'"
        >
          <span class="option-icon">💻</span>
          <span class="option-text">解题赛</span>
        </div>
      </div>
    </div>

    <div class="tabs-wrapper">
      <a-tabs v-model:active-key="activeTab" @change="onTabChange">
        <a-tab-pane key="ongoing" title="进行中">
          <div class="contest-list">
            <a-row :gutter="[16, 16]">
              <a-col 
                v-for="contest in filteredOngoingContests" 
                :key="contest.id" 
                :span="12"
              >
                <contest-card :contest="contest" type="ongoing" />
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        
        <a-tab-pane key="upcoming" title="即将开始">
          <div class="contest-list">
            <a-row :gutter="[16, 16]">
              <a-col 
                v-for="contest in filteredUpcomingContests" 
                :key="contest.id" 
                :span="12"
              >
                <contest-card :contest="contest" type="upcoming" />
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        
        <a-tab-pane key="finished" title="已结束">
          <div class="contest-list">
            <a-row :gutter="[16, 16]">
              <a-col 
                v-for="contest in filteredFinishedContests" 
                :key="contest.id" 
                :span="12"
              >
                <contest-card :contest="contest" type="finished" />
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ContestCard from './components/ContestCard.vue'

const activeTab = ref('ongoing')
const selectedCategory = ref('')

// 分类筛选
const filterContests = (contests) => {
  if (!selectedCategory.value) {
    return contests
  }
  return contests.filter(contest => {
    return contest.contestType === selectedCategory.value
  })
}

// 过滤后的比赛列表
const filteredOngoingContests = computed(() => filterContests(ongoingContests.value))
const filteredUpcomingContests = computed(() => filterContests(upcomingContests.value))
const filteredFinishedContests = computed(() => filterContests(finishedContests.value))

// 进行中的比赛
const ongoingContests = ref([
  {
    id: 1,
    title: '全国大学生网络安全大赛',
    description: '面向全国大学生的综合性网络安全竞赛',
    startTime: '2024-01-15 09:00:00',
    endTime: '2024-01-17 18:00:00',
    participants: 1250,
    maxParticipants: 2000,
    prize: '总奖金池 50,000 元',
    organizer: '教育部网络安全教学指导委员会',
    difficulty: 'medium',
    categories: ['Web', '密码学', 'PWN', '逆向', '杂项'],
    contestType: 'mixed'
  },
  {
    id: 2,
    title: 'HackTheBox CTF 2024',
    description: '国际知名CTF平台举办的年度大赛',
    startTime: '2024-01-16 12:00:00',
    endTime: '2024-01-16 24:00:00',
    participants: 856,
    maxParticipants: 1000,
    prize: '$10,000 USD',
    organizer: 'HackTheBox',
    difficulty: 'hard',
    categories: ['Web', 'PWN', '逆向'],
    contestType: 'solve'
  }
])

// 即将开始的比赛
const upcomingContests = ref([
  {
    id: 3,
    title: '春季新生友谊赛',
    description: '专为CTF新手设计的友谊赛',
    startTime: '2024-01-20 14:00:00',
    endTime: '2024-01-21 18:00:00',
    participants: 0,
    maxParticipants: 500,
    prize: '证书 + 奖品',
    organizer: 'CTF学习社区',
    difficulty: 'easy',
    categories: ['Web', '密码学', '杂项'],
    contestType: 'theory'
  },
  {
    id: 4,
    title: '企业安全挑战赛',
    description: '真实企业环境下的安全挑战',
    startTime: '2024-01-25 09:00:00',
    endTime: '2024-01-27 18:00:00',
    participants: 0,
    maxParticipants: 300,
    prize: '实习机会 + 现金奖励',
    organizer: '腾讯安全',
    difficulty: 'hard',
    categories: ['Web', 'PWN', '移动安全'],
    contestType: 'emergency'
  }
])

// 已结束的比赛
const finishedContests = ref([
  {
    id: 5,
    title: '2023年末总决赛',
    description: '2023年度最高水平的CTF比赛',
    startTime: '2023-12-20 09:00:00',
    endTime: '2023-12-22 18:00:00',
    participants: 1500,
    maxParticipants: 1500,
    prize: '总奖金池 100,000 元',
    organizer: 'CTF联盟',
    difficulty: 'hard',
    categories: ['Web', '密码学', 'PWN', '逆向', '杂项', 'AI安全'],
    winner: 'Team Dragon',
    contestType: 'mixed'
  }
])

const onTabChange = (key) => {
  console.log('切换到标签:', key)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.contest-container {
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
</style>
