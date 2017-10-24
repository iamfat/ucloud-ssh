<template lang="pug">
#hosts
  template(v-if='fetching')
    div(style='text-align:center;padding:40px auto')
      mu-circular-progress
  template(v-else)
    div(style='padding:1em 1em 0 0')
      mu-text-field(hintText='快速定位', v-model='keyword', icon='search',fullWidth=true)
    template(v-if='hosts.length==0')
      p(style='text-align:center;color:#999') 没有候选结果
    template(v-else)
      mu-list(:value='currentHost')
        mu-list-item(v-for='(host,index) in hosts', :key='index', :value='host.id', @click='connectTo(host)',:title='host.name', :describeText='host.ip')
          mu-avatar(slot='leftAvatar',icon='dns')
          mu-badge(:content='host.project.name',color="#36c")
          | &nbsp;
          mu-badge(:content='host.tag',color="#36c")
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            keyword: null,
            fetching: false,
            currentHost: null
        }
    },
    computed: mapState({
        isLoggedIn: state => !!state.user.me,
        hosts(state) {
            var hosts = state.ucloud.hosts
            var projects = state.ucloud.projects

            hosts = Object.keys(hosts).map(key => {
                var host = hosts[key]
                var project = projects[host.project_id]
                return Object.assign(
                    { project: Object.assign({}, project) },
                    host
                )
            })

            hosts = hosts.filter(host => {
                if (this.keyword) {
                    return (
                        host.name.match(this.keyword) ||
                        host.ip.match(this.keyword)
                    )
                } else {
                    return true
                }
            })

            var keys = Object.keys(hosts)
            keys.sort((ak, bk) => {
                var a = hosts[ak]
                var b = hosts[bk]
                if (a.project_id !== b.project_id) {
                    return a.project.name > b.project.name
                }
                if (a.tag !== b.tag) {
                    return a.tag > b.tag
                }
                return a.name > b.name
            })
            return keys.map(key => hosts[key])
        }
    }),
    watch: {
        isLoggedIn(isLoggedIn) {
            isLoggedIn && this.fetchProjects()
        }
    },
    methods: {
        connectTo(host) {
            this.$store.dispatch('term/connect', host)
            this.currentHost = host.id
        },
        async fetchProjects() {
            this.fetching = true
            let projects = await this.$store.dispatch('ucloud/fetchProjects')
            for (var id in projects) {
                await this.$store.dispatch('ucloud/fetchHosts', {
                    project_id: id
                })
            }
            this.fetching = false
        }
    },
    created() {
        if (this.$store.state.user.me) this.fetchProjects()
    }
}
</script>

<style lang="stylus">
#hosts
    background-color white

    .mu-item.selected
        background-color #3a9

        .mu-item-title
            color #fff
            font-weight bold

        .mu-item-text
            color #f1f1f1
</style>