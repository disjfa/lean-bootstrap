<template>
    <nav class="navbar navbar-toggleable-md" :class="classes">
        <container>
            <slot></slot>
            <navbarNav :items="items">

            </navbarNav>
        </container>
    </nav>
</template>
<script>
    import container from '../container/container.vue';
    import navbarNav from './navbarNav.vue';

    export default {
        components: {
            container,
            navbarNav
        },
        props: {
            inverse: Boolean,
            items: Array,
        },
        computed: {
            classes() {
                return {
                    'navbar-inverse': this.inverse,
                    'bg-inverse': this.inverse,
                    'navbar-light': !this.inverse,
                    'bg-faded': !this.inverse,
                }
            }
        }
    }
</script>