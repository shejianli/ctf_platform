<template>
  <a-card class="contest-card" hoverable>
    <template #cover>
      <div class="contest-cover" :class="contest.difficulty">
        <div class="status-badge" :class="type">
          {{ getStatusText() }}
        </div>
        <div class="difficulty-badge" :class="contest.difficulty">
          {{ getDifficultyText() }}
        </div>
      </div>
    </template>

    <div class="contest-content">
      <h3 class="contest-title">{{ contest.title }}</h3>
      <p class="contest-description">{{ contest.description }}</p>
      
      <div class="contest-info">
        <div class="info-item">
          <icon-clock-circle />
          <span>{{ formatTimeRange() }}</span>
        </div>
        
        <div class="info-item">
          <icon-user-group />
          <span>{{ contest.participants }}/{{ contest.maxParticipants }} 人</span>
        </div>
        
        <div class="info-item">
          <icon-trophy />
          <span>{{ contest.prize }}</span>
        </div>
        
        <div class="info-item">
          <icon-user />
          <span>{{ contest.organizer }}</span>
        </div>
      </div>

      <div class="contest-categories">
        <a-tag 
          v-for="category in contest.categories" 
          :key="category"
          :color="getCategoryColor(category)"
          size="small"
        >
          {{ category }}
        </a-tag>
      </div>

      <div v-if="type === 'finished' && contest.winner" class="winner-info">
        <icon-trophy />
        <span>冠军：{{ contest.winner }}</span>
      </div>
    </div>

    <template #actions>
      <a-button 
        v-if="type === 'ongoing'" 
        type="primary" 
        @click="joinContest"
      >
        立即参加
      </a-button>
      
      <a-button 
        v-else-if="type === 'upcoming'" 
        type="outline" 
        @click="registerContest"
      >
        报名参加
      </a-button>
      
      <a-button 
        v-else 
        type="text" 
        @click="viewResults"
      >
        查看结果
      </a-button>
      
      <a-button type="text" @click="viewDetails">
        查看详情
      </a-button>
    </template>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import { 
  IconClockCircle, 
  IconUserGroup, 
  IconTrophy, 
  IconUser
} from '@arco-design/web-vue/es/icon'

const props = defineProps({
  contest: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['ongoing', 'upcoming', 'finished'].includes(value)
  }
})

const getStatusText = () => {
  const map = {
    ongoing: '进行中',
    upcoming: '即将开始',
    finished: '已结束'
  }
  return map[props.type]
}

const getDifficultyText = () => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[props.contest.difficulty]
}

const formatTimeRange = () => {
  const start = new Date(props.contest.startTime)
  const end = new Date(props.contest.endTime)
  
  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
}

const getCategoryColor = (category) => {
  const colorMap = {
    'Web': 'red',
    '密码学': 'blue',
    'PWN': 'green',
    '逆向': 'purple',
    '杂项': 'orange',
    'AI安全': 'cyan',
    '移动安全': 'magenta'
  }
  return colorMap[category] || 'gray'
}

const joinContest = () => {
  console.log('参加比赛:', props.contest.id)
}

const registerContest = () => {
  console.log('报名比赛:', props.contest.id)
}

const viewResults = () => {
  console.log('查看结果:', props.contest.id)
}

const viewDetails = () => {
  console.log('查看详情:', props.contest.id)
}
</script>

<style scoped>
.contest-card {
  height: 100%;
}

.contest-cover {
  height: 120px;
  background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-6));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contest-cover.easy {
  background: linear-gradient(135deg, #7bed9f, #2ed573);
}

.contest-cover.medium {
  background: linear-gradient(135deg, #ffa726, #ff9800);
}

.contest-cover.hard {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
}

.status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.status-badge.ongoing {
  background-color: #52c41a;
  animation: pulse 2s infinite;
}

.status-badge.upcoming {
  background-color: #1890ff;
}

.status-badge.finished {
  background-color: #8c8c8c;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.difficulty-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}

.contest-content {
  padding: 16px 0;
}

.contest-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text-1);
}

.contest-description {
  color: var(--color-text-3);
  margin-bottom: 16px;
  line-height: 1.5;
}

.contest-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  color: var(--color-text-2);
  font-size: 14px;
}

.contest-categories {
  margin-bottom: 12px;
}

.contest-categories .arco-tag {
  margin-right: 6px;
  margin-bottom: 4px;
}

.winner-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-warning-6);
  font-weight: 500;
  font-size: 14px;
}

.contest-card :deep(.arco-card-actions) {
  padding: 12px 16px;
  display: flex;
  gap: 8px;
}
</style>
