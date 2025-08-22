<template>
  <div class="vulnlab-container">
    <div class="header-row">
      <div class="header-left">
        <h1>🔥 漏洞靶场</h1>
        <p>下载真实漏洞环境，提升实战渗透能力</p>
      </div>
      
      <div class="header-right">
        <a-input-search 
          v-model="filters.search" 
          placeholder="搜索靶场..." 
          allow-clear
          size="large"
          class="search-input"
          search-button
          button-text="搜索"
          @search="onSearch"
        >
          <template #prefix>
            <icon-search />
          </template>
        </a-input-search>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧靶场列表 -->
      <div class="vulnlab-list">
        <div class="filters">

          <!-- 分类筛选 -->
          <div class="filter-section">
            <h4 class="filter-title">靶场分类</h4>
            <div class="filter-options">
              <div 
                class="filter-option"
                :class="{ active: filters.category === '' }"
                @click="filters.category = ''"
              >
                <span class="option-icon">📋</span>
                <span class="option-text">全部</span>
              </div>
              <div 
                class="filter-option"
                :class="{ active: filters.category === 'web' }"
                @click="filters.category = 'web'"
              >
                <span class="option-icon">🌐</span>
                <span class="option-text">Web漏洞</span>
              </div>
              <div 
                class="filter-option"
                :class="{ active: filters.category === 'pwn' }"
                @click="filters.category = 'pwn'"
              >
                <span class="option-icon">⚡</span>
                <span class="option-text">二进制漏洞</span>
              </div>
              <div 
                class="filter-option"
                :class="{ active: filters.category === 'reverse' }"
                @click="filters.category = 'reverse'"
              >
                <span class="option-icon">🔄</span>
                <span class="option-text">逆向工程</span>
              </div>
              <div 
                class="filter-option"
                :class="{ active: filters.category === 'crypto' }"
                @click="filters.category = 'crypto'"
              >
                <span class="option-icon">🔐</span>
                <span class="option-text">密码学</span>
              </div>
              <div 
                class="filter-option"
                :class="{ active: filters.category === 'forensics' }"
                @click="filters.category = 'forensics'"
              >
                <span class="option-icon">🔍</span>
                <span class="option-text">数字取证</span>
              </div>
            </div>
          </div>

          <!-- 难度筛选 -->
          <div class="filter-section">
            <h4 class="filter-title">难度等级</h4>
            <div class="filter-options">
              <div 
                class="filter-option"
                :class="{ active: filters.difficulty === '' }"
                @click="filters.difficulty = ''"
              >
                <span class="option-icon">📊</span>
                <span class="option-text">全部</span>
              </div>
              <div 
                class="filter-option difficulty-easy"
                :class="{ active: filters.difficulty === 'easy' }"
                @click="filters.difficulty = 'easy'"
              >
                <span class="option-icon">🟢</span>
                <span class="option-text">简单</span>
              </div>
              <div 
                class="filter-option difficulty-medium"
                :class="{ active: filters.difficulty === 'medium' }"
                @click="filters.difficulty = 'medium'"
              >
                <span class="option-icon">🟡</span>
                <span class="option-text">中等</span>
              </div>
              <div 
                class="filter-option difficulty-hard"
                :class="{ active: filters.difficulty === 'hard' }"
                @click="filters.difficulty = 'hard'"
              >
                <span class="option-icon">🔴</span>
                <span class="option-text">困难</span>
              </div>
              <div 
                class="filter-option difficulty-expert"
                :class="{ active: filters.difficulty === 'expert' }"
                @click="filters.difficulty = 'expert'"
              >
                <span class="option-icon">💀</span>
                <span class="option-text">专家级</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 靶场列表 -->
        <div class="vulnlab-grid">
          <a-row :gutter="[16, 16]">
            <a-col 
              v-for="lab in filteredLabs" 
              :key="lab.id" 
              :xxl="8"
              :xl="12"
              :lg="12"
              :md="24"
              :sm="24"
              :xs="24"
            >
              <a-card 
                class="vulnlab-card" 
                hoverable
                @click="openLab(lab)"
              >
                <template #cover>
                  <div class="lab-cover">
                  </div>
                </template>
                
                <div class="lab-content">
                  <div class="lab-header">
                    <h4 class="lab-title">{{ lab.name }}</h4>
                    <div class="lab-meta">
                      <a-tag size="small" :color="getStatusColor(lab.status)">
                        {{ getStatusText(lab.status) }}
                      </a-tag>
                      <a-tag size="small" v-if="lab.firstBlood" color="red">
                        🏆 首杀
                      </a-tag>
                    </div>
                  </div>
                  
                  <div class="lab-category-difficulty">
                    <a-tag size="small" color="blue">{{ getCategoryName(lab.category) }}</a-tag>
                    <a-tag size="small" color="orange">{{ getDifficultyName(lab.difficulty) }}</a-tag>
                  </div>
                  
                  <p class="lab-description">{{ lab.description }}</p>
                  
                  <div class="lab-info">
                    <div class="info-item">
                      <icon-download />
                      <span>{{ lab.downloads }}次下载</span>
                    </div>
                    <div class="info-item">
                      <icon-user />
                      <span>{{ lab.solved }}人解决</span>
                    </div>
                    <div class="info-item">
                      <icon-clock-circle />
                      <span>{{ lab.size }}</span>
                    </div>
                  </div>

                  <div class="lab-tags">
                    <a-tag 
                      v-for="tag in lab.tags" 
                      :key="tag"
                      size="small"
                      color="blue"
                    >
                      {{ tag }}
                    </a-tag>
                  </div>
                </div>

                <template #actions>
                  <a-button type="primary" @click="downloadLab(lab)">
                    <icon-download />
                    下载
                  </a-button>
                  <a-button @click="viewDetails(lab)">
                    <icon-eye />
                    详情
                  </a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
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

      <!-- 右侧信息面板 -->
      <div class="info-panel">
        <div class="panel-section">
          <h3>📚 使用说明</h3>
          <div class="instruction-list">
            <div class="instruction-item">
              <div class="step">1</div>
              <div class="content">下载靶场虚拟机文件</div>
            </div>
            <div class="instruction-item">
              <div class="step">2</div>
              <div class="content">使用 VirtualBox/VMware 导入</div>
            </div>
            <div class="instruction-item">
              <div class="step">3</div>
              <div class="content">启动虚拟机开始渗透测试</div>
            </div>
            <div class="instruction-item">
              <div class="step">4</div>
              <div class="content">获取 root 权限或 flag</div>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>🔥 热门靶场</h3>
          <div class="hot-labs">
            <div 
              v-for="lab in hotLabs" 
              :key="lab.id"
              class="hot-lab-item"
              @click="openLab(lab)"
            >
              <div class="hot-lab-rank">{{ lab.rank }}</div>
              <div class="hot-lab-info">
                <div class="hot-lab-name">{{ lab.name }}</div>
                <div class="hot-lab-category">{{ getCategoryName(lab.category) }}</div>
              </div>
              <div class="hot-lab-downloads">{{ lab.downloads }}次</div>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>📊 统计信息</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ totalLabs }}</div>
              <div class="stat-label">靶场总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalDownloads }}</div>
              <div class="stat-label">总下载量</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalSolved }}</div>
              <div class="stat-label">总解决数</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 靶场详情弹窗 -->
    <a-modal
      v-model:visible="isLabModalVisible"
      :title="selectedLab ? selectedLab.name : '靶场详情'"
      :width="800"
      :footer="false"
      unmount-on-close
    >
      <div v-if="selectedLab" class="lab-modal">
        <div class="modal-header">
          <a-tag size="small">{{ getCategoryName(selectedLab.category) }}</a-tag>
          <a-tag size="small" :color="getStatusColor(selectedLab.status)" class="ml8">
            {{ getStatusText(selectedLab.status) }}
          </a-tag>
          <a-tag size="small" class="ml8">{{ getDifficultyName(selectedLab.difficulty) }}</a-tag>
          <a-tag size="small" class="ml8">{{ selectedLab.os }}</a-tag>
        </div>

        <div class="modal-body">
          <p class="desc">{{ selectedLab.description }}</p>

          <div class="lab-details">
            <h4>靶场信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">操作系统：</span>
                <span>{{ selectedLab.os }}</span>
              </div>
              <div class="detail-item">
                <span class="label">文件大小：</span>
                <span>{{ selectedLab.size }}</span>
              </div>
              <div class="detail-item">
                <span class="label">下载次数：</span>
                <span>{{ selectedLab.downloads }}</span>
              </div>
              <div class="detail-item">
                <span class="label">解决人数：</span>
                <span>{{ selectedLab.solved }}</span>
              </div>
              <div class="detail-item">
                <span class="label">创建时间：</span>
                <span>{{ selectedLab.createdAt }}</span>
              </div>
              <div class="detail-item">
                <span class="label">最后更新：</span>
                <span>{{ selectedLab.updatedAt }}</span>
              </div>
            </div>
          </div>

          <div class="lab-tags-section">
            <h4>标签</h4>
            <div class="tags-list">
              <a-tag 
                v-for="tag in selectedLab.tags" 
                :key="tag"
                size="medium"
                color="blue"
              >
                {{ tag }}
              </a-tag>
            </div>
          </div>

          <div class="lab-actions">
            <a-button type="primary" size="large" @click="downloadLab(selectedLab)">
              <icon-download />
              下载靶场
            </a-button>
            <a-button size="large" @click="viewWriteup(selectedLab)">
              <icon-book />
              查看题解
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  IconSearch, 
  IconDownload, 
  IconUser, 
  IconClockCircle, 
  IconEye,
  IconBook
} from '@arco-design/web-vue/es/icon'

