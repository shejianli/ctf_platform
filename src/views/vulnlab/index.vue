<template>
  <div class="vulnlab-container">
    <div class="header-row">
      <div class="header-left">
        <h1>🔥 漏洞靶场</h1>
        <p>下载真实漏洞环境或在线启动靶场，提升实战渗透能力</p>
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
                @click="() => { filters.category = ''; resetPagination(); fetchVulnLabs(); }"
              >
                <span class="option-icon">📋</span>
                <span class="option-text">全部</span>
              </div>
              <div
                v-for="category in categories"
                :key="category.ID"
                class="filter-option"
                :class="{ active: filters.category === category.ID }"
                @click="() => { filters.category = category.ID; resetPagination(); fetchVulnLabs(); }"
              >
                <span class="option-icon">📚</span>
                <span class="option-text">{{ category.name }}</span>
              </div>
            </div>
          </div>

          <!-- 靶场类型筛选 -->
          <div class="filter-section">
            <h4 class="filter-title">靶场类型</h4>
            <div class="filter-options">
              <div
                class="filter-option"
                :class="{ active: filters.type === '' }"
                @click="() => { filters.type = ''; resetPagination(); fetchVulnLabs(); }"
              >
                <span class="option-icon">📋</span>
                <span class="option-text">全部</span>
              </div>
              <div
                class="filter-option"
                :class="{ active: filters.type === 'online' }"
                @click="() => { filters.type = 'online'; resetPagination(); fetchVulnLabs(); }"
              >
                <span class="option-icon">🚀</span>
                <span class="option-text">在线启动</span>
              </div>
              <div
                class="filter-option"
                :class="{ active: filters.type === 'download' }"
                @click="() => { filters.type = 'download'; resetPagination(); fetchVulnLabs(); }"
              >
                <span class="option-icon">💾</span>
                <span class="option-text">下载型</span>
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
                @click="() => { filters.difficulty = ''; resetPagination(); fetchVulnLabs(); }"
              >
                <span class="option-icon">📊</span>
                <span class="option-text">全部</span>
              </div>
              <div
                v-for="difficulty in difficulties"
                :key="difficulty.ID"
                class="filter-option"
                :class="{
                  active: filters.difficulty === difficulty.ID,
                  'difficulty-easy': difficulty.name === '简单',
                  'difficulty-medium': difficulty.name === '中等',
                  'difficulty-hard': difficulty.name === '困难',
                  'difficulty-expert': difficulty.name === '魔鬼'
                }"
                @click="() => { filters.difficulty = difficulty.ID; resetPagination(); fetchVulnLabs(); }"
              >
                <span class="option-icon">
                  {{ difficulty.name === '简单' ? '🟢' : difficulty.name === '中等' ? '🟡' : difficulty.name === '困难' ? '🔴' : '💀' }}
                </span>
                <span class="option-text">{{ difficulty.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 靶场列表 -->
        <div class="vulnlab-grid">
          <a-spin :loading="loading" tip="加载中...">
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

                    <p class="lab-description" :title="lab.description">{{ lab.description }}</p>

                    <div class="lab-info">
                      <div class="info-item" v-if="lab.type === 'download'">
                        <icon-download />
                        <span>{{ lab.downloads }}次下载</span>
                      </div>
                      <div class="info-item" v-if="lab.type === 'download'">
                        <icon-clock-circle />
                        <span>{{ lab.size }}MB</span>
                      </div>
                      <div class="info-item" v-if="lab.type === 'online'">
                        <icon-user />
                        <span>{{ lab.solved }}人解决</span>
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
                    <a-button
                      v-if="lab.type === 'download'"
                      type="primary"
                      @click="downloadLab(lab)"
                    >
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
          </a-spin>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <a-pagination
            v-model:current="pagination.current"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            :show-size-changer="false"
            show-jumper
            show-total
            @change="onPageChange"
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
              <div class="content">选择靶场类型（在线启动或下载）</div>
            </div>
            <div class="instruction-item">
              <div class="step">2</div>
              <div class="content">在线靶场：点击启动，等待启动完成后连接</div>
            </div>
            <div class="instruction-item">
              <div class="step">3</div>
              <div class="content">下载型靶场：下载虚拟机文件并导入</div>
            </div>
            <div class="instruction-item">
              <div class="step">4</div>
              <div class="content">开始渗透测试，获取 root 权限或 flag</div>
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
          <h3>🚀 在线靶场管理</h3>
          <div class="online-labs">
            <div
              v-for="lab in onlineLabs"
              :key="lab.id"
              class="online-lab-item"
            >
              <div class="online-lab-info">
                <div class="online-lab-name">{{ lab.name }}</div>
                <div class="online-lab-status">
                  <span
                    class="status-dot"
                    :class="{ 'running': lab.isRunning, 'stopped': !lab.isRunning }"
                  ></span>
                  {{ lab.isRunning ? '运行中' : '已停止' }}
                </div>
              </div>
              <div class="online-lab-actions">
                <a-button
                  v-if="!lab.isRunning"
                  size="small"
                  type="primary"
                  :loading="lab.starting"
                  @click="startOnlineLab(lab)"
                >
                  启动
                </a-button>
                <a-button
                  v-else
                  size="small"
                  @click="showInstanceInfo(lab)"
                >
                  连接
                </a-button>
              </div>
            </div>
            <div v-if="onlineLabs.length === 0" class="no-online-labs">
              暂无在线靶场
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
              <div class="stat-label">下载型靶场下载量</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalSolved }}</div>
              <div class="stat-label">总解决数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ onlineLabs.length }}</div>
              <div class="stat-label">在线靶场</div>
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
                <span class="label">{{ selectedLab.type === 'online' ? '靶场状态：' : '文件大小：' }}</span>
                <span v-if="selectedLab.type === 'online'">
                  <a-tag :color="selectedLab.isRunning ? 'green' : 'orange'">
                    {{ selectedLab.isRunning ? '🟢 运行中' : '⚪ 未启动' }}
                  </a-tag>
                </span>
                <span v-else>{{ selectedLab.size }}</span>
              </div>
              <div class="detail-item" v-if="selectedLab.type === 'download'">
                <span class="label">下载次数：</span>
                <span>{{ selectedLab.downloads }}</span>
              </div>
              <div class="detail-item" v-if="selectedLab.type === 'online' && selectedLab.isRunning">
                <span class="label">启动时间：</span>
                <span>{{ selectedLab.instanceInfo?.startTime || '未知' }}</span>
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
            <a-button
              v-if="selectedLab.type === 'download'"
              type="primary"
              size="large"
              @click="downloadLab(selectedLab)"
            >
              <icon-download />
              下载靶场
            </a-button>
            <a-button
              v-if="selectedLab.type === 'online' && !selectedLab.isRunning"
              type="primary"
              size="large"
              :loading="selectedLab.starting"
              @click="startOnlineLab(selectedLab)"
            >
              <icon-play-circle />
              启动靶场
            </a-button>
            <a-button
              v-if="selectedLab.type === 'online' && selectedLab.isRunning"
              type="primary"
              size="large"
              @click="showInstanceInfo(selectedLab)"
            >
              <icon-play-circle />
              连接靶场
            </a-button>
            <a-button size="large" @click="viewWriteup(selectedLab)">
              <icon-book />
              查看题解
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 在线靶场实例信息弹窗 -->
    <a-modal
      v-model:visible="isInstanceModalVisible"
      title="靶场连接信息"
      :width="600"
      :footer="false"
      unmount-on-close
    >
      <div v-if="selectedInstance" class="instance-modal">
        <div class="instance-status">
          <a-tag size="large" color="green">🟢 运行中</a-tag>
          <span class="start-time">启动时间: {{ selectedInstance.startTime }}</span>
        </div>

        <div class="connection-info">
          <h4>🌐 Web访问</h4>
          <div class="info-item">
            <span class="label">访问地址:</span>
            <a :href="selectedInstance.accessUrl" target="_blank" class="access-url">
              {{ selectedInstance.accessUrl }}
            </a>
          </div>
          <div class="info-item">
            <span class="label">用户名:</span>
            <span>{{ selectedInstance.webInfo.username }}</span>
          </div>
          <div class="info-item">
            <span class="label">密码:</span>
            <span>{{ selectedInstance.webInfo.password }}</span>
          </div>
        </div>

        <div class="connection-info">
          <h4>🔑 SSH连接</h4>
          <div class="info-item">
            <span class="label">主机地址:</span>
            <span>{{ selectedInstance.sshInfo.host }}</span>
          </div>
          <div class="info-item">
            <span class="label">端口:</span>
            <span>{{ selectedInstance.sshInfo.port }}</span>
          </div>
          <div class="info-item">
            <span class="label">用户名:</span>
            <span>{{ selectedInstance.sshInfo.username }}</span>
          </div>
          <div class="info-item">
            <span class="label">密码:</span>
            <span>{{ selectedInstance.sshInfo.password }}</span>
          </div>
        </div>

        <div class="instance-actions">
          <a-button type="primary" @click="copyConnectionInfo">
            <icon-copy />
            复制连接信息
          </a-button>
          <a-button @click="stopInstance">
            <icon-stop />
            停止靶场
          </a-button>
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
  IconBook,
  IconPlayCircle,
  IconCopy,
  IconStop
} from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import {
  getVulnLabs,
} from '@/api/vulnlab'
import { getDifficultyLevels, getQuestionClasses } from '@/api/practice'

