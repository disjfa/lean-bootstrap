<template>
    <div v-if="project" class="projects">
        <div class="bg-dark text-white projects-data">
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
                <button type="button" class="btn btn-outline-info dropdown-toggle dropdown-toggle-split"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                    <div class="clearfix"></div>
                    <pre v-highlightjs="sourceCode"><code class="scss"></code></pre>
                </div>
                <div class="iframe" v-else>
                    <div class="iframe-container" :style="iframeStyles">
                        <iframe frameborder="0" :style="iframeStyles" @load="iframeLoaded" ref="iframe-frame"></iframe>
                    </div>
                </div>
            </div>
        </div>
        <div class="projects-settings bg-faded" :class="{'opened': opened}">
            <a href="#" class="btn btn-outline-secondary pull-right projects-settings-close" aria-label="Close"
               @click.prevent="closeSettings()">
                <i class="fa fa-times"></i>
            </a>
            <div class="btn-group">
                <a href="#" @click.prevent="setTab('variables')" class="btn btn-outline-info disabled">
                    <i class="fa fa-fw"
                       :class="{'fa-lock': !project.canEdit, 'fa-check' : !isFetching && project.canEdit, 'fa-spinner fa-spin': isFetching}"></i>
                </a>
                <a class="btn btn-outline-info" href="#" @click.prevent="setTab('variables')"
                   :class="{'active' : activeTab('variables')}">
                    Variables
                </a>
                <a class="btn btn-outline-info" href="#" @click.prevent="setTab('settings')"
                   :class="{'active' : activeTab('settings')}">
                    Settings
                </a>
                <a class="btn btn-outline-info" href="#" @click.prevent="setTab('share')"
                   :class="{'active' : activeTab('share')}" title="Share">
                    <i class="fa fa-fw fa-share-alt"></i>
                </a>
            </div>
            <div class="project-settings-data">
                <hr>
                <div class="form-group" v-if="!project.canEdit">
                    <div class="alert alert-info">
                        This is not your project, you can view but not save these.
                    </div>
                </div>
                <div v-if="activeTab('share')">
                    <div class="form-group">
                        <label for="project-name">Share project</label>
                        <input type="text" :value="fullIframeUrl" class="form-control" id="project-name"
                               :disabled="!project.canEdit">
                    </div>
                    <div class="form-group">
                        <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + fullIframeUrl" title="Share on facebook" class="btn btn-primary">
                            <i class="fa fa-fw fa-facebook"></i>
                        </a>
                        <a :href="'https://twitter.com/home?status=' + fullIframeUrl" title="Share on twitter" class="btn btn-primary">
                            <i class="fa fa-fw fa-twitter"></i>
                        </a>
                    </div>
                </div>
                <div v-if="activeTab('settings')">
                    <div class="form-group">
                        <label for="project-name">Project name</label>
                        <input type="text" v-model="project.project.name" class="form-control" id="project-name"
                               :disabled="!project.canEdit">
                    </div>
                    <div class="form-group" v-if="project.canEdit">
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
                            <input type="search" v-model="search" class="form-control" placeholder="Filter..."
                                   id="filter">
                            <div class="input-group-addon">
                                <i class="fa fa-search"></i>
                            </div>
                        </div>
                    </div>
                    <div class="form-group" v-if="project.canEdit">
                        <button class="btn btn-primary" @click="saveGroupData()">
                            <i class="fa fa-floppy-o"></i>
                            save
                        </button>
                    </div>
                    <div v-for="item in varData">
                        <item-input :item="item" :disabled="!project.canEdit"></item-input>
                    </div>
                    <div class="form-group" v-if="project.canEdit">
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
  import {mapGetters} from 'vuex';
  import Vue from 'vue';
  import ItemInput from './../components/ItemInput.vue';
  import toastr from 'toastr';

  export default {
    name: 'app',
    components: {
      ItemInput,
    },
    data() {
      return {
        id: this.$route.params.id,
        search: this.$route.params.filter || '',
        route: this.$route.params.route || 'home',
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
      fullIframeUrl() {
        return document.location.origin + this.iframeUrl;
      },
      iframeUrl() {
        const {project,} = this.project;
        const {route,} = this;
        return '/projects/' + project.uuid + '/' + route;
      },
      varData() {
        return this.project.varData.filter(item => {
          return item.name.indexOf(this.search) > -1 || item.value.indexOf(this.search) > -1;
        });
      },
      sourceCode() {
        const {varData} = this.project;
        const source = [];
        varData.map(item => {
          source.push(item.name + ': ' + item.value + ';' + (item.altered ? ' // altered' : ''))
        });
        return (source.join('\n'));
      },
      isFetching() {
        return this.$store.getters['projects/isFetching'];
      },
      project() {
        return this.$store.getters['projects/getProject'];
      },
      error() {
        return this.$store.getters['projects/getError'];
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
    updated() {
      if (!this.$refs['iframe-frame'].src) {
        this.$refs['iframe-frame'].src = this.iframeUrl;
      }
    },
    methods: {
      iframeLoaded(evt) {
        const routeName = evt.target.contentWindow.location.href.split('/').pop();
        if (routeName.indexOf(':')) {
          return false;
        }
        const route = {
          name: 'project-details',
          params: {
            route: routeName,
            filter: this.search || null,
            id: this.id,
          },
        };
        this.$router.push(route);
      },
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
        const {project,} = this.project;
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
        for (let i in iframes) {
          if (iframes[i].contentWindow) {
            iframes[i].contentWindow.location.reload();
          }
        }
      },
      saveProjectSettings() {
        const {project, canEdit,} = this.project;
        if (canEdit) {
          this.$store.dispatch('projects/saveProjectSettings', {
            id: project.uuid,
            name: project.name,
            settings: project.settings
          });
        }
      },
      saveGroupData() {
        const {varData, project,} = this.project;
        let formData = {};
        for (let i in varData) {
          if (!varData.hasOwnProperty(i)) {
            continue;
          }

          formData[varData[i].name] = varData[i].value;
        }
        this.$store.dispatch('projects/saveProjectData', {id: project.uuid, formData});
      }
    },
    watch: {
      error: function (value) {
        if (value) {
          toastr.error(value);
          this.$store.dispatch('projects/clearError');
        }
      },
      search: function (value) {
        this.search = value.replace(/[^a-z0-9\-\#\$\.\/\*\+\,\(\)\s]/i, '').toLowerCase();
        const route = {
          name: 'project-details',
          params: {
            route: this.route,
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
        const {settings} = project.project;
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