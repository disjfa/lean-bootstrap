<template>
    <container fluid>
        <div v-if="project">
            <h1>{{project.project.name}}</h1>

            <div id="groupData">
                <div v-for="(groupData, groupName) in project.groupData">
                    <h3>
                        <a :href="'#group-' + groupName" data-toggle="collapse">
                            {{groupName}}
                        </a>
                    </h3>
                    <div class="collapse" :id="'group-' + groupName">
                        <div v-for="item in groupData">
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
        computed: mapGetters({
            project: 'projects/getProject',
        }),
        mounted() {
            this.$store.dispatch('projects/loadProject', this.$route.params.id);
        },
        methods: {
            saveGroupData() {
                const {groupData, project} = this.project;
                let formData               = {};
                for (let i in groupData) {
                    if (!groupData.hasOwnProperty(i)) {
                        continue;
                    }
                    for (let j in groupData[i]) {
                        if (!groupData[i][j]) {
                            continue;
                        }

                        formData[groupData[i][j].name] = groupData[i][j].value;
                    }
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