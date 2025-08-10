<template>
  <div class="ranking-container">
    <div class="header">
      <h1>排行榜</h1>
      <p>查看全球顶尖CTF选手和团队的排名</p>
    </div>

    <div class="ranking-tabs">
      <a-tabs v-model:active-key="activeTab" @change="onTabChange">
        <a-tab-pane key="personal" title="个人排行">
          <div class="ranking-filters">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-select v-model="personalFilters.timeRange" placeholder="时间范围">
                  <a-option value="all">历史总排行</a-option>
                  <a-option value="month">本月排行</a-option>
                  <a-option value="week">本周排行</a-option>
                </a-select>
              </a-col>
              <a-col :span="6">
                <a-select v-model="personalFilters.category" placeholder="分类" allow-clear>
                  <a-option value="web">Web安全</a-option>
                  <a-option value="crypto">密码学</a-option>
                  <a-option value="pwn">二进制漏洞</a-option>
                  <a-option value="misc">杂项</a-option>
                  <a-option value="reverse">逆向工程</a-option>
                </a-select>
              </a-col>
            </a-row>
          </div>
          <ranking-table :data="personalRanking" type="personal" />
        </a-tab-pane>
        
        <a-tab-pane key="team" title="团队排行">
          <div class="ranking-filters">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-select v-model="teamFilters.timeRange" placeholder="时间范围">
                  <a-option value="all">历史总排行</a-option>
                  <a-option value="month">本月排行</a-option>
                  <a-option value="week">本周排行</a-option>
                </a-select>
              </a-col>
            </a-row>
          </div>
          <ranking-table :data="teamRanking" type="team" />
        </a-tab-pane>
        
        <a-tab-pane key="school" title="院校排行">
          <div class="ranking-filters">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-select v-model="schoolFilters.region" placeholder="地区" allow-clear>
                  <a-option value="beijing">北京</a-option>
                  <a-option value="shanghai">上海</a-option>
                  <a-option value="guangdong">广东</a-option>
                  <a-option value="jiangsu">江苏</a-option>
                  <a-option value="zhejiang">浙江</a-option>
                </a-select>
              </a-col>
            </a-row>
          </div>
          <ranking-table :data="schoolRanking" type="school" />
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 顶部三甲展示 -->
    <div v-if="topThree.length > 0" class="top-three">
      <h2>🏆 本期前三甲</h2>
      <div class="podium">
        <div 
          v-for="(item, index) in topThree" 
          :key="item.id"
          class="podium-item"
          :class="`rank-${index + 1}`"
        >
          <div class="medal">
            <span v-if="index === 0">🥇</span>
            <span v-else-if="index === 1">🥈</span>
            <span v-else>🥉</span>
          </div>
          <a-avatar :size="60" class="avatar">
            <img :src="item.avatar" :alt="item.name" />
          </a-avatar>
          <h3 class="name">{{ item.name }}</h3>
          <p class="score">{{ item.score }} 分</p>
          <div class="stats">
            <span>解题: {{ item.solved }}</span>
            <span>等级: {{ item.level }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import RankingTable from './components/RankingTable.vue'

const activeTab = ref('personal')

// 筛选条件
const personalFilters = reactive({
  timeRange: 'all',
  category: ''
})

const teamFilters = reactive({
  timeRange: 'all'
})

const schoolFilters = reactive({
  region: ''
})

// 个人排行数据
const personalRanking = ref([
  {
    id: 1,
    rank: 1,
    name: 'CyberMaster',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    score: 2850,
    solved: 156,
    level: 'Master',
    school: '清华大学',
    lastActive: '2024-01-15',
    change: 0
  },
  {
    id: 2,
    rank: 2,
    name: 'SecHacker',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    score: 2720,
    solved: 142,
    level: 'Expert',
    school: '北京大学',
    lastActive: '2024-01-15',
    change: 1
  },
  {
    id: 3,
    rank: 3,
    name: 'CodeBreaker',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    score: 2650,
    solved: 134,
    level: 'Expert',
    school: '上海交通大学',
    lastActive: '2024-01-14',
    change: -1
  }
])

// 团队排行数据
const teamRanking = ref([
  {
    id: 1,
    rank: 1,
    name: 'Dragon Team',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    score: 8500,
    members: 5,
    leader: 'CyberMaster',
    school: '清华大学',
    lastActive: '2024-01-15',
    change: 0
  },
  {
    id: 2,
    rank: 2,
    name: 'Phoenix Squad',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    score: 7890,
    members: 4,
    leader: 'SecHacker',
    school: '北京大学',
    lastActive: '2024-01-15',
    change: 1
  }
])

// 院校排行数据
const schoolRanking = ref([
  {
    id: 1,
    rank: 1,
    name: '清华大学',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    score: 15200,
    members: 89,
    region: '北京',
    topStudent: 'CyberMaster',
    change: 0
  },
  {
    id: 2,
    rank: 2,
    name: '北京大学',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    score: 14560,
    members: 76,
    region: '北京',
    topStudent: 'SecHacker',
    change: 1
  }
])

// 前三甲数据
const topThree = computed(() => {
  return personalRanking.value.slice(0, 3)
})

const onTabChange = (key) => {
  console.log('切换到标签:', key)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.ranking-container {
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

.top-three {
  margin-bottom: 40px;
  text-align: center;
}

.top-three h2 {
  margin-bottom: 20px;
  color: var(--color-text-1);
}

.podium {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 20px;
  margin-bottom: 30px;
}

.podium-item {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  background: var(--color-bg-2);
  border: 2px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.podium-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.podium-item.rank-1 {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff9e6, var(--color-bg-2));
  transform: scale(1.1);
}

.podium-item.rank-2 {
  border-color: #c0c0c0;
  background: linear-gradient(135deg, #f5f5f5, var(--color-bg-2));
}

.podium-item.rank-3 {
  border-color: #cd7f32;
  background: linear-gradient(135deg, #fff0e6, var(--color-bg-2));
}

.medal {
  font-size: 24px;
  margin-bottom: 10px;
}

.avatar {
  margin-bottom: 10px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 5px;
}

.score {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary-6);
  margin-bottom: 8px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: var(--color-text-3);
}

.ranking-tabs {
  margin-top: 20px;
}

.ranking-filters {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--color-bg-2);
  border-radius: 8px;
}
</style>
