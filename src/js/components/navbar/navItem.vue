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
    mounted() {
      $(this.$el.childNodes).on('click', () => {
        if($('.navbar-toggler').is(':visible') && $('.navbar-collapse').hasClass('show')) {
          $('.navbar-toggler').click();
        }
      });
    },
    computed: {
      type() {
        return this.item.to ? 'router-link' : 'a';
      },
      goTo() {
        return {
          name: this.item.to,
        };
      }
    }
  }
</script>