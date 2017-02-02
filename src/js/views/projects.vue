<template>
    <container>
aaa
    </container>
</template>

<script type="text/babel">
    export default {
        name: 'app',
        computed: {
            routes() {
                let items = this.$router.options.routes.map(item => {
                    if (item.path.match(/:/)) {
                        return false;
                    }

                    return {
                        name: item.label,
                        to: item.name,
                    };
                });

                return items.filter(item => {
                    return item !== false;
                });
            }
        },
        events: {
            test(message) {
                this.message = message
            }
        }
    }
</script>