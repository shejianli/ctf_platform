<template>
  <div class="page-wrapper">
    <navbar />

    <div class="content-wrapper">
      <transition name="fade-transform" mode="out-in">
        <router-view class="content" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/layout/navbar'
</script>

<style scoped>
.page-wrapper {
  box-sizing: border-box;
  padding-top: 50px;
  width: 100%;
  height: 100vh;
  background-color: var(--color-bg-1);
}

.content-wrapper {
  width: 100%;
  height: calc(100vh - 50px);
}

.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-bg-1);
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
