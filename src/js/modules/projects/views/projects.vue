<template>
    <container>
        aaakrakaka

        <div v-for="project in projects">
            {{project.name}}
            {{project.$loki}}
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