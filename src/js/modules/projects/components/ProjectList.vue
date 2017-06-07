<template>
    <div class="list-group">
        <router-link :to="{name: 'project-details', params: { id: project.uuid }}" class="list-group-item" v-for="project in projects" v-if="project.uuid">
            <i class="fa fa-fw" :class="{'fa-user': project.userId, 'fa-user-o': !project.userId}"></i>
            {{project.name}}
        </router-link>
    </div>
</template>

<script type="text/babel">
  export default {
    props: ['projects'],
  }
</script>