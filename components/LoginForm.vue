<template lang="pug">
  mu-dialog(:open='doLogin',title='请先登录')
    div(v-if='loading', style='text-align:center')
      mu-circular-progress(:size="40")
    div(v-else)
      mu-text-field(label='用户名',labelFloat,v-model='loginForm.username',fullWidth,@keyup.enter.native='submitLogin')
      br
      mu-text-field(label='密码',labelFloat,type='password',v-model='loginForm.password',fullWidth,@keyup.enter.native='submitLogin')
      br
    mu-raised-button(label='登录', slot='actions', primary, @click='submitLogin')
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            loginForm: {
                username: null,
                password: null
            },
            loading: false
        }
    },
    computed: mapState({
        doLogin: state => state.user.doLogin
    }),
    methods: {
        submitLogin() {
            this.loading = true
            this.$store
                .dispatch('user/login', {
                    username: this.loginForm.username,
                    password: this.loginForm.password
                })
                .then(() => {
                    this.loading = false
                })
            this.loginForm.username = null
            this.loginForm.password = null
        }
    }
}
</script>
