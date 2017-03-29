<template>
    <container>
        <h1>Projects</h1>

        <div class="list-group">
            <router-link :to="{name: 'project-details', params: { id: project.$loki }}" class="list-group-item" v-for="project in projects">
                {{project.name}}
            </router-link>
        </div>
    </container>
</template>

<script type="text/babel">
    import {mapGetters} from 'vuex';
    export default {
        name: 'app',
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