// 筛选条件
const filters = reactive({
  category: '', // 分类ID
  difficulty: '', // 难度ID
  type: '', // 环境类型
  search: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 9,
  total: 0
})

// 靶场数据
const vulnLabs = ref([])
const loading = ref(false)

// 分类和难度数据
const categories = ref([])
const difficulties = ref([])
const categoriesLoading = ref(false)
const difficultiesLoading = ref(false)

// 热门靶场
const hotLabs = computed(() => {
  return vulnLabs.value
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 5)
    .map((lab, index) => ({
      ...lab,
      rank: index + 1
    }))
})

// 数据获取函数
const fetchVulnLabs = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize
    }

    // 添加筛选参数
    if (filters.search) {
      params.name = filters.search
    }
    if (filters.category) {
      params.categoryId = filters.category
    }
    if (filters.difficulty) {
      params.difficultyLevelId = filters.difficulty
    }
    if (filters.type) {
      params.environmentType = filters.type === 'online' ? 1 : 2
    }

    const response = await getVulnLabs(params)
    if (response.data.code === 0) {
      vulnLabs.value = response.data.data.list.map(lab => ({
        ...lab,
        // 映射API字段到前端字段
        id: lab.ID,
        name: lab.name,
        description: lab.description || '',
        category: lab.questionClass?.ID || lab.categoryId,
        difficulty: lab.difficultyLevel?.ID || lab.difficultyLevelId,
        type: lab.environmentType === 1 ? 'online' : 'download',
        status: 'active',
        downloads: lab.downloadCount || 0,
        solved: lab.solved || 0,
        size: lab.environmentType === 1 ? '在线' : `${lab.size || 0}MB`,
        tags: lab.tag ? lab.tag.split(',').map(t => t.trim()) : [],
        os: lab.os === '1' ? 'Linux' : 'Windows',
        firstBlood: false,
        isRunning: false,
        starting: false,
        instanceInfo: null,
        createdAt: lab.CreatedAt,
        updatedAt: lab.UpdatedAt
      }))
      pagination.total = response.data.data.total
    } else {
      Message.error(response.data.msg || '获取靶场列表失败')
      vulnLabs.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取靶场列表失败:', error)
    Message.error('获取靶场列表失败')
    vulnLabs.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 获取分类数据
const fetchCategories = async () => {
  try {
    categoriesLoading.value = true
    const response = await getQuestionClasses({"page": 1,"pageSize": 1000,"category": 'vuln'})
    if (response.data.code === 0) {
      // 过滤出vuln类别的分类，因为这是漏洞靶场
      categories.value = (response.data.data?.list || [])
      console.log('获取到的分类数据:', categories.value)
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  } finally {
    categoriesLoading.value = false
  }
}

// 获取难度数据
const fetchDifficulties = async () => {
  try {
    difficultiesLoading.value = true
    const response = await getDifficultyLevels({"page": 1,"pageSize": 1000,"category": 'vuln'})
    console.log(response)
    if (response.data.code === 0) {
      // 过滤出vuln类别的难度等级
      difficulties.value = (response.data.data?.list || [])
      console.log('获取到的难度数据:', difficulties.value)
    }
  } catch (error) {
    console.error('获取难度失败:', error)
  } finally {
    difficultiesLoading.value = false
  }
}









// 统计信息
const totalLabs = computed(() => vulnLabs.value.length)
const totalDownloads = computed(() => vulnLabs.value.filter(lab => lab.type === 'download').reduce((sum, lab) => sum + lab.downloads, 0))
const totalSolved = computed(() => vulnLabs.value.reduce((sum, lab) => sum + lab.solved, 0))

// 在线靶场列表
const onlineLabs = computed(() => {
  return vulnLabs.value.filter(lab => lab.type === 'online')
})

// 过滤后的靶场
const filteredLabs = computed(() => {
  let result = vulnLabs.value

  // 分类筛选
  if (filters.category) {
    result = result.filter(lab => lab.questionClass?.ID === filters.category || lab.category === filters.category)
  }

  // 难度筛选
  if (filters.difficulty) {
    result = result.filter(lab => lab.difficultyLevel?.ID === filters.difficulty || lab.difficulty === filters.difficulty)
  }

  // 类型筛选
  if (filters.type) {
    result = result.filter(lab => lab.type === filters.type)
  }

  // 搜索筛选
  if (filters.search) {
    const search = filters.search.toLowerCase()
    result = result.filter(lab =>
      lab.name.toLowerCase().includes(search) ||
      lab.description.toLowerCase().includes(search) ||
      (lab.tags && lab.tags.some(tag => tag.toLowerCase().includes(search)))
    )
  }

  return result
})

// 获取分类名称
const getCategoryName = (categoryId) => {
  if (!categoryId) return '未知分类'
  // 先从靶场数据中查找，如果没有再从分类列表中查找
  const lab = vulnLabs.value.find(l => l.questionClass?.ID === categoryId)
  if (lab?.questionClass?.name) {
    return lab.questionClass.name
  }
  const category = categories.value.find(c => c.ID === categoryId)
  return category ? category.name : `分类${categoryId}`
}

// 获取难度名称
const getDifficultyName = (difficultyId) => {
  if (!difficultyId) return '未知难度'
  // 先从靶场数据中查找，如果没有再从难度列表中查找
  const lab = vulnLabs.value.find(l => l.difficultyLevel?.ID === difficultyId)
  if (lab?.difficultyLevel?.name) {
    return lab.difficultyLevel.name
  }
  const difficulty = difficulties.value.find(d => d.ID === difficultyId)
  return difficulty ? difficulty.name : `难度${difficultyId}`
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
  resetPagination()
  fetchVulnLabs()
}

// 分页改变
const onPageChange = (page) => {
  pagination.current = page
  fetchVulnLabs()
}

// 筛选条件改变时重置分页
const resetPagination = () => {
  pagination.current = 1
}

// 弹窗相关
const isLabModalVisible = ref(false)
const selectedLab = ref(null)
const isInstanceModalVisible = ref(false)
const selectedInstance = ref(null)

// 打开靶场详情
const openLab = (lab) => {
  selectedLab.value = lab
  isLabModalVisible.value = true
}

// 下载靶场
const downloadLab = async (lab) => {
  try {
    console.log('下载靶场:', lab.name)
    Message.success(`靶场 ${lab.name} 下载开始`)
  } catch (error) {
    console.error('下载靶场失败:', error)
    Message.error('下载靶场失败')
  }
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

// 在线启动靶场
const startOnlineLab = async (lab) => {
  if (lab.isRunning) {
    // 如果靶场已经在运行，显示连接信息
    showInstanceInfo(lab)
    return
  }

  try {
    lab.starting = true
    console.log('启动在线靶场:', lab.name)

    // 模拟启动成功
    setTimeout(() => {
      lab.isRunning = true
      lab.starting = false
      lab.instanceInfo = {
        id: Date.now(),
        startTime: new Date().toLocaleString(),
        accessUrl: 'http://localhost:8080',
        webInfo: { username: 'admin', password: 'admin' },
        sshInfo: { host: 'localhost', port: 22, username: 'root', password: 'password' }
      }
      Message.success(`靶场 ${lab.name} 启动成功！`)
    }, 2000)

  } catch (error) {
    console.error('启动靶场失败:', error)
    lab.starting = false
    Message.error(`启动靶场失败: ${error.message}`)
  }
}

// 显示靶场实例信息
const showInstanceInfo = (lab) => {
  if (!lab.instanceInfo) return

  selectedInstance.value = lab.instanceInfo
  isInstanceModalVisible.value = true
}

// 复制连接信息
const copyConnectionInfo = () => {
  if (!selectedInstance.value) return

  const info = `
靶场连接信息:
Web访问: ${selectedInstance.value.accessUrl}
用户名: ${selectedInstance.value.webInfo.username}
密码: ${selectedInstance.value.webInfo.password}

SSH连接:
主机: ${selectedInstance.value.sshInfo.host}:${selectedInstance.value.sshInfo.port}
用户名: ${selectedInstance.value.sshInfo.username}
密码: ${selectedInstance.value.sshInfo.password}
  `.trim()

  navigator.clipboard.writeText(info).then(() => {
    Message.success('连接信息已复制到剪贴板')
  }).catch(() => {
    Message.error('复制失败，请手动复制')
  })
}

// 停止靶场实例
const stopInstance = async () => {
  if (!selectedInstance.value) return

  try {
    console.log('停止靶场实例:', selectedInstance.value.id)

    // 找到对应的靶场
    const lab = vulnLabs.value.find(l => l.instanceInfo?.id === selectedInstance.value.id)
    if (!lab) {
      throw new Error('未找到对应的靶场')
    }

    // 模拟停止成功
    lab.isRunning = false
    lab.instanceInfo = null

    Message.success('靶场已停止')
    isInstanceModalVisible.value = false

  } catch (error) {
    console.error('停止靶场失败:', error)
    Message.error(`停止靶场失败: ${error.message}`)
  }
}

onMounted(() => {
  // 初始化数据
  fetchCategories()
  fetchDifficulties()
  fetchVulnLabs()
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
  display: flex;
  flex-direction: column;
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
  padding: 8px; /* 增加内边距，让内容更宽松 */
  flex: 1;
  display: flex;
  flex-direction: column;
}

.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px; /* 减少底部间距 */
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
  margin-bottom: 4px; /* 减少底部间距 */
}

.lab-description {
  font-size: 13px;
  color: var(--color-text-3);
  margin-bottom: 12px; /* 增加底部间距，让描述和下面信息更宽松 */
  line-height: 1.4;
  height: 18px; /* 固定高度：13px * 1.4 = 18.2px */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.lab-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* 增加底部间距，让信息区域和标签更宽松 */
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
  gap: 6px; /* 增加标签间距，让标签更宽松 */
  flex-wrap: wrap;
  flex-grow: 1;
  align-items: flex-end;
  margin-bottom: 6px; /* 增加底部间距 */
  max-height: 24px; /* 限制标签区域最大高度 */
  overflow: hidden;
}

/* 确保操作按钮固定在底部 */
.vulnlab-card :deep(.arco-card-actions) {
  margin-top: auto;
  padding-top: 8px; /* 减少顶部padding */
  border-top: 1px solid var(--color-border);
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

/* 在线靶场管理样式 */
.online-labs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.online-lab-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-1);
}

.online-lab-info {
  flex: 1;
  min-width: 0;
}

.online-lab-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 4px;
}

.online-lab-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-text-3);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-4);
}

.status-dot.running {
  background: #52c41a;
}

.status-dot.stopped {
  background: var(--color-text-4);
}

.online-lab-actions {
  flex-shrink: 0;
}

.no-online-labs {
  text-align: center;
  color: var(--color-text-3);
  font-size: 12px;
  padding: 20px 0;
}

/* 统计信息样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

/* 实例弹窗样式 */
.instance-modal .instance-status {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.start-time {
  color: var(--color-text-3);
  font-size: 14px;
}

.connection-info {
  margin-bottom: 20px;
}

.connection-info h4 {
  margin: 0 0 12px 0;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 600;
}

.connection-info .info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-fill-3);
}

.connection-info .label {
  color: var(--color-text-3);
  font-weight: 500;
  min-width: 80px;
}

.access-url {
  color: var(--color-primary-6);
  text-decoration: none;
}

.access-url:hover {
  text-decoration: underline;
}

.instance-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
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
