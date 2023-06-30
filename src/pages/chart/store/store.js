/**
 * Created by n0m4dz on 5/29/17.
 */
const state = {
    users: ['bat', 'bold']
}

const getters = {
    users: (state) => {
        return state.users
    }
}

const mutations = {
    addUser: (state) => {
        state.users.push('tselmeg')
    }
}

const actions = {
    addUser: ({ commit }) => {
        setTimeout(() => {
            commit('addUser')
        }, 1000)
    }
}

export default {
    state, getters, mutations, actions
}
