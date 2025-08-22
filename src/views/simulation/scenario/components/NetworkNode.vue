<template>
  <div class="network-node" :class="data.status">
    <div class="node-icon">{{ getNodeIcon(data.type) }}</div>
    <div class="node-label">{{ data.label }}</div>
    <div class="node-status">
      <div class="status-indicator" :style="{ backgroundColor: data.statusColor }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
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
</script>

<style scoped>
.network-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: white;
  border: 3px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.network-node:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.network-node.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.node-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.node-label {
  font-size: 10px;
  font-weight: 500;
  color: #333;
  text-align: center;
  line-height: 1.2;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-status {
  position: absolute;
  top: 4px;
  right: 4px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid white;
}

/* 状态样式 */
.network-node.online {
  border-color: #52c41a;
}

.network-node.offline {
  border-color: #ff4d4f;
  opacity: 0.6;
}

.network-node.maintenance {
  border-color: #faad14;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .network-node {
    width: 60px;
    height: 60px;
  }
  
  .node-icon {
    font-size: 18px;
  }
  
  .node-label {
    font-size: 8px;
    max-width: 50px;
  }
}
</style>
