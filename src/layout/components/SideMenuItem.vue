<template>
  <el-submenu v-if="item.children && item.children.length > 0" :index="item.index" :popper-append-to-body="false">
    <template slot="title">
      <i v-if="item.icon" :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </template>
    <template v-for="(child, index) of item.children">
      <SideMenuItem :item="child" :key="index"></SideMenuItem>
    </template>
  </el-submenu>
  <el-menu-item v-else :index="item.index" @click="linkTo()">
    <i v-if="item.icon" :class="item.icon"></i>
    <template slot="title">{{ item.label }}</template>
  </el-menu-item>
</template>

<script>
import {
  MenuItem,
  Submenu
} from 'element-ui'

export default {
  name: 'SideMenuItem',
  components: {
    'el-menu-item': MenuItem,
    'el-submenu': Submenu,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    linkTo() {
      let url = this.item.path
      if (!this.item.path.startsWith('/')) {
        url = '/' + url
      }
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
.el-submenu {
  position: static;
}
</style>
