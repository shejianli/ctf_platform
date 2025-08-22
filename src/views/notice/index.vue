<template>
  <div class="notice-container">
    <div class="notice-header">
      <div class="header-left">
        <a-button type="text" @click="goBack" class="back-btn">
          <icon-left />
          返回
        </a-button>
        <h1>📢 通知中心</h1>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="markAllAsRead">
          <icon-check />
          全部已读
        </a-button>
      </div>
    </div>

    <div class="notice-content">
      <!-- 通知筛选 -->
      <div class="notice-filters">
        <div class="filter-group">
          <a-radio-group v-model="filterType" @change="onFilterChange">
            <a-radio value="">全部</a-radio>
            <a-radio value="contest">赛事通知</a-radio>
            <a-radio value="system">系统通知</a-radio>
            <a-radio value="user">用户通知</a-radio>
          </a-radio-group>
        </div>
        
        <div class="filter-group">
          <a-radio-group v-model="filterStatus" @change="onFilterChange">
            <a-radio value="">全部状态</a-radio>
            <a-radio value="unread">未读</a-radio>
            <a-radio value="read">已读</a-radio>
          </a-radio-group>
        </div>
      </div>

      <!-- 通知列表 -->
      <div class="notice-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          class="notice-item"
          :class="{ unread: !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notice-icon">
            <icon-trophy v-if="notification.type === 'contest'" />
            <icon-fire v-else-if="notification.type === 'system'" />
            <icon-user v-else />
          </div>
          
          <div class="notice-content">
            <div class="notice-header-row">
              <div class="notice-title">{{ notification.title }}</div>
              <div class="notice-meta">
                <a-tag :color="getTypeColor(notification.type)" size="small">
                  {{ getTypeText(notification.type) }}
                </a-tag>
                <span class="notice-time">{{ formatTimeAgo(notification.timestamp) }}</span>
              </div>
            </div>
            
            <div class="notice-message">{{ notification.message }}</div>
            
            <div class="notice-actions">
              <a-button 
                v-if="!notification.read" 
                type="text" 
                size="small"
                @click.stop="markAsRead(notification.id)"
              >
                <icon-check />
                标记已读
              </a-button>
              <a-button 
                type="text" 
                size="small"
                @click.stop="viewNotificationDetail(notification)"
              >
                <icon-eye />
                查看详情
              </a-button>
            </div>
          </div>
          
          <div class="notice-status">
            <div v-if="!notification.read" class="unread-badge"></div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="notice-pagination">
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

    <!-- 通知详情弹窗 -->
    <a-modal
      v-model:visible="isDetailModalVisible"
      :title="selectedNotification ? selectedNotification.title : '通知详情'"
      :width="600"
      :footer="false"
    >
      <div v-if="selectedNotification" class="notification-detail">
        <div class="detail-header">
          <a-tag :color="getTypeColor(selectedNotification.type)" size="medium">
            {{ getTypeText(selectedNotification.type) }}
          </a-tag>
          <span class="detail-time">{{ formatTime(selectedNotification.timestamp) }}</span>
        </div>
        
        <div class="detail-content">
          <p class="detail-message">{{ selectedNotification.message }}</p>
          
          <div class="detail-info">
            <div class="info-item">
              <span class="label">通知类型：</span>
              <span>{{ getTypeText(selectedNotification.type) }}</span>
            </div>
            <div class="info-item">
              <span class="label">发送时间：</span>
              <span>{{ formatTime(selectedNotification.timestamp) }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态：</span>
              <a-tag :color="selectedNotification.read ? 'green' : 'orange'">
                {{ selectedNotification.read ? '已读' : '未读' }}
              </a-tag>
            </div>
          </div>
        </div>
        
        <div class="detail-actions">
          <a-button 
            v-if="!selectedNotification.read" 
            type="primary" 
            @click="markAsRead(selectedNotification.id)"
          >
            <icon-check />
            标记已读
          </a-button>
          <a-button @click="closeDetailModal">
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IconLeft, 
  IconCheck, 
  IconEye, 
  IconTrophy, 
  IconFire, 
  IconUser 
} from '@arco-design/web-vue/es/icon'

const $router = useRouter()

