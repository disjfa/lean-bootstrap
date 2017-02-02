<template>
    <ul class="navbar-nav nav">
        <slot></slot>
        <nav-item v-for="item in items" :item="item">

        </nav-item>
    </ul>
</template>
<script>
    import navItem from './navItem.vue';

    export default {
        components: {
            navItem
        },
        props: {
            items: Array,
        }
    }
</script>