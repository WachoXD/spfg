<template>
  <div class="home">
    <LoginIn />
  </div>
</template>
<script>
// @ is an alias to /src
import LoginIn from '@/components/login.vue'

export default {
  name: 'LogionView',
  components: {
    LoginIn
  }
}
</script>