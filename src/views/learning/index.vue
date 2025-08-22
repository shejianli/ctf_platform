<template>
<a-page-header
      :style="{ background: 'var(--color-bg-2)' }"
      title="📚 学习中心"
      subtitle="精选优质学习视频，助你快速提升CTF技能"
      :show-back="false"
  />
  <div class="learning-container">    
    <!-- 推荐学习路径 -->
    <div class="learning-paths">
      <h3>🚀 推荐学习路径</h3>
      <div class="path-cards">
        <div class="path-card">
          <div class="path-header">
            <h4>🌱 新手入门</h4>
            <a-tag color="green">初级</a-tag>
          </div>
          <div class="path-content">
            <p>适合零基础学习者的入门课程，从基础概念开始</p>
            <div class="path-steps">
              <div class="step">1. CTF基础知识</div>
              <div class="step">2. 工具使用入门</div>
              <div class="step">3. 简单题目练习</div>
            </div>
          </div>
          <div class="path-footer">
            <a-button type="primary" size="small">开始学习</a-button>
            <span class="path-duration">预计 2-3 周</span>
          </div>
        </div>
        
        <div class="path-card">
          <div class="path-header">
            <h4>🔥 进阶提升</h4>
            <a-tag color="orange">中级</a-tag>
          </div>
          <div class="path-content">
            <p>深入学习各类安全技术，提升解题能力</p>
            <div class="path-steps">
              <div class="step">1. 专项技能训练</div>
              <div class="step">2. 复杂题目分析</div>
              <div class="step">3. 实战演练</div>
            </div>
          </div>
          <div class="path-footer">
            <a-button type="primary" size="small">开始学习</a-button>
            <span class="path-duration">预计 4-6 周</span>
          </div>
        </div>
        
        <div class="path-card">
          <div class="path-header">
            <h4>⚡ 高手进阶</h4>
            <a-tag color="red">高级</a-tag>
          </div>
          <div class="path-content">
            <p>掌握高级技巧，参与高水平比赛</p>
            <div class="path-steps">
              <div class="step">1. 高级技术研究</div>
              <div class="step">2. 比赛策略分析</div>
              <div class="step">3. 团队协作</div>
            </div>
          </div>
          <div class="path-footer">
            <a-button type="primary" size="small">开始学习</a-button>
            <span class="path-duration">预计 8-12 周</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学习分类筛选 -->
    <div class="learning-categories">
      <div class="category-header">
        <h3>🎯 学习资源</h3>
        <div class="category-filters">
          <a-button-group>
            <a-button 
              v-for="category in categories" 
              :key="category.key"
              :type="learningCategory === category.key ? 'primary' : 'default'"
              @click="learningCategory = category.key"
            >
              {{ category.icon }} {{ category.label }}
            </a-button>
          </a-button-group>
        </div>
      </div>
      
      <!-- 视频网格 -->
      <div class="video-grid">
        <div 
          v-for="video in filteredVideos" 
          :key="video.id"
          class="video-card"
          @click="playVideo(video)"
        >
          <div class="video-thumbnail">
            <img :src="video.thumbnail" :alt="video.title" />
            <div class="video-duration">{{ video.duration }}</div>
            <div class="play-button">▶️</div>
          </div>
          <div class="video-info">
            <h4 class="video-title">{{ video.title }}</h4>
            <p class="video-description">{{ video.description }}</p>
            <div class="video-meta">
              <span class="video-author">{{ video.author }}</span>
              <span class="video-views">{{ video.views }}次观看</span>
              <span class="video-date">{{ video.date }}</span>
            </div>
            <div class="video-tags">
              <a-tag v-for="tag in video.tags" :key="tag" size="small" color="blue">
                {{ tag }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const learningCategory = ref('all')

// 分类数据
const categories = ref([
  { key: 'all', label: '全部', icon: '🌟' },
  { key: 'web', label: 'Web安全', icon: '🌐' },
  { key: 'crypto', label: '密码学', icon: '🔐' },
  { key: 'pwn', label: 'PWN漏洞', icon: '💥' },
  { key: 'reverse', label: '逆向工程', icon: '🔄' },
  { key: 'stego', label: '隐写术', icon: '📁' }
])

// 学习视频数据
const learningVideos = ref([
  {
    id: 1,
    title: 'CTF入门基础 - 什么是CTF？',
    description: '详细介绍CTF比赛的基本概念、类型和参与方式，适合零基础学习者',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '15:30',
    author: 'CTF大师',
    views: 1250,
    date: '2024-01-10',
    category: 'all',
    tags: ['入门', '基础', '概念']
  },
  {
    id: 2,
    title: 'Web安全入门 - SQL注入详解',
    description: '从零开始学习SQL注入，包含基础原理、常见类型和防护方法',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '28:45',
    author: 'Web安全专家',
    views: 890,
    date: '2024-01-12',
    category: 'web',
    tags: ['Web安全', 'SQL注入', '数据库']
  },
  {
    id: 3,
    title: 'XSS跨站脚本攻击实战',
    description: '深入讲解XSS攻击的原理、类型和利用方法，包含实际案例演示',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '32:15',
    author: '安全研究员',
    views: 756,
    date: '2024-01-14',
    category: 'web',
    tags: ['XSS', '跨站脚本', 'Web安全']
  },
  {
    id: 4,
    title: '密码学基础 - 对称加密算法',
    description: '学习对称加密的基本概念，包括DES、AES等经典算法的原理和应用',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '25:20',
    author: '密码学专家',
    views: 634,
    date: '2024-01-15',
    category: 'crypto',
    tags: ['密码学', '对称加密', 'DES', 'AES']
  },
  {
    id: 5,
    title: 'RSA非对称加密详解',
    description: '深入理解RSA算法的数学原理、密钥生成过程和安全性分析',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '35:10',
    author: '数学博士',
    views: 521,
    date: '2024-01-16',
    category: 'crypto',
    tags: ['RSA', '非对称加密', '数学原理']
  },
  {
    id: 6,
    title: 'PWN基础 - 缓冲区溢出入门',
    description: '学习缓冲区溢出的基本原理，包括栈溢出、堆溢出等常见漏洞类型',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '40:25',
    author: 'PWN大师',
    views: 445,
    date: '2024-01-17',
    category: 'pwn',
    tags: ['PWN', '缓冲区溢出', '栈溢出', '堆溢出']
  },
  {
    id: 7,
    title: '逆向工程基础 - IDA Pro使用教程',
    description: '学习使用IDA Pro进行逆向分析，包括静态分析和动态调试技巧',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '38:15',
    author: '逆向工程师',
    views: 398,
    date: '2024-01-18',
    category: 'reverse',
    tags: ['逆向工程', 'IDA Pro', '静态分析', '动态调试']
  },
  {
    id: 8,
    title: '隐写术入门 - 图片隐写技术',
    description: '学习各种图片隐写技术，包括LSB隐写、DCT隐写等方法的原理和实现',
    thumbnail: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
    duration: '22:30',
    author: '隐写术专家',
    views: 312,
    date: '2024-01-19',
    category: 'stego',
    tags: ['隐写术', '图片隐写', 'LSB', 'DCT']
  }
])

// 根据分类筛选视频
const filteredVideos = computed(() => {
  if (learningCategory.value === 'all') {
    return learningVideos.value
  }
  return learningVideos.value.filter(video => video.category === learningCategory.value)
})

// 根据分类获取视频
const getVideosByCategory = (category) => {
  if (category === 'all') {
    return learningVideos.value
  }
  return learningVideos.value.filter(video => video.category === category)
}

// 播放视频
const playVideo = (video) => {
  console.log('播放视频:', video.title)
  // 这里可以打开视频播放器或跳转到视频页面
  alert(`正在播放: ${video.title}`)
}
</script>

<style scoped>
.learning-container {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: 100vh;
}

/* PageHeader样式 */
.learning-page-header {
  margin-bottom: 24px;
}

.learning-page-header :deep(.arco-page-header-header) {
  padding: 16px 0;
}

.learning-page-header :deep(.arco-page-header-title) {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.learning-page-header :deep(.arco-page-header-subtitle) {
  font-size: 16px;
  color: var(--color-text-2);
  margin-top: 8px;
}

.learning-categories {
  margin-top: 40px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.category-header h3 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 20px;
  font-weight: 600;
}

.category-filters {
  display: flex;
  gap: 8px;
}

.category-filters .arco-btn-group {
  border-radius: 8px;
  overflow: hidden;
}

.category-filters .arco-btn {
  border-radius: 0;
  padding: 8px 16px;
  font-size: 14px;
}

.category-filters .arco-btn:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.category-filters .arco-btn:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

/* 视频网格样式 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.video-card {
  background: var(--color-bg-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .play-button {
  opacity: 1;
}

.video-info {
  padding: 16px;
}

.video-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-description {
  margin: 0 0 12px 0;
  color: var(--color-text-2);
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--color-text-3);
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 学习路径样式 */
.learning-paths {
  margin-bottom: 40px;
}

.learning-paths h3 {
  text-align: center;
  margin-bottom: 24px;
  color: var(--color-text-1);
  font-size: 20px;
  font-weight: 600;
}

.path-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.path-card {
  background: var(--color-bg-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  transition: all 0.3s ease;
}

.path-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.path-header h4 {
  margin: 0;
  color: var(--color-text-1);
  font-size: 18px;
  font-weight: 600;
}

.path-content {
  margin-bottom: 20px;
}

.path-content p {
  margin: 0 0 16px 0;
  color: var(--color-text-2);
  line-height: 1.5;
}

.path-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step {
  padding: 8px 12px;
  background: var(--color-fill-2);
  border-radius: 4px;
  color: var(--color-text-2);
  font-size: 14px;
}

.path-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.path-duration {
  color: var(--color-text-3);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .path-cards {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .learning-container {
    padding: 16px;
  }
  
  .learning-page-header :deep(.arco-page-header-title) {
    font-size: 20px;
  }
  
  .learning-page-header :deep(.arco-page-header-subtitle) {
    font-size: 14px;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .path-cards {
    grid-template-columns: 1fr;
  }
}
</style>
