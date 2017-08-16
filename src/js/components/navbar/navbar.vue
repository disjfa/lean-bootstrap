<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light" :class="classes">
        <slot></slot>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-main" aria-controls="navbar-main" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <navbarNav :items="items" :user="user">

        </navbarNav>
    </nav>
</template>
<script>
  import container from '../container/container.vue'
  import navbarNav from './navbarNav.vue'

  export default {
    components: {
      container,
      navbarNav
    },
    props: {
      inverse: Boolean,
      items: Array,
      user: Object,
    },
    computed: {
      classes () {
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