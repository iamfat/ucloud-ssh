<template lang="pug">
#body
  .header
    mu-appbar(title='UCloud SSH')
      mu-flat-button(v-if='userName',:label='userName',slot='right')
      mu-icon-button(v-if='isLoggedIn',icon='exit_to_app',slot='right',@click='doLogout')
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
import { mapState } from 'vuex'
import axios from '@/plugins/axios'

export default {
    data() {
        return {
            loginForm: {
                username: null,
                password: null
            }
        }
    },
    computed: mapState({
        doLogin: state => state.user.doLogin,
        isLoggedIn: state => !!state.user.me,
        userName: state => state.user.me ? state.user.me.username : null
    }),
    methods: {
        doneLogin() {
            this.$store.commit('user/doneLogin')
        },
        submitLogin() {
            this.$store.dispatch('user/login', {
                username: this.loginForm.username,
                password: this.loginForm.password
            })
            this.loginForm.username = null
            this.loginForm.password = null
        },
        doLogout() {
            this.$store.dispatch('user/logout')
        },
        async checkAuth() {
            let commit = this.$store.commit
            try {
                let { data } = await axios.get('/api/user/status')
                commit('user/login', data)
            } catch (e) {
                commit('user/doLogin')
            }
        }
    },
    mounted() {
        this.checkAuth()
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


