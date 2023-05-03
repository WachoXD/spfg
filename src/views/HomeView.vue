<template>
  <div class="home">
    <IndexWord msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import IndexWord from '@/components/index.vue'

export default {
  name: 'HomeView',
  components: {
    IndexWord
  }
}
</script>
