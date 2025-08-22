<template>
  <a-modal
    v-model:visible="visible"
    :title="node ? `${node.label} 详情` : '设备详情'"
    :width="500"
    :footer="false"
    unmount-on-close
  >
    <div v-if="node" class="node-modal">
      <div class="node-header">
        <div class="node-icon-large">{{ getNodeIcon(node.type) }}</div>
        <div class="node-info">
          <h3>{{ node.label }}</h3>
          <p class="node-ip">{{ node.ip }}</p>
          <a-tag :color="getNodeStatusColor(node.status)">
            {{ getNodeStatusText(node.status) }}
          </a-tag>
        </div>
      </div>
      
      <div class="node-details">
        <h4>设备信息</h4>
        <div class="detail-list">
          <div class="detail-item">
            <span class="label">设备类型:</span>
            <span>{{ getNodeTypeText(node.type) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">IP地址:</span>
            <span class="ip-address">{{ node.ip }}</span>
          </div>
          <div class="detail-item">
            <span class="label">状态:</span>
            <span>{{ getNodeStatusText(node.status) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">服务数量:</span>
            <span>{{ node.services?.length || 0 }}个</span>
          </div>
        </div>
        
        <h4>运行服务</h4>
        <div class="services-list">
          <a-tag 
            v-for="service in node.services" 
            :key="service"
            color="blue"
            size="medium"
          >
            {{ service }}
          </a-tag>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  node: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible'])

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
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

// 获取节点类型文本
const getNodeTypeText = (type) => {
  const texts = {
    server: '服务器',
    switch: '交换机',
    router: '路由器',
    pc: '终端设备',
    firewall: '防火墙'
  }
  return texts[type] || '未知设备'
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
</script>

<style scoped>
.node-modal .node-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.node-icon-large {
  font-size: 48px;
  flex-shrink: 0;
}

.node-info h3 {
  margin: 0 0 8px 0;
  color: var(--color-text-1);
  font-size: 20px;
  font-weight: 600;
}

.node-ip {
  color: var(--color-text-3);
  font-family: monospace;
  font-size: 14px;
  margin-bottom: 12px;
}

.node-details h4 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--color-bg-2);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.detail-item .label {
  color: var(--color-text-2);
  font-size: 14px;
}

.detail-item .value {
  color: var(--color-text-1);
  font-weight: 500;
}

.ip-address {
  font-family: monospace;
  color: var(--color-primary-6);
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
