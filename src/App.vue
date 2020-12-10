<template>
  <div id="app">
    <transition name="routerview"
                :enter-class="enterAnim"
                :leave-to-class="leaveAnim">
      <router-view/>
    </transition>
  </div>
</template>
<script>
  export default {
    name: "App",
    data() {
      return {
        // 动画方向left向左;right向右;空字符串不执行动画
        animDir: ''
      }
    },
    computed: {
      enterAnim() {
        if (this.animDir === 'right') {
          return "from-left"
        }
        else if (this.animDir === 'left') {
          return "from-right"
        }
        return ""
      },
      leaveAnim() {
        if (this.animDir === 'right') {
          return "from-right"
        }
        else if (this.animDir === 'left') {
          return "from-left"
        }
        return ""
      },
    },
    watch: {
      $route(to, from) {
        this.animDir = '';
        if (from.name === 'Login') {
          this.animDir = 'right';
        }
        else if (to.name === 'Login' && from.name) {
          this.animDir = 'left';
        }
      }
    }
  }
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
  }
  .routerview-enter-active, .routerview-leave-active {
    position: absolute;
    transition: all 250ms;
  }
  .from-left {
    position: absolute;
    overflow: hidden;
    transform: translateX(100%);
  }
  .from-right {
    position: absolute;
    overflow: hidden;
    transform: translateX(-100%);
  }

</style>
