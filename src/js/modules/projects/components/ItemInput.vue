<template>
    <div class="form-group" :class="{'has-success': item.altered}">
        <label>{{item.name}}<sup v-if="item.altered">*</sup></label>
        <div class="input-group">
            <a href="#" class="input-group-prepend" @click.prevent="resetItem()" :title="getTitle()">
                <span class="input-group-text">
                    <i class="fa fa-fw" :class="{'fa-square-o': !item.altered, 'fa-square': item.altered}"></i>
                </span>
            </a>
            <input type="text" v-model="item.value" class="form-control" :disabled="disabled">
        </div>
    </div>
</template>
<script>
  import Vue from 'vue';

  export default {
    props: ['item', 'disabled'],
    methods: {
      resetItem() {
        if (this.disabled) {
          return;
        }
        this.item.value = this.item.original;
      },
      getTitle() {
        if (this.item.altered) {
          return 'Original: ' + this.item.original + ', click to reset';
        }
        return 'this is the original';
      }
    },
    watch: {
      'item.value'(val) {
        Vue.set(this.item, 'altered', val !== this.item.original)
      },
    }
  }
</script>