<template>
  <div class="ranking-table">
    <a-table 
      :columns="columns" 
      :data="data" 
      :pagination="false"
      row-key="id"
    >
      <template #rank="{ record }">
        <div class="rank-cell">
          <span class="rank-number" :class="getRankClass(record.rank)">
            {{ record.rank }}
          </span>
          <div v-if="record.change !== 0" class="rank-change">
            <icon-arrow-up v-if="record.change > 0" class="change-up" />
            <icon-arrow-down v-if="record.change < 0" class="change-down" />
            <span class="change-text">{{ Math.abs(record.change) }}</span>
          </div>
          <div v-else class="rank-stable">-</div>
        </div>
      </template>

      <template #name="{ record }">
        <div class="name-cell">
          <a-avatar :size="40" class="avatar">
            <img :src="record.avatar" :alt="record.name" />
          </a-avatar>
          <div class="name-info">
            <div class="name">{{ record.name }}</div>
            <div v-if="type === 'personal'" class="level">{{ record.level }}</div>
            <div v-if="type === 'team'" class="leader">队长: {{ record.leader }}</div>
            <div v-if="type === 'school'" class="region">{{ record.region }}</div>
          </div>
        </div>
      </template>

      <template #score="{ record }">
        <div class="score-cell">
          <span class="score-number">{{ record.score.toLocaleString() }}</span>
          <span class="score-label">分</span>
        </div>
      </template>

      <template #stats="{ record }">
        <div class="stats-cell">
          <div v-if="type === 'personal'" class="stat-item">
            <span class="stat-label">解题:</span>
            <span class="stat-value">{{ record.solved }}</span>
          </div>
          <div v-if="type === 'team'" class="stat-item">
            <span class="stat-label">成员:</span>
            <span class="stat-value">{{ record.members }}</span>
          </div>
          <div v-if="type === 'school'" class="stat-item">
            <span class="stat-label">学生:</span>
            <span class="stat-value">{{ record.members }}</span>
          </div>
        </div>
      </template>

      <template #school="{ record }">
        <span class="school-name">{{ record.school }}</span>
      </template>

      <template #lastActive="{ record }">
        <span class="last-active">{{ formatDate(record.lastActive) }}</span>
      </template>

      <template #actions="{ record }">
        <div class="action-buttons">
          <a-button type="text" size="small" @click="viewProfile(record)">
            查看详情
          </a-button>
          <a-button v-if="type === 'personal'" type="text" size="small" @click="followUser(record)">
            关注
          </a-button>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconArrowUp, IconArrowDown } from '@arco-design/web-vue/es/icon'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['personal', 'team', 'school'].includes(value)
  }
})

// 根据类型生成不同的表格列
const columns = computed(() => {
  const baseColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      slotName: 'rank',
      width: 100,
      align: 'center'
    },
    {
      title: props.type === 'personal' ? '用户' : props.type === 'team' ? '团队' : '院校',
      dataIndex: 'name',
      slotName: 'name',
      width: 200
    },
    {
      title: '积分',
      dataIndex: 'score',
      slotName: 'score',
      width: 120,
      align: 'center'
    }
  ]

  if (props.type === 'personal') {
    baseColumns.push(
      {
        title: '统计',
        slotName: 'stats',
        width: 100,
        align: 'center'
      },
      {
        title: '院校',
        dataIndex: 'school',
        slotName: 'school',
        width: 150
      }
    )
  } else if (props.type === 'team') {
    baseColumns.push(
      {
        title: '成员数',
        slotName: 'stats',
        width: 100,
        align: 'center'
      },
      {
        title: '院校',
        dataIndex: 'school',
        slotName: 'school',
        width: 150
      }
    )
  } else if (props.type === 'school') {
    baseColumns.push(
      {
        title: '学生数',
        slotName: 'stats',
        width: 100,
        align: 'center'
      },
      {
        title: '顶尖学生',
        dataIndex: 'topStudent',
        width: 120
      }
    )
  }

  baseColumns.push(
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      slotName: 'lastActive',
      width: 120,
      align: 'center'
    },
    {
      title: '操作',
      slotName: 'actions',
      width: 150,
      align: 'center'
    }
  )

  return baseColumns
})

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  if (rank <= 10) return 'rank-top10'
  return ''
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const viewProfile = (record) => {
  console.log('查看详情:', record)
}

const followUser = (record) => {
  console.log('关注用户:', record)
}
</script>

<style scoped>
.ranking-table {
  background: var(--color-bg-2);
  border-radius: 8px;
  overflow: hidden;
}

.rank-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rank-number {
  font-weight: 700;
  font-size: 16px;
  min-width: 20px;
  text-align: center;
}

.rank-number.rank-first {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.rank-number.rank-second {
  color: #c0c0c0;
  text-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
}

.rank-number.rank-third {
  color: #cd7f32;
  text-shadow: 0 0 10px rgba(205, 127, 50, 0.5);
}

.rank-number.rank-top10 {
  color: var(--color-primary-6);
  font-weight: 600;
}

.rank-change {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.change-up {
  color: var(--color-success-6);
}

.change-down {
  color: var(--color-danger-6);
}

.change-text {
  color: var(--color-text-3);
}

.rank-stable {
  color: var(--color-text-4);
  font-size: 12px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  flex-shrink: 0;
}

.name-info {
  flex: 1;
}

.name {
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: 2px;
}

.level,
.leader,
.region {
  font-size: 12px;
  color: var(--color-text-3);
}

.score-cell {
  text-align: center;
}

.score-number {
  font-weight: 700;
  font-size: 16px;
  color: var(--color-primary-6);
}

.score-label {
  font-size: 12px;
  color: var(--color-text-3);
  margin-left: 2px;
}

.stats-cell {
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-4);
}

.stat-value {
  font-weight: 600;
  color: var(--color-text-2);
}

.school-name {
  color: var(--color-text-2);
}

.last-active {
  color: var(--color-text-3);
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

:deep(.arco-table-th) {
  background-color: var(--color-fill-1);
  font-weight: 600;
}

:deep(.arco-table-tr:hover) {
  background-color: var(--color-fill-1);
}
</style>
