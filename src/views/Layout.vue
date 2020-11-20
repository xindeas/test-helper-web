<template>
  <div class="layout full-content">
    <el-container class="full-content">
      <el-header class="layout-header">
        <HeaderMenu :menu="menuList"/>
        <div class="header-right-bar">
          <el-select v-model="myProject" placeholder="请选择">
            <el-option
                    v-for="item in projectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
          <el-dropdown trigger="click">
            <el-avatar :size="45" :src="user.avatar">
              <img src="@/assets/pic.png"/>
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人主页</el-dropdown-item>
              <el-dropdown-item>我的周报</el-dropdown-item>
              <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="layout-main-footer">
        <el-main class="layout-main">
          <router-view/>
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
    Main,
    Footer,
    Avatar,
    Select,
    Option,
    Dropdown,
    DropdownMenu,
    DropdownItem
  } from 'element-ui'

export default {
  name: 'Layout',
  components: {
    HeaderMenu,
    'el-container': Container,
    'el-header': Header,
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
      menuList: [
        {
          label: '首页',
          index: 'Home',
          children: []
        },
        {
          label: '我的项目',
          index: 'Project',
          children: []
        },
        {
          label: '工作台',
          index: 'WorkBench',
          children: []
        },
        {
          label: '缺陷管理',
          index: 'Defect',
          children: []
        },
        {
          label: '测试用例',
          index: 'TestCase',
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
      this.projectList = []
    },
    logout() {
      this.$cookies.remove('user')
      this.$router.push('Login')
    }
  }
}
</script>
<style>
  .layout-header {
    height: 3em;
    padding: 0;
  }
  .layout-main-footer {
    height: calc(100% - 3em);
  }
  .layout-main {
    height: calc(100% - 3em);
  }
  .layout-footer {
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #909399;
  }
  .header-menu {
    width: calc(100% - 20em);
    display: inline-block;
  }
  .header-right-bar {
    width: 20em;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    background-color: #545c64;
    height: 100%;
    text-align: right;
  }
  .header-right-bar:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
  .header-right-bar>* {
    display: inline-block;
    vertical-align: middle;
    margin-right: 1em;
    cursor: pointer;
  }
</style>
