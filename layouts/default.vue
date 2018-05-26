<template lang="pug">
#body
  login-form
  .header
    mu-appbar(title='UCloud SSH')
      mu-flat-button(v-if='userName',:label='userName',slot='right')
      mu-icon-button(v-if='isLoggedIn',icon='exit_to_app',slot='right',@click='doLogout')
  nuxt
</template>

<script>
import { mapState } from 'vuex'
import LoginForm from '~/components/LoginForm.vue'

export default {
    components: {
        LoginForm
    },
    computed: mapState({
        isLoggedIn: state => !!state.user.me,
        userName: state => (state.user.me ? state.user.me.name : null)
    }),
    methods: {
        doneLogin() {
            this.$store.commit('user/doneLogin')
        },
        doLogout() {
            this.$store.dispatch('user/logout')
        }
    },
    mounted() {
        this.$store.dispatch('user/status')
    }
}
</script>

<style lang="stylus">
html
  height 100%

body
  min-height 100%
  padding 0
  margin 0
  display flex

#__nuxt
#__layout
  width 100%
  display flex
  flex-grow 1

#body
  width 100%
  display flex
  flex-direction column

  .content
    flex-grow 1
</style>


