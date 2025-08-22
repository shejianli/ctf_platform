<template>
  <div class="simulation-container">
    <div class="header">
      <h1>🎯 仿真靶场</h1>
      <p>真实环境模拟，实战技能训练</p>
    </div>

    <div class="main-content">
      <!-- 仿真场景列表 -->
      <div class="simulation-scenarios">
        <div class="section-header">
          <h3>🎭 仿真场景</h3>
          <div class="header-controls">
            <a-button type="primary" @click="createScenario">
              <icon-plus />
              创建场景
            </a-button>
          </div>
        </div>
        
        <div class="scenarios-grid">
          <div 
            v-for="scenario in simulationScenarios" 
            :key="scenario.id"
            class="scenario-card"
            :class="{ 
              'active': scenario.status === 'active',
              'maintenance': scenario.status === 'maintenance',
              'offline': scenario.status === 'offline'
            }"
            @click="enterScenario(scenario)"
          >
            <div class="scenario-header">
              <div class="scenario-status-tag">
                <a-tag :color="getScenarioStatusColor(scenario.status)">
                  {{ getScenarioStatusText(scenario.status) }}
                </a-tag>
              </div>
              <div class="scenario-difficulty">
                <a-tag :color="getDifficultyColor(scenario.difficulty)" size="small">
                  {{ getDifficultyText(scenario.difficulty) }}
                </a-tag>
              </div>
            </div>
            
            <div class="scenario-content">
              <h4 class="scenario-title">{{ scenario.title }}</h4>
              <p class="scenario-description">{{ scenario.description }}</p>
              
              <div class="scenario-meta">
                <div class="meta-item">
                  <icon-user />
                  <span>{{ scenario.participants }}人参与</span>
                </div>
                <div class="meta-item">
                  <icon-trophy />
                  <span>{{ scenario.completed }}人完成</span>
                </div>
                <div class="meta-item">
                  <icon-clock-circle />
                  <span>{{ scenario.duration }}</span>
                </div>
              </div>
              
              <div class="scenario-tags">
                <a-tag 
                  v-for="tag in scenario.tags" 
                  :key="tag"
                  size="small"
                  color="blue"
                >
                  {{ tag }}
                </a-tag>
              </div>
            </div>
            
            <div class="scenario-footer">
              <div class="scenario-actions">
                <a-button 
                  v-if="scenario.status === 'active'"
                  type="primary" 
                  size="small"
                  @click.stop="startScenario(scenario)"
                >
                  <icon-play-circle />
                  开始场景
                </a-button>
                <a-button 
                  v-else-if="scenario.status === 'maintenance'"
                  type="warning" 
                  size="small"
                  disabled
                >
                  <icon-tool />
                  维护中
                </a-button>
                <a-button 
                  v-else
                  type="outline" 
                  size="small"
                  disabled
                >
                  <icon-stop />
                  已下线
                </a-button>
              </div>
              
              <div class="scenario-info">
                <div class="info-row">
                  <span class="label">场景类型:</span>
                  <span class="value">{{ scenario.type }}</span>
                </div>
                <div class="info-row">
                  <span class="label">目标数量:</span>
                  <span class="value">{{ scenario.targetCount }}个</span>
                </div>
                <div class="info-row">
                  <span class="label">更新时间:</span>
                  <span class="value">{{ formatTimeAgo(scenario.updateTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧信息面板 -->
      <div class="info-panel">
        <!-- 我的进度 -->
        <div class="panel-section">
          <h3>📊 我的进度</h3>
          <div class="progress-stats">
            <div class="stat-item">
              <div class="stat-number">{{ myProgress.totalScenarios }}</div>
              <div class="stat-label">总场景数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ myProgress.completedScenarios }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ myProgress.currentStreak }}</div>
              <div class="stat-label">连续完成</div>
            </div>
          </div>
          
          <div class="progress-bar">
            <a-progress 
              :percent="(myProgress.completedScenarios / myProgress.totalScenarios) * 100" 
              :show-text="false"
            />
            <div class="progress-text">
              完成进度: {{ myProgress.completedScenarios }}/{{ myProgress.totalScenarios }}
            </div>
          </div>
        </div>
        
        <!-- 最近完成 -->
        <div class="panel-section">
          <h3>🏆 最近完成</h3>
          <div class="recent-completed">
            <div 
              v-for="scenario in recentCompleted" 
              :key="scenario.id"
              class="completed-item"
              @click="enterScenario(scenario)"
            >
              <div class="scenario-info">
                <div class="scenario-name">{{ scenario.title }}</div>
                <div class="completion-time">{{ formatTimeAgo(scenario.completedAt) }}</div>
              </div>
              <div class="completion-score">
                <a-tag color="green" size="small">
                  +{{ scenario.score }}分
                </a-tag>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 热门场景 -->
        <div class="panel-section">
          <h3>🔥 热门场景</h3>
          <div class="hot-scenarios">
            <div 
              v-for="(scenario, index) in hotScenarios" 
              :key="scenario.id"
              class="hot-item"
              @click="enterScenario(scenario)"
            >
              <div class="hot-rank">{{ index + 1 }}</div>
              <div class="hot-info">
                <div class="hot-name">{{ scenario.title }}</div>
                <div class="hot-stats">
                  <span>{{ scenario.participants }}人参与</span>
                  <span>{{ scenario.completed }}人完成</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IconPlus, IconUser, IconTrophy, IconClockCircle, IconTool, IconStop, IconPlayCircle } from '@arco-design/web-vue/es/icon'

