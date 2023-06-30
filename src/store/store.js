/**
 * Created by n0m4dz on 5/29/17.
 */
import Vuex from 'vuex'


Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: window.init.user,
        showLogout: false
    },

    getters: {
        user: state => state.user,
        showLogout: state => state.showLogout,
    },

    actions: {
        showLogoutModal({
            commit
        }, payload) {
            console.log('working');
            commit('showLogoutModal', payload)
        }
    },

    mutations: {
        showLogoutModal({
            state
        }, payload) {
            state.showLogout = payload;
        }
    },

    modules: {
    }
});
