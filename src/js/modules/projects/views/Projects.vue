<template>
    <container class="py-3">
        <div class="btn-group float-right py-2">
            <router-link :to="{name: 'project-create'}" class="btn btn-primary">
                Create new project
            </router-link>
        </div>
        <h1>Projects</h1>
        <br>
        <project-list :projects="projects"></project-list>
    </container>
</template>

<script type="text/babel">
  import { mapGetters } from 'vuex';
  import ProjectList from './../components/ProjectList.vue';
  export default {
    name: 'app',
    components: {
      ProjectList,
    },
    computed: mapGetters({
      projects: 'projects/getProjects',
    }),
    mounted() {
      this.$store.dispatch('projects/load');
    },
    events: {
      test(message) {
        this.message = message
      }
    }
  }
</script>