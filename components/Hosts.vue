<template lang="pug">
#hosts
  div(style='padding:1em 1em 0 0')
    mu-text-field(hintText='快速定位', v-model='keyword', icon='search',fullWidth=true)
  mu-list
    template(v-if='fetched')
      mu-list-item(v-for='(host,index) in hosts', :key='index', :value='host.id', @click='connectTo(host)',:title='host.name', :describeText='host.ip')
        mu-avatar(slot='leftAvatar',icon='dns')
        mu-badge(:content='host.project.name',color="#36c")
        | &nbsp;
        mu-badge(:content='host.tag',color="#36c")
    template(v-else)
      div(style='text-align:center')
        mu-circular-progress
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      keyword: null,
      fetched: false
    }
  },
  computed: mapState({
    hosts (state) {
      var hosts = state.ucloud.hosts
      var projects = state.ucloud.projects
      
      hosts = Object.keys(hosts).map(key => {
        var host = hosts[key]
        var project = projects[host.project_id]
        return Object.assign({ project: Object.assign({}, project)}, host)
      })

      var keyword = this.keyword
      hosts = hosts.filter(host => {
          if (keyword) {
            return host.name.match(keyword) || host.ip.match(keyword)
          } else {
            return true
          }
        })

      var keys = Object.keys(hosts);

      keys.sort((ak,bk) => {
        var a = hosts[ak], b = hosts[bk]
        if (a.project_id != b.project_id) {
          return a.project.name > b.project.name
        }
        if (a.tag != b.tag) {
          return a.tag > b.tag
        }
        return a.name > b.name
      })
      return keys.map(key => hosts[key])
    }
  }),
  methods: {
    connectTo (host) {
      this.$store.dispatch('term/connect', host)
    }
  },
  mounted () {
    this.$store.dispatch('ucloud/fetchProjects').then(projects => {
      var r = Promise.resolve()
      Object.keys(projects).forEach(project_id => {
        r = r.then(()=>{
          return this.$store.dispatch('ucloud/fetchHosts', { project_id }).then(hosts => {
            console.log(hosts)
          })
        })
      })
      r.then(() => {
        this.fetched = true
      }).catch(e => {
        console.log(e)
      })
    })
  }
}
</script>

<style lang="stylus">
#hosts
  background-color white
</style>