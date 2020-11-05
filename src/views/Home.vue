<template>
    <div class="home full-content"></div>
</template>

<script>
    import { query } from '@/service/UserService'
    export default {
        name: 'Home',
        mounted () {
            query()
        }
    }
</script>

<style scoped>

</style>
