<template lang="pug">
#body
  .header
    mu-appbar(title='UCloud SSH')
  .content
    nuxt
  mu-dialog(:open='doLogin',title='请先登录')
    div
      mu-text-field(label='用户名',labelFloat,v-model='loginForm.username',fullWidth)
      br
      mu-text-field(label='密码',labelFloat,type='password',v-model='loginForm.password',fullWidth)
      br
    mu-raised-button(label='登录', slot='actions', primary, @click='submitLogin')
</div>  
</template>

<script>
import axios from '~/plugins/axios'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      loginForm: {
        username: null,
        password: null
      }
    }
  },
  computed: mapState({
    doLogin: state => state.user.doLogin
  }),
  methods: {
    doneLogin () {
      this.$store.commit('user/doneLogin')
    },
    submitLogin () {
      this.$store.dispatch('user/login', {
        username: this.loginForm.username,
        password: this.loginForm.password
      })
    }
  }
}
</script>

<style lang="stylus">
html
  height 100%

body
  width 100%
  min-height 100%
  padding 0
  margin 0
  display flex
  flex-direction column

#__nuxt
  width 100%
  display flex
  flex-grow 1
 
</style>

<style lang="stylus" scoped>
#body
  padding 0
  width 100%
  flex-grow 1
  display flex
  flex-direction column

  .header
    background-color: 
    .logo
      font-size 24px
      color: white
      display: inline-block
      padding: 10px 20px

  .content
    flex-grow 1
    display flex

</style>


