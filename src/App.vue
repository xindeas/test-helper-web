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
    computed: {
      enterAnim() {
        return "from-left"
      },
      leaveAnim() {
        return "from-right"
      },
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
  }
  .routerview-enter-active, .routerview-leave-active {
    position: absolute;
    transition: all .5s;
  }
  .from-left {
    position: absolute;
    opacity: 0;
    transform: translateX(100%);
  }
  .from-right {
    position: absolute;
    opacity: 0;
    transform: translateX(-100%);
  }

</style>
