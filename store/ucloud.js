import axios from '@/plugins/axios'

export const state = () => ({
    hosts: {},
    projects: {}
})

export const mutations = {
    setProjects(state, { projects }) {
        state.projects = {}
        Object.keys(projects).forEach(key => {
            state.projects[key] = Object.assign({}, projects[key])
        })
    },
    addProjectHosts(state, { project_id, hosts }) {
        Object.keys(hosts).forEach(key => {
            state.hosts[key] = Object.assign(
                { project_id: project_id },
                hosts[key]
            )
        })
    },
    resetHosts(state) {
        state.hosts = {}
    }
}

export const actions = {
    async fetchProjects({ commit, redirect, state }) {
        let { data } = await axios.get('/api/ucloud/projects')
        commit('setProjects', { projects: data })
        return state.projects
    },
    async fetchHosts({ commit, redirect, state }, { project_id }) {
        let { data } = await axios.get(
            '/api/ucloud/hosts?project_id=' + encodeURIComponent(project_id)
        )
        commit('addProjectHosts', { project_id: project_id, hosts: data })
        return state.hosts
    }
}
