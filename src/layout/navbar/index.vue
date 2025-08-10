<template>
  <div class="navbar">
    <div class="side-left">
      <div style="height: 38px"><img src="@/assets/icon.svg" /></div>
      <h5 class="arco-typography brand">CTF平台</h5>
    </div>

    <div class="nav-menu">
      <a-menu mode="horizontal" :selected-keys="[currentRoute]" @menu-item-click="onNavClick">
        <a-menu-item key="practice">练习场</a-menu-item>
        <a-menu-item key="contest">赛事中心</a-menu-item>
        <a-menu-item key="notice">通知广告</a-menu-item>
        <a-menu-item key="ranking">排行榜</a-menu-item>
      </a-menu>
    </div>

    <ul class="side-right">
      <li>
        <a-dropdown @select="onMenuClick">
          <a-avatar :size="32">
            <img
              alt="avatar"
              src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
            />
          </a-avatar>

          <template #content>
            <a-doption>个人中心</a-doption>
            <a-doption>退出登录</a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const $store = useStore()
const $router = useRouter()
const $route = useRoute()

// 当前路由，用于菜单高亮
const currentRoute = computed(() => {
  const path = $route.path
  if (path.includes('/practice')) return 'practice'
  if (path.includes('/contest')) return 'contest'
  if (path.includes('/notice')) return 'notice'
  if (path.includes('/ranking')) return 'ranking'
  return ''
})

// 处理导航菜单点击
const onNavClick = (key) => {
  switch (key) {
    case 'practice':
      $router.push('/practice')
      break
    case 'contest':
      $router.push('/contest')
      break
    case 'notice':
      $router.push('/notice')
      break
    case 'ranking':
      $router.push('/ranking')
      break
  }
}

// 处理用户菜单点击
const onMenuClick = async v => {
  switch (v) {
    case '退出登录':
      await $store.dispatch('user/logout')
      await $router.replace('/login')
      break
    case '个人中心':
      $router.push('/profile')
      break
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.side-left {
  display: flex;
  align-items: center;
  padding-left: 20px;
  flex-shrink: 0;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-menu :deep(.arco-menu) {
  background-color: transparent;
  border-bottom: none;
}

.nav-menu :deep(.arco-menu-horizontal .arco-menu-item) {
  padding: 0 20px;
  margin: 0 5px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-menu :deep(.arco-menu-horizontal .arco-menu-item:hover) {
  background-color: var(--color-fill-2);
}

.nav-menu :deep(.arco-menu-horizontal .arco-menu-item.arco-menu-selected) {
  background-color: var(--color-primary-light-1);
  color: var(--color-primary-6);
}

.side-right {
  display: flex;
  align-items: center;
  padding-right: 20px;
  list-style: none;
  flex-shrink: 0;
}

.brand {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 0 8px;
  color: var(--color-primary-6);
}
</style>