// 筛选条件
const filters = reactive({
  category: '',
  difficulty: '',
  search: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0
})

// 靶场数据
const vulnLabs = ref([
  {
    id: 1,
    name: 'Kioptrix Level 1',
    description: '经典的Linux渗透测试靶场，包含多种Web漏洞和提权技术',
    category: 'web',
    difficulty: 'easy',
    os: 'Linux',
    status: 'active',
    downloads: 15420,
    solved: 8920,
    size: '1.2GB',
    tags: ['SQL注入', '文件包含', '提权'],
    firstBlood: false,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-10'
  },
  {
    id: 2,
    name: 'VulnHub - Stapler',
    description: '基于Ubuntu的靶场，包含多种Web应用漏洞和系统提权',
    category: 'web',
    difficulty: 'medium',
    os: 'Linux',
    status: 'active',
    downloads: 12350,
    solved: 6540,
    size: '2.1GB',
    tags: ['XSS', 'CSRF', '命令注入', '提权'],
    firstBlood: false,
    createdAt: '2023-03-20',
    updatedAt: '2024-01-05'
  },
  {
    id: 3,
    name: 'Pwnable.kr - Toddler',
    description: '二进制漏洞利用靶场，包含栈溢出、格式化字符串等',
    category: 'pwn',
    difficulty: 'easy',
    os: 'Linux',
    status: 'active',
    downloads: 8760,
    solved: 4320,
    size: '500MB',
    tags: ['栈溢出', '格式化字符串', 'ROP'],
    firstBlood: false,
    createdAt: '2023-02-10',
    updatedAt: '2023-12-20'
  },
  {
    id: 4,
    name: 'Reverse Engineering - CrackMe',
    description: '逆向工程练习靶场，包含多种反编译和动态分析技术',
    category: 'reverse',
    difficulty: 'medium',
    os: 'Windows',
    status: 'active',
    downloads: 6540,
    solved: 2980,
    size: '800MB',
    tags: ['反编译', '动态分析', '算法逆向'],
    firstBlood: false,
    createdAt: '2023-04-15',
    updatedAt: '2023-11-30'
  },
  {
    id: 5,
    name: 'Crypto Challenge - RSA',
    description: '密码学挑战靶场，包含RSA、AES等加密算法的破解',
    category: 'crypto',
    difficulty: 'hard',
    os: 'Linux',
    status: 'active',
    downloads: 4320,
    solved: 1560,
    size: '600MB',
    tags: ['RSA', 'AES', '哈希碰撞', '侧信道攻击'],
    firstBlood: false,
    createdAt: '2023-05-20',
    updatedAt: '2023-10-15'
  },
  {
    id: 6,
    name: 'Digital Forensics - Memory Dump',
    description: '数字取证靶场，从内存dump中提取关键信息和证据',
    category: 'forensics',
    difficulty: 'expert',
    os: 'Windows',
    status: 'active',
    downloads: 2980,
    solved: 890,
    size: '3.5GB',
    tags: ['内存分析', '进程分析', '网络分析', '文件恢复'],
    firstBlood: false,
    createdAt: '2023-06-10',
    updatedAt: '2023-09-25'
  }
])

