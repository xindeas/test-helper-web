<template>
  <el-header class="layout-header">
    <i v-if="collapse" class="fold el-icon-s-unfold" @click="collapse = !collapse"></i>
    <i v-else class="fold un-fold el-icon-s-unfold" @click="collapse = !collapse"></i>
    <el-breadcrumb separator="/">
      <transition-group name="breadcrumb">
        <template v-for="item of crumbList">
          <el-breadcrumb-item :key="item.name" v-if="item.meta && item.meta.title">{{ item.meta.title }}
          </el-breadcrumb-item>
        </template>
      </transition-group>
    </el-breadcrumb>
    <div class="header-blank"></div>
    <el-popover
        placement="bottom"
        title="提醒"
        width="200"
        trigger="hover">
      <el-badge slot="reference" :value="12" :max="99" class="header-icon">
        <i class="el-icon-bell"></i>
      </el-badge>
      <div>缺陷新增提醒</div>
    </el-popover>
    <el-popover
        placement="bottom"
        title="消息"
        width="200"
        trigger="hover">
      <el-badge slot="reference" hidden :value="10" :max="99" class="header-icon">
        <i class="el-icon-message"></i>
      </el-badge>
      <template>
        <div>某某某回复了你的评论</div>
      </template>
    </el-popover>
    <el-select v-model="myProject" placeholder="请选择项目" size="mini" @change="changeCurProject" filterable
               clearable>
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
        <el-dropdown-item>修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>
import {logout} from "@/service/UserService";
import {queryProjectForOptions} from "@/service/ProjectService";
import PubSub from "pubsub-js";
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Header,
  Option,
  Popover,
  Select
} from "element-ui";

export default {
  name: "HeaderBar",
  components: {
    'el-header': Header,
    'el-avatar': Avatar,
    'el-select': Select,
    'el-option': Option,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-badge': Badge,
    'el-popover': Popover,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
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
    crumbList() {
      return [{
        path: '/',
        meta: {
          title: '首页'
        },
        name: 'Home'
      }].concat(this.$route.matched.filter(item => item.name !== 'Home'))
    }
  },
  data() {
    return {
      myProject: '',
      projectList: [],
    }
  },
  created() {
    this.loadProject()
  },
  mounted() {
    // 添加订阅
    this.subscriber = PubSub.subscribe("flushProject", this.loadProject)
    this.closeTabScriber = PubSub.subscribe("closeCurTab", this.closeCurTab)
  },
  methods: {
    loadProject() {
      const vm = this
      queryProjectForOptions({
        userId: vm.user.id
      }).then(res => {
        if (res && res.result && Array.isArray(res.result)) {
          vm.projectList = res.result
        }
      })
    },
    logout() {
      logout().then(() => {
        this.$cookies.remove('user')
        this.$router.push('Login')
      })
    },
    // 切换项目
    changeCurProject(val) {
      const project = this.projectList.find(item => item.id === val) || {};
      this.$store.commit("project/setCurProject", project)
    }
  },
  destroyed() {
    // 取消订阅
    PubSub.unsubscribe(this.subscriber);
    PubSub.unsubscribe(this.closeTabScriber);
  }
}
</script>

<style>

.breadcrumb-enter-active, .breadcrumb-leave-active {
  transition: all .5s;
}
.breadcrumb-leave-active {
  position: absolute;
}

.breadcrumb-enter {
  opacity: 0.5;
  transform: translateX(50%);
}

.breadcrumb-leave-to {
  opacity: 0.5;
  transform: translateX(50%);
}

</style>
