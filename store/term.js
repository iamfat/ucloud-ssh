export const state = () => ({
    host: null
})

export const mutations = {
    connect(state, host) {
        state.host = host
    }
}

export const actions = {
    connect({ commit, redirect }, host) {
        commit('connect', host)
    }
}
