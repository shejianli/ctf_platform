<template>
  <div class="contest-card" @click="viewDetails">
    <div class="contest-image">
      <img 
        :src="'https://adworld.xctf.org.cn/media/picture/cover/b13dc2c4-fdf3-46fd-92d7-69f2748bfa53.png'" 
        :alt="contest.name"
        class="contest-cover"
      />
      <div class="contest-type-badge">
        {{ contest.eventType === 1 ? '个人赛' : '团队赛' }}
      </div>
      <div class="contest-status-badge" :class="type">
        {{ getStatusText() }}
      </div>
    </div>
    
    <div class="contest-content">
      <div class="contest-header">
        <h3 class="contest-title">{{ contest.name }}</h3>
        <div class="contest-status" :class="type">
          {{ getStatusText() }}
        </div>
      </div>
      
      <div class="contest-details">
        <div class="detail-item">
          <span class="detail-label">比赛时间：</span>
        </div>
        <div class="detail-item">
          <span class="detail-value">{{ formatStartTime() }} - {{ formatEndTime() }}</span>
        </div>
        
        <div class="detail-item">
          <span class="detail-label">报名时间：</span>
        </div>
        <div class="detail-item">
          <span class="detail-value">{{ formatRegistrationStartTime() }} - {{ formatRegistrationDeadline() }}</span>
        </div>
      </div>

      <div class="contest-actions">
        <a-button 
          v-if="type === 'ongoing'" 
          type="primary" 
          size="default"
          @click.stop="joinContest"
        >
          立即参加
        </a-button>
        
        <a-button 
          v-else-if="type === 'registering'" 
          type="outline" 
          size="default"
          @click.stop="registerContest"
        >
          报名参加
        </a-button>
        
        <a-button 
          v-else-if="type === 'finished'" 
          type="text" 
          size="default"
          @click.stop="viewResults"
        >
          查看结果
        </a-button>
        
        <a-button type="primary" size="default" @click.stop="viewDetails">
          赛事详情
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  contest: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['registering', 'ongoing', 'finished', 'unknown'].includes(value)
  }
})

const getStatusText = () => {
  const map = {
    registering: '报名中',
    ongoing: '进行中',
    finished: '已结束',
    unknown: '未知状态'
  }
  return map[props.type]
}

const formatStartTime = () => {
  const start = new Date(props.contest.competitionStartTime)
  return `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')} ${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`
}

const formatEndTime = () => {
  const end = new Date(props.contest.competitionDeadline)
  return `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')} ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
}

const formatRegistrationStartTime = () => {
  const start = new Date(props.contest.registrationStartTime)
  return `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')} ${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`
}

const formatRegistrationDeadline = () => {
  const deadline = new Date(props.contest.registrationDeadline)
  return `${deadline.getFullYear()}-${(deadline.getMonth() + 1).toString().padStart(2, '0')}-${deadline.getDate().toString().padStart(2, '0')} ${deadline.getHours().toString().padStart(2, '0')}:${deadline.getMinutes().toString().padStart(2, '0')}`
}

const joinContest = () => {
  console.log('参加比赛:', props.contest.ID)
}

const registerContest = () => {
  console.log('报名比赛:', props.contest.ID)
}

const viewResults = () => {
  console.log('查看结果:', props.contest.ID)
}

const viewDetails = () => {
  router.push(`/contest/detail/${props.contest.ID}`)
}
</script>

<style scoped>
.contest-card {
  display: flex;
  height: 240px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-bg-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.contest-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary-6);
}

.contest-image {
  width: 50%;
  height: 100%;
  position: relative;
  flex-shrink: 0;
}

.contest-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.contest-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
}

.contest-status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  z-index: 2;
}

.contest-status-badge.registering { background-color: #1890ff; }
.contest-status-badge.ongoing { background-color: #52c41a; }
.contest-status-badge.finished { background-color: #8c8c8c; }
.contest-status-badge.unknown { background-color: #d9d9d9; }

.contest-content {
  padding: 20px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contest-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.contest-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  line-height: 1.3;
  margin: 0;
  flex: 1;
  margin-right: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.contest-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  flex-shrink: 0;
}

.contest-status.registering { background-color: #1890ff; }
.contest-status.ongoing { background-color: #52c41a; }
.contest-status.finished { background-color: #8c8c8c; }
.contest-status.unknown { background-color: #d9d9d9; }

.contest-details {
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.4;
}

.detail-label {
  color: var(--color-text-3);
  min-width: 65px;
  flex-shrink: 0;
  font-weight: 500;
}

.detail-value {
  color: var(--color-text-2);
  flex: 1;
}

.contest-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}
</style>
