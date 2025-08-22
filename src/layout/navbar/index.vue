<template>
  <div class="navbar">
    <div class="side-left">
      <div style="height: 38px"><img src="@/assets/icon.svg" /></div>
      <h5 class="arco-typography brand">CTF平台</h5>
    </div>

    <div class="nav-menu">
      <a-menu mode="horizontal" :selected-keys="[currentRoute]" @menu-item-click="onNavClick">
        <a-menu-item key="practice">练习场</a-menu-item>
        <a-menu-item key="contest">赛事中心</a-menu-item>
        <a-menu-item key="vulnlab">漏洞靶场</a-menu-item>
        <a-menu-item key="challenge">闯关模式</a-menu-item>
        <a-menu-item key="awd">AWD攻防</a-menu-item>
        <a-menu-item key="simulation">仿真靶场</a-menu-item>
        <a-menu-item key="learning">📚 学习中心</a-menu-item>
        <a-menu-item key="ranking">排行榜</a-menu-item>
      </a-menu>
    </div>

    <!-- 右侧通知铃铛 -->
    <div class="nav-right">
      <div class="notification-bell" @click="toggleNotificationDropdown">
        <a-badge :count="unreadCount" :dot="unreadCount > 0">
          <icon-notification class="bell-icon" />
        </a-badge>
      </div>
    </div>

    <!-- 通知弹窗（备用方案） -->
    <a-modal
      v-model:visible="isNotificationModalVisible"
      title="通知中心"
      :width="600"
      :footer="false"
      @cancel="closeNotificationModal"
    >
      <div class="notification-modal-content">
        <div class="notification-header">
          <h4>通知中心</h4>
          <a-button size="mini" @click="markAllAsRead">
            全部已读
          </a-button>
        </div>
        
        <div class="notification-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="notification-icon">
              <icon-trophy v-if="notification.type === 'contest'" />
              <icon-fire v-else-if="notification.type === 'system'" />
              <icon-user v-else />
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTimeAgo(notification.timestamp) }}</div>
            </div>
            <div class="notification-status">
              <div v-if="!notification.read" class="unread-dot"></div>
            </div>
          </div>
        </div>
        
        <div class="notification-footer">
          <a-button type="text" size="small" @click="viewAllNotifications">
            查看全部通知
          </a-button>
        </div>
      </div>
    </a-modal>

    <ul class="side-right">
      <li>
        <a-dropdown @select="onMenuClick">
          <a-avatar :size="32">
            <img
              alt="avatar"
              src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
            />
          </a-avatar>

          <template #content>
            <a-doption value="profile">个人中心</a-doption>
            <a-doption value="logout">退出登录</a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const $store = useStore()
const $router = useRouter()
const $route = useRoute()

// 当前路由，用于菜单高亮
const currentRoute = computed(() => {
  const path = $route.path
  if (path.includes('/practice')) return 'practice'
  if (path.includes('/contest')) return 'contest'
  if (path.includes('/vulnlab')) return 'vulnlab'
  if (path.includes('/awd')) return 'awd'
  if (path.includes('/challenge')) return 'challenge'
  if (path.includes('/simulation')) return 'simulation'
  if (path.includes('/learning')) return 'learning'
  if (path.includes('/ranking')) return 'ranking'
  return ''
})

// 处理导航菜单点击
const onNavClick = (key) => {
  switch (key) {
    case 'practice':
      $router.push('/practice')
      break
    case 'contest':
      $router.push('/contest')
      break
    case 'vulnlab':
      $router.push('/vulnlab')
      break
    case 'challenge':
      $router.push('/challenge')
      break
    case 'awd':
      $router.push('/awd')
      break
    case 'simulation':
      $router.push('/simulation')
      break
    case 'learning':
      $router.push('/learning')
      break
    case 'ranking':
      $router.push('/ranking')
      break
  }
}

