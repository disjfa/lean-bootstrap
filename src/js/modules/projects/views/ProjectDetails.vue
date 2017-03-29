<template>
    <container fluid>
        <div v-if="project">
            <h1>{{project.project.name}}</h1>
            <div class="row">
                <div class="col-9">
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe src="/projects/2/aa" frameborder="0" class="embed-responsive-item"></iframe>
                    </div>
                </div>
                <div class="col-3">
                    <div id="groupData">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="text" v-model="search" class="form-control" placeholder="Filter...">
                                <div class="input-group-addon">
                                    <i class="fa fa-adjust"></i>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" @click="saveGroupData()">
                                save
                            </button>
                        </div>
                        <div v-for="item in varData">
                            <div class="form-group">
                                <label for="">{{item.name}}</label>
                                <input type="text" v-model="item.value" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" @click="saveGroupData()">
                                save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </container>
</template>

<script type="text/babel">
    import {mapGetters} from 'vuex';
    export default {
        name: 'app',
        data() {
            return {
                search: '',
            }
        },
        computed: Object.assign({
            varData() {
                return this.project.varData.filter(item => {
                    return item.name.indexOf(this.search) > -1;
                });
            }
        }, mapGetters({
            project: 'projects/getProject',
        })),
        mounted() {
            this.$store.dispatch('projects/loadProject', this.$route.params.id);
        },
        methods: {
            saveGroupData() {
                const {varData, project} = this.project;
                let formData             = {};
                for (let i in varData) {
                    if (!varData[i]) {
                        continue;
                    }

                    formData[varData[i].name] = varData[i].value;
                }
                this.$store.dispatch('projects/saveProjectData', {id: project.$loki, formData});
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(to.params.id);
            }
        },
        events: {
            test(message) {
                this.message = message
            }
        }
    }
</script>