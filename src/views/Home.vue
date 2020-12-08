<template>
    <div class="home full-content"></div>
</template>

<script>
    import { queryUser } from '@/service/UserService'
    export default {
        name: 'Home',
        mounted () {
            queryUser()
        }
    }
</script>

<style scoped>

</style>
