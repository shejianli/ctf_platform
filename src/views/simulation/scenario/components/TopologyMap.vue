<template>
  <div class="topology-section">
    <h3>🌐 网络拓扑图</h3>
    <div class="topology-controls">
      <a-button-group>
        <a-button size="small" @click="resetView">
          <icon-refresh />
          重置视图
        </a-button>
        <a-button size="small" @click="toggleConnections">
          <icon-eye />
          {{ showConnections ? '隐藏连线' : '显示连线' }}
        </a-button>
        <a-button size="small" @click="fitView">
          <icon-expand />
          适应画布
        </a-button>
        <a-button size="small" @click="zoomIn">
          <icon-plus />
          放大
        </a-button>
        <a-button size="small" @click="zoomOut">
          <icon-minus />
          缩小
        </a-button>
      </a-button-group>
    </div>
    
    <!-- Vue Flow 容器 -->
    <div class="topology-container">
      <VueFlow
        v-model="elements"
        :default-viewport="{ zoom: 0.8 }"
        :min-zoom="0.1"
        :max-zoom="2"
        :fit-view-on-init="true"
        @node-click="onNodeClick"
        @pane-click="onPaneClick"
        class="topology-canvas"
      >
        <!-- 背景网格 -->
        <Background pattern-color="#e2e8f0" gap="20" />
        
        <!-- 控制面板 -->
        <Controls />
        
        <!-- 小地图 -->
        <MiniMap />
        
        <!-- 自定义节点 -->
        <template #node-custom="nodeProps">
          <NetworkNode v-bind="nodeProps" />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { IconRefresh, IconEye, IconExpand, IconPlus, IconMinus } from '@arco-design/web-vue/es/icon'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/background/dist/style.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import NetworkNode from './NetworkNode.vue'

// Props
const props = defineProps({
  topologyNodes: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['nodeSelect'])

// Vue Flow 实例
const { fitView: vueFlowFitView, zoomIn: vueFlowZoomIn, zoomOut: vueFlowZoomOut, setViewport } = useVueFlow()

// 拓扑相关
const showConnections = ref(true)

// 节点颜色映射
const nodeColors = {
  server: '#ff6b6b',
  switch: '#4ecdc4',
  router: '#45b7d1',
  pc: '#96ceb4',
  firewall: '#feca57'
}

// 节点状态颜色映射
const statusColors = {
  online: '#52c41a',
  offline: '#ff4d4f',
  maintenance: '#faad14'
}

// 计算 Vue Flow 元素
const elements = computed(() => {
  const nodes = props.topologyNodes.map((node, index) => ({
    id: node.id,
    type: 'custom',
    position: getNodePosition(index, props.topologyNodes.length),
    data: {
      ...node,
      color: nodeColors[node.type] || '#ccc',
      statusColor: statusColors[node.status] || '#999'
    }
  }))

  const edges = showConnections.value ? [
    { id: 'firewall-router', source: 'firewall', target: 'router', type: 'smoothstep', animated: true, style: { stroke: '#52c41a', strokeWidth: 3 } },
    { id: 'router-switch', source: 'router', target: 'switch', type: 'smoothstep', animated: true, style: { stroke: '#52c41a', strokeWidth: 3 } },
    { id: 'switch-web', source: 'switch', target: 'web-server', type: 'smoothstep', animated: true, style: { stroke: '#52c41a', strokeWidth: 3 } },
    { id: 'switch-db', source: 'switch', target: 'db-server', type: 'smoothstep', animated: false, style: { stroke: '#d9d9d9', strokeWidth: 2 } },
    { id: 'switch-file', source: 'switch', target: 'file-server', type: 'smoothstep', animated: true, style: { stroke: '#52c41a', strokeWidth: 3 } },
    { id: 'switch-attacker', source: 'switch', target: 'attacker-pc', type: 'smoothstep', animated: true, style: { stroke: '#52c41a', strokeWidth: 3 } },
    { id: 'switch-admin', source: 'switch', target: 'admin-pc', type: 'smoothstep', animated: true, style: { stroke: '#52c41a', strokeWidth: 3 } },
    { id: 'switch-user', source: 'switch', target: 'user-pc', type: 'smoothstep', animated: false, style: { stroke: '#d9d9d9', strokeWidth: 2 } }
  ] : []

  return [...nodes, ...edges]
})

// 获取节点位置（圆形布局）
const getNodePosition = (index, total) => {
  const radius = 200
  const centerX = 400
  const centerY = 300
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2
  
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

// 节点点击事件
const onNodeClick = (event, node) => {
  emit('nodeSelect', node.data)
}

// 画布点击事件
const onPaneClick = () => {
  // 可以在这里处理画布点击事件
}

// 重置视图
const resetView = () => {
  setViewport({ x: 0, y: 0, zoom: 0.8 })
}

// 切换连接显示
const toggleConnections = () => {
  showConnections.value = !showConnections.value
}

// 适应画布
const fitView = () => {
  vueFlowFitView({ padding: 0.1 })
}

// 放大
const zoomIn = () => {
  vueFlowZoomIn()
}

// 缩小
const zoomOut = () => {
  vueFlowZoomOut()
}

// 监听拓扑节点变化
watch(() => props.topologyNodes, () => {
  // Vue Flow 会自动响应数据变化
}, { deep: true })

// 组件挂载
onMounted(() => {
  // 初始化完成后的处理
})
</script>

<style scoped>
.topology-section {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
}

.topology-section h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
  font-size: 20px;
  font-weight: 600;
}

.topology-controls {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.topology-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topology-canvas {
  width: 100%;
  height: 600px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
}

/* Vue Flow 样式覆盖 */
:deep(.vue-flow__node) {
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.vue-flow__node:hover) {
  transform: scale(1.05);
}

:deep(.vue-flow__edge) {
  transition: all 0.3s ease;
}

:deep(.vue-flow__edge:hover) {
  stroke-width: 4px !important;
}

:deep(.vue-flow__controls) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

:deep(.vue-flow__minimap) {
  border-radius: 8px;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .topology-canvas {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .topology-canvas {
    height: 400px;
  }
  
  .topology-controls {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
