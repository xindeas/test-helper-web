<template>
  <div class="layout full-content">
    <el-container class="full-content">
      <el-aside width="auto">
        <el-scrollbar class="full-height scroll-bar">
          <SideMenu :menu="menuList"/>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <HeaderBar/>
        <el-main class="layout-main">
          <div class="tabs-bar">
            <template v-for="(item, index) of curTabs">
              <div :class="{'tab-item': true, 'current': item.name === curRoute.name}"
                   :key="index"
                   @click="jumpTo(item)">
                {{ item.meta.title }}
                <i class="el-icon-close"
                   v-if="item.name !== 'Home'"
                   @click.stop="closeTab(item.name)"></i>
              </div>
            </template>
          </div>
          <div class="router-content">
            <transition name="mainRouter">
              <keep-alive :include="curTabsName">
                <router-view :key="curRoute.path"/>
              </keep-alive>
            </transition>
          </div>
        </el-main>
        <el-footer class="layout-footer">测试工具V{{ version }}</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideMenu from '@/layout/components/SideMenu';
import HeaderBar from '@/layout/components/HeaderBar';
import config from '../../package.json'
import {Aside, Container, Footer, Main, Scrollbar} from 'element-ui'

export default {
  name: 'Layout',
  components: {
    SideMenu,
    HeaderBar,
    'el-container': Container,
    'el-aside': Aside,
    'el-main': Main,
    'el-footer': Footer,
    'el-scrollbar': Scrollbar
  },
  data() {
    return {
      subscriber: "",
      closeTabScriber: "",
      menuList: [
        {
          label: '项目',
          index: 'Project',
          path: 'Project',
          icon: 'el-icon-folder-opened',
          children: [
            {
              label: '我的项目',
              index: 'MyProject',
              path: '/Project/MyProject',
              icon: 'el-icon-folder-opened',
            },
            {
              label: '项目模块',
              index: 'ProjectModule',
              path: '/Project/ProjectModule',
              icon: 'el-icon-s-grid',
            },
          ]
        },
        {
          label: '缺陷管理',
          index: 'Defect',
          path: 'Defect',
          icon: 'el-icon-date',
          children: []
        },
        {
          label: '工作台',
          index: 'WorkBench',
          path: 'WorkBench',
          icon: 'el-icon-files',
          children: []
        },
        {
          label: '测试用例',
          index: 'TestCase',
          path: 'TestCase',
          icon: 'el-icon-notebook-1',
          children: []
        },
        {
          label: '用户管理',
          index: 'User',
          path: 'User',
          icon: 'el-icon-user',
          children: []
        },
        {
          label: '代码生成',
          index: 'CodeCreator',
          path: 'CodeCreator',
          icon: 'el-icon-cpu',
          children: []
        }
      ]
    }
  },
  computed: {
    collapse: {
      get() {
        return this.$store.state.collapse
      },
      set(v) {
        this.$store.commit('setCollapse', v)
      }
    },
    user() {
      return this.$cookies.get('user')
    },
    curTabs() {
      return this.$store.state.router.curTabs;
    },
    curTabsName() {
      return this.$store.state.router.curTabs.map(item => item.name);
    },
    curRoute() {
      return this.$route
    },
    version() {
      return config.version;
    }
  },
  methods: {
    jumpTo(item) {
      if (item.path === this.curRoute.path) {
        return;
      }
      this.$router.push(item)
    },
    closeCurTab() {
      this.closeTab(this.curRoute.name);
    },
    closeTab(name) {
      const arr = this.curTabs.filter(item => item.name !== name);
      this.$store.commit('router/setCurTabs', arr);
      if (name === this.curRoute.name && arr.length > 0) {
        this.$router.push(arr[arr.length - 1].path);
      } else if (name === this.curRoute.name && arr.length <= 0) {
        this.$router.push("/Home");
      }
    }
  },
}
</script>
<style>
.layout {
  overflow: hidden;
}

.el-aside {
  box-shadow: 0 0 1em #999999;
}

.scroll-bar {
  overflow-x: hidden;
}

.layout-header {
  padding: 0;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.layout-header > * {
  cursor: pointer;
}

.layout-header .fold {
  margin: 0 .5em;
  font-size: 1.5em;
  transform: rotate(0);
  transition: all 250ms;
}

.layout-header .un-fold {
  margin: 0 .5em;
  font-size: 1.5em;
  transform: rotate(180deg);
}

.layout-header .el-select {
  margin: 0 .5em;
  width: auto;
}

.layout-header .el-dropdown {
  margin: 0 1em;
}

.layout-header .header-icon {
  margin: 0 .7em;
}

.header-blank {
  flex: 1;
}

.layout-main {
  height: 100%;
  padding: 0 1em 0 1em;
  box-sizing: border-box;
  overflow: hidden;
}

.layout-main .tabs-bar {
  height: 2.5rem;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
}

.layout-main .tabs-bar .tab-item {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  background-color: #f5f7fa;
  cursor: pointer;
  padding: 0 1rem;
  font-size: .7em;
  border-bottom: 1px solid #dcdfe6;
}

.layout-main .tabs-bar .tab-item.current {
  background-color: white;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid transparent;
  border-radius: 5px 5px 0 0;
}

.layout-main .tabs-bar .tab-item:after {
  content: '';
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}

.layout-main .tabs-bar .el-icon-close {
  transition: all 250ms;
  font-size: 1.2em;
}

.layout-main .tabs-bar .el-icon-close:hover {
  transform: rotate(180deg);
}

.layout-main .router-content {
  box-sizing: border-box;
  height: calc(100% - 2.5rem);
  position: relative;
}

.layout-footer {
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  padding: 0;
  margin: 0 16px;
  background-color: white;
  box-shadow: rgba(0,0,0,.5);
}

.mainRouter-enter-active, .mainRouter-leave-active {
  position: absolute;
  transition: all .5s;
}

.mainRouter-enter {
  position: absolute;
  opacity: 0;
  transform: translateX(50%);
}

.mainRouter-leave-to {
  position: absolute;
  opacity: 0;
  z-index: -99;
  transform: translateX(-50%);
}
</style>
