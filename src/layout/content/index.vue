<template>
  <div class="main-layout">
    <!-- 主内容区域 -->
    <div class="main-content">
      <navbar />
      <div class="page-content">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/layout/navbar'
</script>

<style scoped>
.main-layout {
  height: 100vh;
  width: 100vw;
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--color-bg-1);
  padding: 20px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
