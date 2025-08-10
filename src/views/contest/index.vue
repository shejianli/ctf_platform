<template>
  <div class="contest-container">
    <div class="header">
      <h1>赛事中心</h1>
      <p>参与精彩的CTF比赛，与全球顶尖选手同台竞技</p>
    </div>

    <div class="tabs-wrapper">
      <a-tabs v-model:active-key="activeTab" @change="onTabChange">
        <a-tab-pane key="ongoing" title="进行中">
          <div class="contest-list">
            <a-row :gutter="[16, 16]">
              <a-col 
                v-for="contest in ongoingContests" 
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
                v-for="contest in upcomingContests" 
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
                v-for="contest in finishedContests" 
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
import { ref, onMounted } from 'vue'
import ContestCard from './components/ContestCard.vue'

const activeTab = ref('ongoing')

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
    categories: ['Web', '密码学', 'PWN', '逆向', '杂项']
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
    categories: ['Web', 'PWN', '逆向']
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
    categories: ['Web', '密码学', '杂项']
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
    categories: ['Web', 'PWN', '移动安全']
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
    winner: 'Team Dragon'
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

.tabs-wrapper {
  margin-top: 20px;
}

.contest-list {
  padding: 20px 0;
}
</style>
