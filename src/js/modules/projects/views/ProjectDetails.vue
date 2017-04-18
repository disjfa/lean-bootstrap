<template>
    <container fluid class="projects">
        <div v-if="project">
            <div class="row">
                <div class="col-9 bg-inverse text-white">
                    <div class="btn-group py-2 float-right">
                        <a href="#" @click.prevent="reloadFrames();" class="btn btn-outline-info">
                            <i class="fa fa-recycle"></i>
                        </a>
                    </div>
                    <h1>
                        {{project.project.name}}
                    </h1>
                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe :src="'/projects/' + project.project.uuid + '/home'" frameborder="0" class="embed-responsive-item"></iframe>
                    </div>
                </div>
                <div class="col-3 projects-data bg-faded py-3">
                    <div id="groupData">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="search" v-model="search" class="form-control" placeholder="Filter...">
                                <div class="input-group-addon">
                                    <i class="fa fa-search"></i>
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
                id: this.$route.params.id,
                search: this.$route.params.filter || '',
            }
        },
        computed: {
            varData() {
                return this.project.varData.filter(item => {
                    return item.name.indexOf(this.search) > -1 || item.value.indexOf(this.search) > -1;
                });
            },
            project() {
                return this.$store.getters['projects/getProject'];
            },
        },
        mounted() {
            this.$store.dispatch('projects/loadProject', this.$route.params.id);
        },
        methods: {
            reloadFrames() {
                if (!this.$el) {
                    return;
                }
                const iframes = this.$el.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    iframe.contentWindow.location.reload();
                });
            },
            saveGroupData() {
                const {varData, project} = this.project;
                let formData             = {};
                for (let i in varData) {
                    if (!varData.hasOwnProperty(i)) {
                        continue;
                    }

                    formData[varData[i].name] = varData[i].value;
                }
                this.$store.dispatch('projects/saveProjectData', {id: project.uuid, formData});
                setTimeout(this.reloadFrames, 1000);
            }
        },
        watch: {
            search: function (value) {
                this.search = value.replace(/[^a-z0-9\-\#\$\.\/\*\+\,\(\)\s]/i, '');

                const route = {
                    name: 'project-details',
                    params: {
                        id: this.id,
                    },
                };
                if (this.search) {
                    route.params.filter = this.search;
                }
                this.$router.push(route);
            },
            '$route': function (to, from) {
                this.id = to.params.id;
            }
        },
        events: {
            test(message) {
                this.message = message
            }
        }
    }
</script>