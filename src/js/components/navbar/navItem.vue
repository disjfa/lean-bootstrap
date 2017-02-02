<template>
    <li class="nav-item">
        <button class="nav-link" :is="type" :to="goTo">
            {{item.name}}
        </button>
    </li>
</template>
<script>
    export default {
        props: {
            item: Object,
        },
        computed: {
            type() {
                return this.item.to ? 'router-link' : 'a';
            },
            goTo() {
                return this.item.to;
            }
        }
    }
</script>