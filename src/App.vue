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
                } else if (this.animDir === 'left') {
                    return "from-right"
                }
                return ""
            },
            leaveAnim() {
                if (this.animDir === 'right') {
                    return "from-right"
                } else if (this.animDir === 'left') {
                    return "from-left"
                }
                return ""
            },
        },
        watch: {
            $route(to, from) {
                this.animDir = '';
                if (from.name === 'Login' || from.name === 'Error') {
                    this.animDir = 'right';
                } else if (to.name === 'Login' && from.name) {
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
        transition: all 500ms;
    }

    .routerview-enter-active:before, .routerview-leave-active:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        transition: background-color 500ms;
        background-color: rgba(67, 69, 76, 0);
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

    .from-left:before, .from-right:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: #43454C;
    }

</style>