const router = useRouter()

// 仿真靶场场景数据
const simulationScenarios = ref([
  {
    id: 1,
    title: '企业内网渗透仿真',
    description: '模拟企业内网环境，包含域控制器、文件服务器、数据库服务器等，需要完成从外网到内网的完整渗透路径',
    status: 'active',
    difficulty: 'hard',
    participants: 156,
    completed: 23,
    duration: '2-4小时',
    type: '内网渗透',
    targetCount: 8,
    tags: ['内网渗透', '域渗透', '横向移动', '权限维持'],
    updateTime: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 2,
    title: '电商网站渗透仿真',
    description: '模拟电商网站环境，包含用户系统、订单系统、支付系统等，需要发现并利用各种Web安全漏洞',
    status: 'active',
    difficulty: 'medium',
    participants: 234,
    completed: 89,
    duration: '1-2小时',
    type: 'Web渗透',
    targetCount: 5,
    tags: ['Web漏洞', '业务逻辑', '数据泄露', '支付系统'],
    updateTime: Date.now() - 1000 * 60 * 60 * 24 * 7
  },
  {
    id: 3,
    title: '工业控制系统仿真',
    description: '模拟工业控制网络环境，包含PLC、SCADA系统、历史数据库等，学习工控安全渗透技术',
    status: 'active',
    difficulty: 'hard',
    participants: 67,
    completed: 12,
    duration: '3-5小时',
    type: '工控渗透',
    targetCount: 6,
    tags: ['工控安全', 'SCADA', 'PLC', '协议分析'],
    updateTime: Date.now() - 1000 * 60 * 60 * 24 * 14
  },
  {
    id: 4,
    title: '云原生环境仿真',
    description: '模拟云原生环境，包含容器、Kubernetes集群、微服务等，学习云安全渗透技术',
    status: 'active',
    difficulty: 'medium',
    participants: 123,
    completed: 45,
    duration: '2-3小时',
    type: '云安全',
    targetCount: 7,
    tags: ['容器安全', 'K8s', '微服务', '云原生'],
    updateTime: Date.now() - 1000 * 60 * 60 * 24 * 21
  },
  {
    id: 5,
    title: '移动应用渗透仿真',
    description: '模拟移动应用环境，包含Android/iOS应用、后端API、数据库等，学习移动安全渗透技术',
    status: 'maintenance',
    difficulty: 'medium',
    participants: 89,
    completed: 34,
    duration: '1.5-2.5小时',
    type: '移动安全',
    targetCount: 4,
    tags: ['移动安全', '逆向分析', 'API测试', '数据安全'],
    updateTime: Date.now() - 1000 * 60 * 60 * 24 * 30
  },
  {
    id: 6,
    title: '物联网设备仿真',
    description: '模拟物联网环境，包含智能家居设备、传感器网络、网关等，学习IoT安全渗透技术',
    status: 'active',
    difficulty: 'easy',
    participants: 178,
    completed: 67,
    duration: '1-1.5小时',
    type: 'IoT安全',
    targetCount: 3,
    tags: ['IoT安全', '设备固件', '协议分析', '硬件安全'],
    updateTime: Date.now() - 1000 * 60 * 60 * 24 * 5
  }
])