// 筛选条件
const filterType = ref('')
const filterStatus = ref('')

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 通知数据
const notifications = ref([
  {
    id: 1,
    type: 'contest',
    title: '新赛事开始',
    message: '2024年春季CTF大赛即将开始，请及时报名参加！本次大赛将涵盖Web安全、二进制漏洞、密码学、逆向工程等多个领域，为参赛者提供全面的技术挑战。',
    timestamp: Date.now() - 1800000, // 30分钟前
    read: false
  },
  {
    id: 2,
    type: 'system',
    title: '系统维护通知',
    message: '系统将于今晚22:00-24:00进行维护，期间可能影响正常使用。维护内容包括：数据库优化、安全补丁更新、性能提升等。',
    timestamp: Date.now() - 3600000, // 1小时前
    read: false
  },
  {
    id: 3,
    type: 'user',
    title: '队伍邀请',
    message: '你收到了来自"安全卫士"队伍的邀请，请及时处理。该队伍在最近的比赛中表现优异，期待你的加入！',
    timestamp: Date.now() - 7200000, // 2小时前
    read: false
  },
  {
    id: 4,
    type: 'contest',
    title: '比赛结果公布',
    message: '上周的Web安全挑战赛结果已公布，恭喜获奖队伍！本次比赛共有156支队伍参与，竞争激烈。',
    timestamp: Date.now() - 86400000, // 1天前
    read: true
  },
  {
    id: 5,
    type: 'system',
    title: '新功能上线',
    message: 'AWD攻防演练功能已上线，欢迎体验新的攻防对抗模式！该功能支持实时对战、队伍排名、攻击记录等。',
    timestamp: Date.now() - 172800000, // 2天前
    read: true
  },
  {
    id: 6,
    type: 'contest',
    title: 'CTF训练营报名',
    message: '2024年CTF训练营开始报名，为期一个月，包含理论学习和实战演练。适合初学者和进阶者参加。',
    timestamp: Date.now() - 259200000, // 3天前
    read: true
  },
  {
    id: 7,
    type: 'system',
    title: '安全公告',
    message: '发现新的安全漏洞，已发布紧急修复补丁。请所有用户及时更新系统，确保安全。',
    timestamp: Date.now() - 345600000, // 4天前
    read: true
  },
  {
    id: 8,
    type: 'user',
    title: '积分奖励',
    message: '恭喜你在最近的练习中获得优异成绩，奖励积分500点！继续努力，提升技能水平。',
    timestamp: Date.now() - 432000000, // 5天前
    read: true
  }
])

// 弹窗状态
const isDetailModalVisible = ref(false)
const selectedNotification = ref(null)

// 过滤后的通知
const filteredNotifications = computed(() => {
  let result = notifications.value

  // 类型筛选
  if (filterType.value) {
    result = result.filter(n => n.type === filterType.value)
  }
  
  // 状态筛选
  if (filterStatus.value) {
    if (filterStatus.value === 'unread') {
      result = result.filter(n => !n.read)
    } else if (filterStatus.value === 'read') {
      result = result.filter(n => n.read)
    }
  }

  pagination.total = result.length
  return result
})

// 筛选变化
const onFilterChange = () => {
  pagination.current = 1
}

// 返回上一页
const goBack = () => {
  $router.go(-1)
}

// 标记单个通知为已读
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
  }
}

// 标记所有通知为已读
const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

// 查看通知详情
const viewNotificationDetail = (notification) => {
  selectedNotification.value = notification
  isDetailModalVisible.value = true
}

// 关闭详情弹窗
const closeDetailModal = () => {
  isDetailModalVisible.value = false
  selectedNotification.value = null
}

// 工具函数
const getTypeColor = (type) => {
  const map = {
    contest: 'blue',
    system: 'orange',
    user: 'green'
  }
  return map[type] || 'gray'
}

const getTypeText = (type) => {
  const map = {
    contest: '赛事通知',
    system: '系统通知',
    user: '用户通知'
  }
  return map[type] || '其他'
}

const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  pagination.total = notifications.value.length
})
</script>

<style scoped>
.notice-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border-2);
}

.header-left {
  display: flex;
  align-items: center;
}

.back-btn {
  margin-right: 15px;
}

.header-left h1 {
  font-size: 24px;
  color: var(--color-text-1);
  margin-bottom: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.notice-content {
  background-color: var(--color-bg-2);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-1);
}

.notice-filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border-2);
}

.filter-group {
  display: flex;
  gap: 20px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background-color: var(--color-bg-1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.notice-item:hover {
  background-color: var(--color-fill-2);
  border-color: var(--color-border-1);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notice-item.unread {
  border-color: var(--color-primary-light-1);
  background-color: var(--color-primary-light-2);
}

.notice-icon {
  margin-right: 15px;
  font-size: 24px;
  color: var(--color-text-3);
  flex-shrink: 0;
}

.notice-content {
  flex-grow: 1;
  min-width: 0;
}

.notice-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  flex-grow: 1;
  margin-right: 15px;
  line-height: 1.4;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.notice-time {
  font-size: 12px;
  color: var(--color-text-3);
}

.notice-message {
  font-size: 14px;
  color: var(--color-text-2);
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-actions {
  display: flex;
  gap: 10px;
}

.notice-actions .arco-btn {
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
}

.notice-status {
  margin-left: 15px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.unread-badge {
  width: 8px;
  height: 8px;
  background-color: var(--color-primary-6);
  border-radius: 50%;
}

.notice-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 通知详情弹窗样式 */
.notification-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border-2);
}

.detail-header .arco-tag {
  font-size: 14px;
}

.detail-time {
  font-size: 14px;
  color: var(--color-text-3);
}

.detail-content {
  margin-bottom: 20px;
}

.detail-message {
  font-size: 15px;
  color: var(--color-text-2);
  line-height: 1.6;
  margin-bottom: 15px;
}

.detail-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--color-border-2);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  font-size: 14px;
  color: var(--color-text-3);
  font-weight: 500;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--color-border-2);
}

.detail-actions .arco-btn {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notice-container {
    padding: 16px;
  }
  
  .notice-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-left {
    width: 100%;
  }
  
  .back-btn {
    margin-right: 12px;
  }
  
  .header-left h1 {
    font-size: 20px;
  }
  
  .notice-filters {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-group {
    gap: 16px;
  }
  
  .notice-item {
    padding: 12px;
  }
  
  .notice-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .notice-title {
    margin-right: 0;
  }
  
  .notice-actions {
    flex-wrap: wrap;
  }
}
</style>
