<template>
    <div :class="contentClass">
        <div>
            <h1>
                <span class="warning-txt">4</span>
                <span class="info-txt">0</span>
                <span class="warning-txt">4</span>
            </h1>
            <h2 class="info-txt">定位出错！即将返回主页！{{time}}秒后自动跳转</h2>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: "Error",
        data() {
            return {
                time: 3,
                contentClass: {
                    'full-content': true,
                    error: true
                }
            }
        },
        mounted() {
            this.$store.commit("router/setCurTabs", [])
            this.timeoutJump();
        },
        methods: {
            timeoutJump() {
                const vm = this;
                if (this.time > 0) {
                    vm.time --;
                    setTimeout(() => {
                        vm.timeoutJump();
                    }, 1000);
                } else {
                    this.$router.push("/Home");
                    Vue.set(this.contentClass, 'anim', true);
                }
            }
        }
    }
</script>

<style scoped>
    .error {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        transition: all 500ms;
    }
    .error h1,h2 {
        text-align: center;
    }
    .anim {
        background-color: #43454C;
    }
</style>