// 我的进度
const myProgress = ref({
  totalScenarios: 18,
  completedScenarios: 6,
  currentStreak: 2
})

// 最近完成的场景
const recentCompleted = ref([
  {
    id: 1,
    title: '企业内网渗透仿真',
    completedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    score: 200
  },
  {
    id: 2,
    title: '电商网站渗透仿真',
    completedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    score: 150
  },
  {
    id: 4,
    title: '云原生环境仿真',
    completedAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    score: 180
  }
])

// 热门场景
const hotScenarios = ref([
  {
    id: 2,
    title: '电商网站渗透仿真',
    participants: 234,
    completed: 89
  },
  {
    id: 1,
    title: '企业内网渗透仿真',
    participants: 156,
    completed: 23
  },
  {
    id: 4,
    title: '云原生环境仿真',
    participants: 123,
    completed: 45
  }
])

// 获取场景状态颜色
const getScenarioStatusColor = (status) => {
  const colors = {
    active: 'green',
    maintenance: 'orange',
    offline: 'gray'
  }
  return colors[status] || 'gray'
}

// 获取场景状态文本
const getScenarioStatusText = (status) => {
  const texts = {
    active: '可用',
    maintenance: '维护中',
    offline: '已下线'
  }
  return texts[status] || '未知'
}

// 获取难度颜色
const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'green',
    medium: 'orange',
    hard: 'red'
  }
  return colors[difficulty] || 'gray'
}

// 获取难度文本
const getDifficultyText = (difficulty) => {
  const texts = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return texts[difficulty] || '未知'
}

// 格式化时间
const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 1000 * 60 * 60 * 24) {
    return Math.floor(diff / (1000 * 60 * 60)) + '小时前'
  } else {
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + '天前'
  }
}

// 进入场景
const enterScenario = (scenario) => {
  console.log('进入仿真场景:', scenario.title)
  // 跳转到具体的仿真靶场页面
  router.push(`/simulation/scenario/${scenario.id}`)
}

// 开始场景
const startScenario = (scenario) => {
  console.log('开始仿真场景:', scenario.title)
  // 跳转到具体的仿真靶场页面并自动开始
  router.push(`/simulation/scenario/${scenario.id}?action=start`)
}

// 创建场景
const createScenario = () => {
  console.log('创建新仿真场景')
  // TODO: 实现创建场景逻辑
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.simulation-container {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.header p {
  color: var(--color-text-3);
  font-size: 16px;
}

.main-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.simulation-scenarios {
  flex: 1;
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 18px;
  font-weight: 600;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.scenario-card {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.scenario-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.scenario-card.active {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.scenario-card.maintenance {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
}

.scenario-card.offline {
  border-color: #6b7280;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.scenario-status-tag {
  flex-shrink: 0;
}

.scenario-content {
  margin-bottom: 16px;
}

.scenario-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0 0 8px 0;
}

.scenario-description {
  color: var(--color-text-2);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.scenario-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-3);
  font-size: 12px;
}

.scenario-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.scenario-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.scenario-actions {
  margin-bottom: 16px;
}

.scenario-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.info-row .label {
  color: var(--color-text-3);
}

.info-row .value {
  color: var(--color-text-1);
  font-weight: 500;
}

.info-panel {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
}

.panel-section {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.panel-section h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-6);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-3);
}

.progress-bar {
  margin-bottom: 16px;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-3);
  text-align: center;
  margin-top: 8px;
}

.recent-completed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.completed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--color-fill-1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.completed-item:hover {
  background: var(--color-fill-2);
}

.scenario-info .scenario-name {
  font-size: 14px;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.scenario-info .completion-time {
  font-size: 12px;
  color: var(--color-text-3);
}

.hot-scenarios {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-fill-1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.hot-item:hover {
  background: var(--color-fill-2);
}

.hot-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary-6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.hot-info {
  flex: 1;
}

.hot-name {
  font-size: 14px;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.hot-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--color-text-3);
}
</style>
