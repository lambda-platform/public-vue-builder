/**
 * Created by n0m4dz on 5/29/17.
 */
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        dataform: {
            model: null,
            identity: null,
            timestamp: false,
            labelPosition: "top",
            labelWidth: null,
            padding: 8,
            schema: [],
            forms: []
        },
    }
});
