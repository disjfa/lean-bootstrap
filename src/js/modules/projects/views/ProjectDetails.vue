<template>
    <div v-if="project" class="projects">
        <div class="bg-inverse text-white projects-data">
            <div class="btn-group py-2 float-right">
                <a href="#" @click.prevent="reloadFrames();" class="btn btn-outline-info" title="Reload frame">
                    <i class="fa fa-fw fa-recycle"></i>
                </a>
                <a href="#" @click.prevent="toggleCode();" class="btn btn-outline-info" title="Toggle code/website">
                    <i class="fa fa-fw fa-code"></i>
                </a>
                <a href="#" @click.prevent="rotate();" class="btn btn-outline-info" title="Reload frame">
                    <i class="fa fa-fw fa-tablet" :class="{'fa-rotate-90': deviceRotation}"></i>
                </a>
                <button type="button" class="btn btn-outline-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{deviceName}}
                </button>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" href="#" v-for="device in devices" @click.prevent="setDevice(device)">
                        {{device.name}}
                    </a>
                </div>
            </div>
            <h1>
                {{project.project.name}}
            </h1>
            <div>
                <div v-if="showCode">
                    <pre v-highlightjs="sourceCode"><code class="scss"></code></pre>
                </div>
                <div class="iframe" v-else>
                    <div class="iframe-container" :style="iframeStyles">
                        <iframe :src="'/projects/' + project.project.uuid + '/home'" frameborder="0" :style="iframeStyles"></iframe>
                    </div>
                </div>
            </div>
        </div>
        <div class="projects-settings bg-faded" :class="{'opened': opened}">
            <a href="#" class="btn btn-outline-secondary pull-right projects-settings-close" aria-label="Close" @click.prevent="closeSettings()">
                <i class="fa fa-times"></i>
            </a>
            <div class="btn-group">
                <a href="#" @click.prevent="setTab('variables')" class="btn btn-outline-info disabled">
                    <i class="fa fa-fw" :class="{'fa-check' : !isFetching, 'fa-spinner fa-spin': isFetching}"></i>
                </a>
                <a class="btn btn-outline-info" href="#" @click.prevent="setTab('variables')" :class="{'active' : activeTab('variables')}">
                    Variables
                </a>
                <a class="btn btn-outline-info btn-block" href="#" @click.prevent="setTab('settings')" :class="{'active' : activeTab('settings')}">
                    Settings
                </a>
            </div>
            <div class="project-settings-data">
                <hr>
                <div v-if="activeTab('settings')">
                    <div class="form-group">
                        <label for="project-name">Project name</label>
                        <input type="text" v-model="project.project.name" class="form-control" id="project-name">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" @click="saveProjectSettings()">
                            <i class="fa fa-floppy-o"></i>
                            save
                        </button>
                    </div>
                </div>
                <div id="groupData" v-if="activeTab('variables')">
                    <div class="form-group">
                        <label for="filter">Filter</label>
                        <div class="input-group">
                            <input type="search" v-model="search" class="form-control" placeholder="Filter..." id="filter">
                            <div class="input-group-addon">
                                <i class="fa fa-search"></i>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" @click="saveGroupData()">
                            <i class="fa fa-floppy-o"></i>
                            save
                        </button>
                    </div>
                    <div v-for="item in varData">
                        <item-input :item="item"></item-input>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary" @click="saveGroupData()">
                            <i class="fa fa-floppy-o"></i>
                            save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
  import { mapGetters } from 'vuex';
  import Vue from 'vue';
  import ItemInput from './../components/ItemInput.vue';

  export default {
    name: 'app',
    components: {
      ItemInput,
    },
    data() {
      return {
        id: this.$route.params.id,
        search: this.$route.params.filter || '',
        tab: 'variables',
        device: false,
        deviceRotation: false,
        opened: false,
        showCode: false,
        devices: [{
          key: 'default',
          name: 'Default',
        }, {
          key: 'iphone5',
          name: 'iPhone 5',
          width: '320px',
          height: '568px',
        }, {
          key: 'iphone7',
          name: 'iPhone 7',
          width: '375px',
          height: '667px',
        }, {
          key: 'iphone7plus',
          name: 'iPhone 7 plus',
          width: '414px',
          height: '736px',
        }, {
          key: 'ipad',
          name: 'iPad',
          width: '768px',
          height: '1024px',
        }, {
          key: 'ipadpro',
          name: 'iPad pro',
          width: '1024px',
          height: '1366px',
        }],
      }
    },
    computed: {
      varData() {
        return this.project.varData.filter(item => {
          return item.name.indexOf(this.search) > -1 || item.value.indexOf(this.search) > -1;
        });
      },
      sourceCode() {
        const { varData } = this.project;
        const source = [];
        varData.map(item => {
          source.push(item.name + ': ' + item.value + ';' + (item.altered ? ' // altered' : ''))
        });
        return(source.join('\n'));
      },
      isFetching() {
        return this.$store.getters['projects/isFetching'];
      },
      project() {
        return this.$store.getters['projects/getProject'];
      },
      deviceName() {
        if (this.device) {
          return this.device.name;
        }
        return 'Default';
      },
      iframeStyles() {
        if (this.device.hasOwnProperty('width') && this.device.hasOwnProperty('height')) {
          if (this.deviceRotation) {
            return {
              width: this.device.height,
              height: this.device.width,
            }
          }

          return {
            width: this.device.width,
            height: this.device.height,
          }
        }
        return {};
      }
    },
    mounted() {
      this.$store.dispatch('projects/loadProject', this.$route.params.id);
    },
    methods: {
      toggleCode() {
        this.showCode = !this.showCode;
      },
      setTab(tab) {
        this.tab = tab;
        Vue.set(this, 'opened', true);
      },
      closeSettings() {
        Vue.set(this, 'opened', false);
      },
      activeTab(tab) {
        return this.tab === tab;
      },
      setDevice(device) {
        this.device = device;
        this.setProjectSetting('device', device.key);
        this.saveProjectSettings();
      },
      rotate() {
        this.deviceRotation = !this.deviceRotation;
        this.setProjectSetting('deviceRotation', this.deviceRotation);
        this.saveProjectSettings();
      },
      setProjectSetting(setting, value) {
        const { project, } = this.project;
        if (!project.settings) {
          project.settings = {};
        }
        project.settings[setting] = value;
      },
      reloadFrames() {
        if (!this.$el || !this.$el.querySelectorAll) {
          return;
        }
        const iframes = this.$el.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.contentWindow.location.reload();
        });
      },
      saveProjectSettings() {
        const { project, } = this.project;
        this.$store.dispatch('projects/saveProjectSettings', { id: project.uuid, name: project.name, settings: project.settings });
      },
      saveGroupData() {
        const { varData, project, } = this.project;
        let formData = {};
        for (let i in varData) {
          if (!varData.hasOwnProperty(i)) {
            continue;
          }

          formData[varData[i].name] = varData[i].value;
        }
        this.$store.dispatch('projects/saveProjectData', { id: project.uuid, formData });
      }
    },
    watch: {
      search: function (value) {
        this.search = value.replace(/[^a-z0-9\-\#\$\.\/\*\+\,\(\)\s]/i, '').toLowerCase();

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
      isFetching: function (value) {
        if (!value) {
          this.reloadFrames();
        }
      },
      project: function (project) {
        if (false === project.hasOwnProperty('project') || false === project.project.hasOwnProperty('settings')) {
          return;
        }
        const { settings } = project.project;
        for (let key in settings) {
          if (!settings.hasOwnProperty(key)) {
            continue;
          }

          if (key === 'device') {
            const device = this.devices.find(d => {
              return d.key === settings[key];
            });
            this.setDevice(device);
          }
          if (key === 'deviceRotation') {
            if (this.deviceRotation !== settings[key]) {
              this.rotate();
            }
          }
        }
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