// 处理用户菜单点击
const onMenuClick = (value) => {
  switch (value) {
    case 'profile':
      $router.push('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 通知相关状态
const isNotificationModalVisible = ref(false)
const unreadCount = ref(3)

// 通知数据
const notifications = ref([
  {
    id: 1,
    type: 'contest',
    title: '新赛事开始',
    message: '2024年春季CTF大赛即将开始，请及时报名参加！',
    timestamp: Date.now() - 1800000, // 30分钟前
    read: false
  },
  {
    id: 2,
    type: 'system',
    title: '系统维护通知',
    message: '系统将于今晚22:00-24:00进行维护，期间可能影响正常使用。',
    timestamp: Date.now() - 3600000, // 1小时前
    read: false
  },
  {
    id: 3,
    type: 'user',
    title: '队伍邀请',
    message: '你收到了来自"安全卫士"队伍的邀请，请及时处理。',
    timestamp: Date.now() - 7200000, // 2小时前
    read: false
  },
  {
    id: 4,
    type: 'contest',
    title: '比赛结果公布',
    message: '上周的Web安全挑战赛结果已公布，恭喜获奖队伍！',
    timestamp: Date.now() - 86400000, // 1天前
    read: true
  },
  {
    id: 5,
    type: 'system',
    title: '新功能上线',
    message: 'AWD攻防演练功能已上线，欢迎体验新的攻防对抗模式！',
    timestamp: Date.now() - 172800000, // 2天前
    read: true
  }
])

// 切换通知弹窗
const toggleNotificationDropdown = () => {
  isNotificationModalVisible.value = true
}

// 关闭通知弹窗
const closeNotificationModal = () => {
  isNotificationModalVisible.value = false
}

// 标记单个通知为已读
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }
}

// 标记所有通知为已读
const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  unreadCount.value = 0
}

// 查看全部通知
const viewAllNotifications = () => {
  // 跳转到通知页面
  $router.push('/notice')
  isNotificationModalVisible.value = false
}

// 格式化时间
const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

// 退出登录
const handleLogout = () => {
  $store.dispatch('user/logout')
  $router.push('/login')
}
</script>

<style scoped>
.navbar {
  height: 60px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.side-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  width: 200px;
}

.brand {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

.nav-menu :deep(.arco-menu) {
  background-color: transparent;
  border-bottom: none;
}

.nav-menu :deep(.arco-menu-horizontal .arco-menu-item) {
  padding: 0 20px;
  margin: 0 5px;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-menu :deep(.arco-menu-horizontal .arco-menu-item:hover) {
  background-color: var(--color-fill-2);
}

.nav-menu :deep(.arco-menu-horizontal .arco-menu-item.arco-menu-selected) {
  background-color: var(--color-primary-light-1);
  color: var(--color-primary-6);
}

/* 右侧通知铃铛样式 */
.nav-right {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 20px;
  flex-shrink: 0;
}

.side-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  width: 120px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.user-menu:hover {
  background: var(--color-fill-2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary-6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: var(--color-text-3);
  line-height: 1.2;
}

/* 右侧通知铃铛样式 */
.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-bell:hover {
  background: var(--color-fill-2);
}

.bell-icon {
  font-size: 18px;
  color: var(--color-text-2);
}

/* 通知弹窗内容样式 */
.notification-modal-content {
  max-height: 500px;
  overflow-y: auto;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.notification-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-fill-3);
  cursor: pointer;
  transition: all 0.2s;
}

.notification-item:hover {
  background: var(--color-fill-1);
  margin: 0 -16px;
  padding: 16px;
}

.notification-item.unread {
  background: var(--color-primary-light-1);
  margin: 0 -16px;
  padding: 16px;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-fill-2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-text-2);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-message {
  font-size: 13px;
  color: var(--color-text-2);
  margin-bottom: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 11px;
  color: var(--color-text-3);
}

.notification-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary-6);
}

.notification-footer {
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
  text-align: center;
  margin-top: 16px;
}

/* 滚动条样式 */
.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: var(--color-fill-4);
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-fill-5);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .side-left {
    width: 180px;
  }
  
  .side-right {
    width: 100px;
  }
  
  .nav-menu :deep(.arco-menu-horizontal .arco-menu-item) {
    padding: 0 16px;
    margin: 0 3px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 16px;
  }
  
  .side-left {
    width: 150px;
    gap: 12px;
  }
  
  .brand {
    font-size: 16px;
  }
  
  .nav-menu {
    justify-content: flex-start;
  }
  
  .nav-menu :deep(.arco-menu-horizontal .arco-menu-item) {
    padding: 0 12px;
    margin: 0 2px;
    font-size: 14px;
  }
  
  .side-right {
    width: 80px;
  }
  
  .nav-right {
    margin-right: 16px;
  }
}

@media (max-width: 600px) {
  .side-left {
    width: 120px;
  }
  
  .brand {
    font-size: 14px;
  }
  
  .nav-menu :deep(.arco-menu-horizontal .arco-menu-item) {
    padding: 0 8px;
    margin: 0 1px;
    font-size: 13px;
  }
  
  .side-right {
    width: 60px;
  }
}
</style>
