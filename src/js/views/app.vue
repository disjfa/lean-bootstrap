<template>
    <div id="app">
        <navbar :items="routes" :user="user">
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
      user() {
        return this.$store.getters['user/getUser'];
      },
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
    mounted() {
      this.$store.dispatch('user/load');
    },
    events: {
      test(message) {
        this.message = message
      }
    }
  }
</script>