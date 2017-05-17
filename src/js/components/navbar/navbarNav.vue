<template>
    <div class="collapse navbar-collapse" id="navbar-main">
        <ul class="navbar-nav nav mr-auto mt-2 mt-md-0">
            <slot></slot>
            <nav-item v-for="item in items" :item="item">

            </nav-item>
        </ul>
        <ul class="navbar-nav nav">
            <li class="nav-item" v-if="user.uuid">
                <a class="nav-link" href="#">
                    <i class="fa fa-user"></i>
                    {{ user.displayName }}
                </a>
            </li>
            <li v-else>
                <a class="nav-link" href="/auth/github">
                    <i class="fa fa-github"></i>
                    login using github
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
  import navItem from './navItem.vue';

  export default {
    components: {
      navItem
    },
    props: {
      items: Array,
      user: Object,
    }
  }
</script>