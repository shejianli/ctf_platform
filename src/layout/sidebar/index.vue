<template>
  <a-menu
    :style="{ width: '220px', height: '100%', flexShrink: 0 }"
    :default-selected-keys="[openedMenu]"
    :auto-open="true"
    @menu-item-click="to"
    show-collapse-button
  >

    <sidebar-item v-for="route in filteredRoutes" :key="route.path" :item="route" parent-path="" />
  </a-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SidebarItem from './sidebar-item'
import { routes } from '@/router'

const $router = useRouter()
const $route = useRoute()

const filteredRoutes = computed(() => routes.filter(i => !i['hidden']))

const openedMenu = computed(() => $route.path)

const to = key => {
  console.log('Navigating to:', key)
  $router.push(key)
}
</script>