// 热门靶场
const hotLabs = computed(() => {
  return vulnLabs.value
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5)
    .map((lab, index) => ({
      ...lab,
      rank: index + 1
    }))
})

// 统计信息
const totalLabs = computed(() => vulnLabs.value.length)
const totalDownloads = computed(() => vulnLabs.value.reduce((sum, lab) => sum + lab.downloads, 0))
const totalSolved = computed(() => vulnLabs.value.reduce((sum, lab) => sum + lab.solved, 0))

// 过滤后的靶场
const filteredLabs = computed(() => {
  let result = vulnLabs.value

  // 分类筛选
  if (filters.category) {
    result = result.filter(lab => lab.category === filters.category)
  }
  
  // 难度筛选
  if (filters.difficulty) {
    result = result.filter(lab => lab.difficulty === filters.difficulty)
  }
  
  // 搜索筛选
  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(lab => 
      lab.name.toLowerCase().includes(search) ||
      lab.description.toLowerCase().includes(search) ||
      lab.tags.some(tag => tag.toLowerCase().includes(search))
    )
  }

  pagination.total = result.length
  return result
})

// 获取分类名称
const getCategoryName = (category) => {
  const map = {
    web: 'Web漏洞',
    pwn: '二进制漏洞',
    reverse: '逆向工程',
    crypto: '密码学',
    forensics: '数字取证'
  }
  return map[category] || category
}

