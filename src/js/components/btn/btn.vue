<template>
    <a class="btn" :class="classes" :href="gethref">
        <slot>This is a button</slot>
    </a>
</template>
<script>
    export default {
        props: {
            primary: Boolean,
            success: Boolean,
            info: Boolean,
            warning: Boolean,
            error: Boolean,
            link: Boolean,
            block: Boolean,
            href: String,
        },
        computed: {
            classes () {
                return {
                    'btn-primary': this.primary,
                    'btn-success': this.success,
                    'btn-info': this.info,
                    'btn-warning': this.warning,
                    'btn-error': this.error,
                    'btn-link': this.link,
                    'btn-block': this.block,
                };
            },
            gethref () {
                return this.href || '#';
            }
        }
    }
</script>