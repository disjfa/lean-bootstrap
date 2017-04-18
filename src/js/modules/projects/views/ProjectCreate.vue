<template>
    <container class="py-3">
        <div class="jumbotron bg-success text-white">
            <h1>Create a new project</h1>
            <p>Here you can create a new project. Just think of a name and go.</p>
            <form action="#" @submit.prevent="saveProject()">
                <div class="form-group">
                    <label for="name">Project name</label>
                    <input type="text" class="form-control" v-model="name" id="name">
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit">
                        create project
                        <i class="fa fa-arrow-right"></i>
                    </button>
                </div>
            </form>
        </div>
    </container>
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                name: '',
            }
        },
        computed: {
            project: function () {
                return this.$store.getters['projects/getProject'];
            }
        },
        watch: {
            project: function (project) {
                if(project.project.uuid) {
                    this.$router.push({
                        name: 'project-details',
                        params: {
                            id: project.project.uuid,
                        }
                    })
                }
            }
        },
        methods: {
            saveProject() {
                if(this.name) {
                    this.$store.dispatch('projects/create', {name: this.name});
                }
            }
        }
    }
</script>