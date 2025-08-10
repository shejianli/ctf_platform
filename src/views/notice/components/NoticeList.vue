<template>
  <div class="notice-list">
    <div 
      v-for="notice in notices" 
      :key="notice.id"
      class="notice-item"
      :class="{ 'unread': !notice.isRead, 'top': notice.isTop }"
      @click="openNotice(notice)"
    >
      <div class="notice-header">
        <div class="notice-title-row">
          <a-tag v-if="notice.isTop" color="red" size="small">置顶</a-tag>
          <a-tag 
            :color="getTypeColor(notice.type)" 
            size="small"
          >
            {{ getTypeText(notice.type) }}
          </a-tag>
          <h3 class="notice-title">{{ notice.title }}</h3>
          <div v-if="!notice.isRead" class="unread-dot"></div>
        </div>
        
        <div class="notice-meta">
          <span class="publish-time">
            <icon-clock-circle />
            {{ formatTime(notice.publishTime) }}
          </span>
          <span class="read-count">
            <icon-eye />
            {{ notice.readCount }} 次阅读
          </span>
        </div>
      </div>
      
      <div class="notice-content">
        <p>{{ notice.content }}</p>
      </div>
      
      <div class="notice-actions">
        <a-button type="text" size="small" @click.stop="markAsRead(notice)">
          {{ notice.isRead ? '已读' : '标记为已读' }}
        </a-button>
        <a-button type="text" size="small" @click.stop="shareNotice(notice)">
          分享
        </a-button>
      </div>
    </div>
    
    <div v-if="notices.length === 0" class="empty-state">
      <a-empty description="暂无通知" />
    </div>
  </div>
</template>

<script setup>
import { IconClockCircle, IconEye } from '@arco-design/web-vue/es/icon'

const props = defineProps({
  notices: {
    type: Array,
    default: () => []
  }
})

const getTypeColor = (type) => {
  const colorMap = {
    important: 'red',
    contest: 'blue',
    normal: 'gray'
  }
  return colorMap[type] || 'gray'
}

const getTypeText = (type) => {
  const textMap = {
    important: '重要',
    contest: '比赛',
    normal: '普通'
  }
  return textMap[type] || '普通'
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

const openNotice = (notice) => {
  console.log('打开通知:', notice)
  // TODO: 打开通知详情
}

const markAsRead = (notice) => {
  notice.isRead = true
  console.log('标记为已读:', notice.id)
}

const shareNotice = (notice) => {
  console.log('分享通知:', notice.id)
  // TODO: 分享功能
}
</script>

<style scoped>
.notice-list {
  padding: 20px 0;
}

.notice-item {
  background: var(--color-bg-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.notice-item:hover {
  border-color: var(--color-primary-6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notice-item.unread {
  border-left: 4px solid var(--color-primary-6);
}

.notice-item.top {
  background: linear-gradient(135deg, var(--color-warning-light-1), var(--color-bg-2));
}

.notice-header {
  margin-bottom: 12px;
}

.notice-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
  flex: 1;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-danger-6);
  border-radius: 50%;
  margin-left: auto;
}

.notice-meta {
  display: flex;
  gap: 16px;
  color: var(--color-text-3);
  font-size: 12px;
}

.publish-time,
.read-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.notice-content {
  margin-bottom: 16px;
}

.notice-content p {
  color: var(--color-text-2);
  line-height: 1.6;
  margin: 0;
}

.notice-actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}
</style>
