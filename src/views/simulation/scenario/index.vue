<template>
  <div class="scenario-detail">
    <div class="header">
      <a-button @click="goBack">返回</a-button>
      <h1>{{ scenario?.title || '场景详情' }}</h1>
    </div>
    
    <div v-if="scenario" class="content">
      <!-- 使用拓扑图组件 -->
      <TopologyMap 
        :topology-nodes="topologyNodes"
        @node-select="selectNode"
      />
      
      <!-- 使用拓扑信息组件 -->
      <TopologyInfo 
        :topology-nodes="topologyNodes"
        :topology-connections="topologyConnections"
        @device-select="selectNode"
      />
      
      <div class="info-section">
        <h3>场景信息</h3>
        <p>{{ scenario.description }}</p>
        <div class="tags">
          <a-tag v-for="tag in scenario.tags" :key="tag">{{ tag }}</a-tag>
        </div>
        <a-button type="primary" @click="startChallenge">开始挑战</a-button>
      </div>
    </div>
    
    <div v-else class="loading">
      <a-spin />
    </div>

    <!-- 使用节点详情弹窗组件 -->
    <NodeModal
      v-model:visible="isNodeModalVisible"
      :node="selectedNode"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 导入组件
import TopologyMap from '@/views/simulation/scenario/components/TopologyMap.vue'
import TopologyInfo from '@/views/simulation/scenario/components/TopologyInfo.vue'
import NodeModal from '@/views/simulation/scenario/components/NodeModal.vue'

const router = useRouter()
const scenario = ref(null)

// 拓扑相关
const selectedNode = ref(null)
const isNodeModalVisible = ref(false)

// 拓扑节点数据
const topologyNodes = ref([
  {
    id: 'firewall',
    type: 'firewall',
    label: '边界防火墙',
    ip: '192.168.1.254',
    status: 'online',
    services: ['nat', 'vpn', 'ids'],
    connections: ['router']
  },
  {
    id: 'router',
    type: 'router',
    label: '核心路由器',
    ip: '192.168.1.1',
    status: 'online',
    services: ['dhcp', 'dns', 'routing'],
    connections: ['firewall', 'switch']
  },
  {
    id: 'switch',
    type: 'switch',
    label: '核心交换机',
    ip: '192.168.1.2',
    status: 'online',
    services: ['switching', 'vlan'],
    connections: ['router', 'web-server', 'db-server', 'file-server', 'attacker-pc', 'admin-pc', 'user-pc']
  },
  {
    id: 'web-server',
    type: 'server',
    label: 'Web服务器',
    ip: '192.168.1.10',
    status: 'online',
    services: ['http', 'https', 'ssh'],
    connections: ['switch']
  },
  {
    id: 'db-server',
    type: 'server',
    label: '数据库服务器',
    ip: '192.168.1.20',
    status: 'maintenance',
    services: ['mysql', 'ssh', 'backup'],
    connections: ['switch']
  },
  {
    id: 'file-server',
    type: 'server',
    label: '文件服务器',
    ip: '192.168.1.30',
    status: 'online',
    services: ['ftp', 'smb', 'ssh'],
    connections: ['switch']
  },
  {
    id: 'attacker-pc',
    type: 'pc',
    label: '攻击者终端',
    ip: '192.168.1.100',
    status: 'online',
    services: ['ssh', 'tools'],
    connections: ['switch']
  },
  {
    id: 'admin-pc',
    type: 'pc',
    label: '管理员终端',
    ip: '192.168.1.101',
    status: 'online',
    services: ['ssh', 'admin'],
    connections: ['switch']
  },
  {
    id: 'user-pc',
    type: 'pc',
    label: '普通用户终端',
    ip: '192.168.1.102',
    status: 'offline',
    services: ['browser', 'office'],
    connections: ['switch']
  }
])

// 拓扑连接数据
const topologyConnections = ref([
  {
    id: 'fw-router',
    source: 'firewall',
    target: 'router',
    active: true
  },
  {
    id: 'router-switch',
    source: 'router',
    target: 'switch',
    active: true
  },
  {
    id: 'switch-web',
    source: 'switch',
    target: 'web-server',
    active: true
  },
  {
    id: 'switch-db',
    source: 'switch',
    target: 'db-server',
    active: false
  },
  {
    id: 'switch-file',
    source: 'switch',
    target: 'file-server',
    active: true
  },
  {
    id: 'switch-attacker',
    source: 'switch',
    target: 'attacker-pc',
    active: true
  },
  {
    id: 'switch-admin',
    source: 'switch',
    target: 'admin-pc',
    active: true
  },
  {
    id: 'switch-user',
    source: 'switch',
    target: 'user-pc',
    active: false
  }
])

// 返回列表
const goBack = () => router.push('/simulation')

// 开始挑战
const startChallenge = () => console.log('开始挑战')

// 选择节点
const selectNode = (node) => {
  selectedNode.value = node
  isNodeModalVisible.value = true
}

// 模拟获取场景数据
const fetchData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  scenario.value = {
    id: 1,
    title: '企业内网渗透仿真',
    description: '模拟企业内网环境，学习渗透测试技术',
    tags: ['内网渗透', '域渗透', '横向移动']
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.scenario-detail {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: var(--color-text-1);
}

.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.info-section {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
}

.tags {
  margin: 20px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>

