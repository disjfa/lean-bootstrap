<template>
    <div id="app">
        <navbar :items="routes">
            <a class="navbar-brand" href="#">
                <img src="/icons/apple-touch-icon.png" alt="" class="d-inline-block rounded">
                Bootstrap playground
            </a>
        </navbar>
        <router-view></router-view>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'app',
        computed: {
            routes() {
                let items = this.$router.options.routes.map(item => {
                    if (!item.menu) {
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