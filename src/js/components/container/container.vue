<template>
    <div :class="classes">
        <slot>This is a container</slot>
    </div>
</template>
<script>
    export default {
        props: {
            fluid: Boolean,
        },
        computed: {
            classes() {
                return {
                    'container-fluid': this.fluid,
                    'container': !this.fluid,
                }
            }
        }
    }
</script>