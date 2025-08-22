<template>
  <div class="topology-info-panel">
    <div class="info-header">
      <h4>📊 拓扑信息</h4>
      <a-tag color="blue">实时更新</a-tag>
    </div>
    <div class="info-content">
      <div class="info-stats">
        <div class="stat-item">
          <span class="label">设备总数:</span>
          <span class="value">{{ topologyStats.totalDevices }}</span>
        </div>
        <div class="stat-item">
          <span class="label">在线设备:</span>
          <span class="value">{{ topologyStats.onlineDevices }}</span>
        </div>
        <div class="stat-item">
          <span class="label">连接数量:</span>
          <span class="value">{{ topologyStats.totalConnections }}</span>
        </div>
        <div class="stat-item">
          <span class="label">网络段:</span>
          <span class="value">{{ topologyStats.networkSegments }}</span>
        </div>
      </div>
      
      <!-- 设备列表 -->
      <div class="device-list">
        <h5>设备状态</h5>
        <div class="device-grid">
          <div 
            v-for="device in deviceList" 
            :key="device.id"
            class="device-item"
            :class="device.status"
            @click="selectDevice(device)"
          >
            <div class="device-icon">{{ getNodeIcon(device.type) }}</div>
            <div class="device-info">
              <div class="device-name">{{ device.label }}</div>
              <div class="device-ip">{{ device.ip }}</div>
            </div>
            <div class="device-status">
              <a-tag :color="getNodeStatusColor(device.status)" size="small">
                {{ getNodeStatusText(device.status) }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  topologyNodes: {
    type: Array,
    default: () => []
  },
  topologyConnections: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['deviceSelect'])

// 计算属性
const topologyStats = computed(() => ({
  totalDevices: props.topologyNodes.length,
  onlineDevices: props.topologyNodes.filter(n => n.status === 'online').length,
  totalConnections: props.topologyConnections.length,
  networkSegments: 4
}))

const deviceList = computed(() => {
  return props.topologyNodes.map(node => ({
    ...node,
    services: node.services || []
  }))
})

// 获取节点图标
const getNodeIcon = (type) => {
  const icons = {
    server: '🖥️',
    switch: '🔌',
    router: '🌐',
    pc: '💻',
    firewall: '🛡️'
  }
  return icons[type] || '📱'
}

// 获取节点状态文本
const getNodeStatusText = (status) => {
  const statusMap = {
    online: '在线',
    offline: '离线',
    maintenance: '维护中',
    error: '故障'
  }
  return statusMap[status] || '未知'
}

// 获取节点状态颜色
const getNodeStatusColor = (status) => {
  const colorMap = {
    online: 'green',
    offline: 'gray',
    maintenance: 'orange',
    error: 'red'
  }
  return colorMap[status] || 'gray'
}

// 选择设备
const selectDevice = (device) => {
  emit('deviceSelect', device)
}
</script>

<style scoped>
.topology-info-panel {
  background: var(--color-bg-1);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.info-header h4 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--color-bg-2);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.stat-item .label {
  color: var(--color-text-2);
  font-size: 14px;
}

.stat-item .value {
  color: var(--color-text-1);
  font-weight: 600;
  font-size: 16px;
}

/* 设备列表 */
.device-list h5 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: 600;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.device-grid::-webkit-scrollbar {
  width: 6px;
}

.device-grid::-webkit-scrollbar-track {
  background: var(--color-bg-2);
  border-radius: 3px;
}

.device-grid::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.device-grid::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-3);
}

.device-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg-2);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s;
}

.device-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-6);
}

.device-item.online {
  border-left: 4px solid var(--color-success-6);
}

.device-item.offline {
  border-left: 4px solid var(--color-text-3);
}

.device-item.maintenance {
  border-left: 4px solid var(--color-warning-6);
}

.device-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.device-info {
  flex: 1;
  min-width: 0;
}

.device-name {
  font-weight: 600;
  color: var(--color-text-1);
  font-size: 14px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-ip {
  font-family: monospace;
  color: var(--color-text-3);
  font-size: 12px;
}

.device-status {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .device-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .device-grid {
    grid-template-columns: 1fr;
    max-height: 250px;
  }
}
</style>
