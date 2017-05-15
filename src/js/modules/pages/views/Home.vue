<template>
    <container class="py-3">
        <div class="jumbotron bg-primary text-white">
            <h1>Hi, why are we here.</h1>
            <p>
                In the wild you sometimes hear bootstrap is hard to overrule as css, all of the nested builds of css code.
            </p>
            <p>
                The short awnser is, don't override. Use bootsstrap. So we made a playground where you don't:
            </p>
            <pre v-highlightjs="sourceFrom"><code class="css"></code></pre>
            <p>to:</p>
            <pre v-highlightjs="sourceTo"><code class="css"></code></pre>
            <p>
                But instead change
            </p>
            <pre v-highlightjs="sassFrom"><code class="scss"></code></pre>
            <p>to:</p>
            <pre v-highlightjs="sassTo"><code class="scss"></code></pre>
            <p>
                And just build your own css from the source.
            </p>
            <router-link :to="{name: 'project-create'}" class="btn btn-secondary">
                Cool, let's start <i class="fa fa-arrow-right"></i>
            </router-link>
        </div>
    </container>
</template>
<script type="text/babel">
  export default {
    name: 'home',
    data() {
      return {
        sourceFrom: '.form-control:focus {\n\tbackground-color: #fff;\n}',
        sourceTo: '.form-control:focus {\n\tbackground-color: hotpink !important;;\n}',
        sassFrom: '$input-bg-focus: #fff',
        sassTo: '$input-bg-focus: hotpink'
      }
    }
  }
</script>