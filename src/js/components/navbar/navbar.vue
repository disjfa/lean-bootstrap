<template>
    <nav class="navbar navbar-toggleable-md" :class="classes">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar-main" aria-controls="navbar-main" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <slot></slot>
        <div class="collapse navbar-collapse" id="navbar-main">
            <navbarNav :items="items">

            </navbarNav>
        </div>
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