// 获取难度名称
const getDifficultyName = (difficulty) => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    expert: '专家级'
  }
  return map[difficulty] || difficulty
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    active: 'Linux',
    inactive: 'Windows',
    maintenance: '维护中'
  }
  return map[status] || '未知'
}

// 获取状态颜色
const getStatusColor = (status) => {
  const map = {
    active: 'green',
    inactive: 'gray',
    maintenance: 'orange'
  }
  return map[status] || 'gray'
}

// 搜索
const onSearch = () => {
  pagination.current = 1
}

// 弹窗相关
const isLabModalVisible = ref(false)
const selectedLab = ref(null)

// 打开靶场详情
const openLab = (lab) => {
  selectedLab.value = lab
  isLabModalVisible.value = true
}

// 下载靶场
const downloadLab = (lab) => {
  console.log('下载靶场:', lab.name)
  // TODO: 实现下载逻辑
  // 可以跳转到下载页面或直接下载
}

// 查看详情
const viewDetails = (lab) => {
  openLab(lab)
}

// 查看题解
const viewWriteup = (lab) => {
  console.log('查看题解:', lab.name)
  // TODO: 跳转到题解页面
}

onMounted(() => {
  pagination.total = vulnLabs.value.length
})
</script>

<style scoped>
.vulnlab-container {
  padding: 20px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-left {
  flex: 1;
}

.header-left h1 {
  font-size: 28px;
  color: var(--color-text-1);
  margin: 0 0 8px 0;
}

.header-left p {
  color: var(--color-text-3);
  font-size: 16px;
  margin: 0;
}

.header-right {
  flex-shrink: 0;
  margin-left: 20px;
}

.main-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.vulnlab-list {
  flex: 1;
  min-width: 0;
}

.info-panel {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
}

.panel-section {
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.panel-section h3 {
  margin: 0 0 16px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

/* 筛选器样式 */
.filters {
  margin-bottom: 30px;
  background: var(--color-bg-2);
  border-radius: 12px;
  padding: 20px;
}



.search-input {
  max-width: 400px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0 0 12px 0;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--color-bg-1);
  user-select: none;
  color: var(--color-text-2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-option:hover {
  border-color: var(--color-primary-6);
  background: var(--color-primary-light-1);
  transform: translateY(-1px);
}

.filter-option.active {
  border-color: #1677ff !important;
  background: #e6f4ff !important;
  color: #0958d9 !important;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.15) !important;
}

.filter-option.active .option-icon,
.filter-option.active .option-text {
  color: #0958d9 !important;
}

.option-icon {
  font-size: 14px;
  color: inherit;
}

.option-text {
  font-size: 13px;
  font-weight: 500;
  color: inherit;
}

/* 靶场卡片样式 */
.vulnlab-grid {
  margin-bottom: 30px;
}

.vulnlab-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.vulnlab-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.lab-cover {
  
  background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-6));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}





.lab-content {
  padding: 8px;
}

.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.lab-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-1);
  flex: 1;
  margin-right: 12px;
}

.lab-meta {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.lab-category-difficulty {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.lab-description {
  font-size: 13px;
  color: var(--color-text-3);
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lab-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-3);
  font-size: 12px;
}

.lab-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 使用说明样式 */
.instruction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step {
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

.content {
  font-size: 13px;
  color: var(--color-text-2);
}

/* 热门靶场样式 */
.hot-labs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hot-lab-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.hot-lab-item:hover {
  background: var(--color-fill-2);
}

.hot-lab-rank {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary-6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.hot-lab-info {
  flex: 1;
  min-width: 0;
}

.hot-lab-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 2px;
}

.hot-lab-category {
  font-size: 11px;
  color: var(--color-text-3);
}

.hot-lab-downloads {
  font-size: 11px;
  color: var(--color-text-3);
  flex-shrink: 0;
}

/* 统计信息样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary-6);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-3);
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* 弹窗样式 */
.lab-modal .modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.ml8 { margin-left: 8px; }

.lab-modal .desc {
  color: var(--color-text-2);
  margin-bottom: 20px;
  line-height: 1.6;
}

.lab-details h4,
.lab-tags-section h4 {
  margin: 0 0 12px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-item .label {
  color: var(--color-text-3);
  font-weight: 500;
}

.tags-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.lab-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
  
  .info-panel {
    width: 100%;
    position: static;
  }
  
  .vulnlab-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .lab-actions {
    flex-direction: column;
  }
}
</style>
