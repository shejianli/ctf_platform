<template>
  <a-menu-item v-if="item.children === undefined || item.children.length === 1" :key="fullPath">
    <template v-if="item.children !== undefined" #icon>
      <icon-trophy v-if="item.children[0]?.meta?.icon === 'icon-trophy'" />
      <icon-fire v-else-if="item.children[0]?.meta?.icon === 'icon-fire'" />
      <icon-notification v-else-if="item.children[0]?.meta?.icon === 'icon-notification'" />
      <icon-user v-else-if="item.children[0]?.meta?.icon === 'icon-user'" />
      <icon-book v-else-if="item.children[0]?.meta?.icon === 'icon-book'" />
      <icon-bug v-else-if="item.children[0]?.meta?.icon === 'icon-bug'" />
      <icon-sword v-else-if="item.children[0]?.meta?.icon === 'icon-sword'" />
    </template>

    {{ item.children === undefined ? (item.meta?.title || '未知') : (item.children[0]?.meta?.title || '未知') }}
  </a-menu-item>

  <a-sub-menu v-else :key="fullPath">
    <template v-if="item.meta?.icon" #icon>
      <icon-trophy v-if="item.meta.icon === 'icon-trophy'" />
      <icon-fire v-else-if="item.meta.icon === 'icon-fire'" />
      <icon-notification v-else-if="item.meta.icon === 'icon-notification'" />
      <icon-user v-else-if="item.meta.icon === 'icon-user'" />
      <icon-book v-else-if="item.meta.icon === 'icon-book'" />
      <icon-bug v-else-if="item.meta.icon === 'icon-bug'" />
      <icon-sword v-else-if="item.meta.icon === 'icon-sword'" />
    </template>

    <template #title>{{ item.meta?.title || '未知' }}</template>

    <sidebar-item v-for="child in item.children" :key="child.path" :item="child" :parent-path="fullPath" />
  </a-sub-menu>
</template>

<script setup>
import SidebarItem from '.'
import { defineProps, computed } from 'vue'
import { 
  IconTrophy, 
  IconFire, 
  IconNotification, 
  IconUser,
  IconBook,
  IconBug,
  IconSword
} from '@arco-design/web-vue/es/icon'

const props = defineProps({
  item: Object,
  parentPath: String
})

const fullPath = computed(() => {
  if (props.item.children && props.item.children.length === 1) {
    // 对于有单个子路由的情况，返回子路由的完整路径
    return props.item.path + '/' + props.item.children[0].path
  }
  // 对于没有子路由的情况，直接返回路径
  return props.item.path
})
</script>
