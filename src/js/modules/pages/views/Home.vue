<template>
    <container class="py-3">
        <div class="jumbotron bg-primary text-white">
            <h1>Hi, and welcome</h1>
            <p>
                This is the bootstrap playground, you can play, text and just do anything.
            </p>
            <p>
                It can be that the server breaks. So be it.
            </p>
            <router-link :to="{name: 'project-create'}" class="btn btn-secondary">
                Create a project and go <i class="fa fa-arrow-right"></i>
            </router-link>
        </div>
    </container>
</template>
<script type="text/babel">
    export default {
        name: 'app',
    }
</script>