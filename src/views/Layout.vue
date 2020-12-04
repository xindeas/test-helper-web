<template>
  <div class="layout full-content">
    <el-container class="full-content">
      <el-aside width="auto">
        <HeaderMenu :menu="menuList" :collapse="collapse"/>
      </el-aside>
      <el-container>
        <el-header class="layout-header">
          <i v-if="collapse" class="fold el-icon-s-unfold" @click="collapse = !collapse"></i>
          <i v-else class="fold un-fold el-icon-s-unfold" @click="collapse = !collapse"></i>
          <div class="header-blank"></div>
          <el-select v-model="myProject" placeholder="请选择项目" size="mini">
            <el-option
                    v-for="item in projectList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
          <el-dropdown trigger="hover">
            <el-avatar :size="45" :src="user.avatar">
              <img src="@/assets/pic.png"/>
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人主页</el-dropdown-item>
              <el-dropdown-item>我的周报</el-dropdown-item>
              <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="layout-main">
          <transition name="mainRouter">
            <router-view/>
          </transition>
        </el-main>
        <el-footer class="layout-footer">测试工具V0.0.1</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import HeaderMenu from '@/components/HeaderMenu';
  import {
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Avatar,
    Select,
    Option,
    Dropdown,
    DropdownMenu,
    DropdownItem
  } from 'element-ui'
  import { queryProject } from '../service/ProjectService'

export default {
  name: 'Layout',
  components: {
    HeaderMenu,
    'el-container': Container,
    'el-header': Header,
    'el-aside': Aside,
    'el-main': Main,
    'el-footer': Footer,
    'el-avatar': Avatar,
    'el-select': Select,
    'el-option': Option,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
  },
  data () {
    return {
      myProject: '',
      projectList: [],
      collapse: false,
      menuList: [
        {
          label: '首页',
          index: 'Home',
          icon: 'el-icon-files',
          children: []
        },
        {
          label: '我的项目',
          index: 'Project',
          icon: 'el-icon-folder-opened',
          children: []
        },
        {
          label: '工作台',
          index: 'WorkBench',
          icon: 'el-icon-files',
          children: []
        },
        {
          label: '缺陷管理',
          index: 'Defect',
          icon: 'el-icon-date',
          children: []
        },
        {
          label: '测试用例',
          index: 'TestCase',
          icon: 'el-icon-notebook-1',
          children: []
        }
      ]
    }
  },
  computed: {
    user() {
      return this.$cookies.get('user')
    }
  },
  created() {
    this.loadProject()
  },
  mounted () {
  },
  methods: {
    loadProject () {
      const vm = this
      queryProject({
        pagination: false
      }).then(res => {
        if (res && res.result && Array.isArray(res.result.result)) {
          vm.projectList = res.result.result
        }
      })
    },
    logout() {
      this.$cookies.remove('user')
      this.$router.push('Login')
    }
  }
}
</script>
<style>
  .layout {
    overflow: hidden;
  }
  .layout-header {
    padding: 0;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  .layout-header>* {
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
  }
  .layout-header .el-dropdown {
    margin: 0 1em;
  }
  .header-blank {
    flex: 1;
  }
  .layout-main {
    height: calc(100% - 3em);
    padding: 1em 1em 0 1em;
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
  }
  .mainRouter-enter-active, .mainRouter-leave-active {
    position: absolute;
    transition: all .5s;
  }
  .mainRouter-enter {
    position: absolute;
    opacity: 0;
    transform: translateX(100%);
  }
  .mainRouter-leave-to {
    position: absolute;
    opacity: 0;
    z-index: -99;
    transform: translateX(-100%);
  }
</style>
