<template>
    <container class="py-3">
        <div class="btn-group float-right py-2">
            <router-link :to="{name: 'project-create'}" class="btn btn-primary">
                Create new project
            </router-link>
        </div>
        <h1>Projects</h1>
        <br>
        <div v-if="error">
            <div class="alert alert-warning">
                <i class="fa fa-exclamation-triangle"></i>
                {{error}}
            </div>
        </div>
        <div class="list-group">
            <router-link :to="{name: 'project-details', params: { id: project.uuid }}" class="list-group-item" v-for="project in projects" v-if="project.uuid">
                {{project.name}}
            </router-link>
        </div>
    </container>
</template>

<script type="text/babel">
  import { mapGetters } from 'vuex';
  export default {
    name: 'app',
    computed: mapGetters({
      projects: 'projects/getProjects',
      error: 'projects/getError',
    }),
    mounted() {
      this.$store.dispatch('projects/loadMyProjects');
    },
    events: {
      test(message) {
        this.message = message
      }
    }
  }
</script>