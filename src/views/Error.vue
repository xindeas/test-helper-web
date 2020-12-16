<template>
    <div>404</div>
</template>

<script>
    export default {
        name: "Error",
        mounted() {
            this.$store.commit("router/setCurTabs", [])
        }
    }
</script>

<style scoped>

</style>
