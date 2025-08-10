<template>
  <div class="notice-container">
    <div class="header">
      <h1>通知广告</h1>
      <p>获取最新的平台动态、比赛公告和重要通知</p>
    </div>

    <div class="notice-tabs">
      <a-tabs v-model:active-key="activeTab" @change="onTabChange">
        <a-tab-pane key="all" title="全部通知">
          <notice-list :notices="allNotices" />
        </a-tab-pane>
        
        <a-tab-pane key="important" title="重要公告">
          <notice-list :notices="importantNotices" />
        </a-tab-pane>
        
        <a-tab-pane key="contest" title="比赛通知">
          <notice-list :notices="contestNotices" />
        </a-tab-pane>
        
        <a-tab-pane key="system" title="系统通知">
          <notice-list :notices="systemNotices" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NoticeList from './components/NoticeList.vue'

const activeTab = ref('all')

// 模拟通知数据
const notices = ref([
  {
    id: 1,
    title: '平台升级维护公告',
    content: '为了提供更好的服务体验，平台将于2024年1月20日凌晨2:00-6:00进行系统升级维护，期间可能无法正常访问。',
    type: 'important',
    category: 'system',
    publishTime: '2024-01-15 10:00:00',
    isTop: true,
    readCount: 1250,
    isRead: false
  },
  {
    id: 2,
    title: '全国大学生网络安全大赛开始报名',
    content: '2024年全国大学生网络安全大赛现已开放报名，报名截止时间为1月18日24:00。比赛时间：1月22日-24日。',
    type: 'contest',
    category: 'contest',
    publishTime: '2024-01-14 15:30:00',
    isTop: true,
    readCount: 2100,
    isRead: true
  },
  {
    id: 3,
    title: '新增AI安全挑战题目',
    content: '平台新增了一系列AI安全相关的挑战题目，包括对抗样本生成、模型逆向等方向，欢迎大家挑战。',
    type: 'normal',
    category: 'system',
    publishTime: '2024-01-13 09:15:00',
    isTop: false,
    readCount: 856,
    isRead: false
  },
  {
    id: 4,
    title: '春季新生友谊赛即将开始',
    content: '专为CTF新手准备的友谊赛将于1月20日举行，题目难度适中，欢迎新手参与。',
    type: 'contest',
    category: 'contest',
    publishTime: '2024-01-12 14:20:00',
    isTop: false,
    readCount: 654,
    isRead: true
  },
  {
    id: 5,
    title: '用户协议更新通知',
    content: '根据最新的法律法规要求，我们对用户协议进行了更新，请查看并确认。',
    type: 'important',
    category: 'system',
    publishTime: '2024-01-11 16:45:00',
    isTop: false,
    readCount: 980,
    isRead: false
  },
  {
    id: 6,
    title: '平台安全漏洞悬赏计划',
    content: '我们启动了安全漏洞悬赏计划，欢迎安全研究人员报告平台漏洞，最高奖励10000元。',
    type: 'important',
    category: 'system',
    publishTime: '2024-01-10 11:30:00',
    isTop: false,
    readCount: 1580,
    isRead: true
  }
])

// 计算属性：根据类型过滤通知
const allNotices = computed(() => notices.value)

const importantNotices = computed(() => 
  notices.value.filter(notice => notice.type === 'important')
)

const contestNotices = computed(() => 
  notices.value.filter(notice => notice.category === 'contest')
)

const systemNotices = computed(() => 
  notices.value.filter(notice => notice.category === 'system')
)

const onTabChange = (key) => {
  console.log('切换到标签:', key)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.notice-container {
  padding: 20px;
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

.notice-tabs {
  margin-top: 20px;
}
</style>
