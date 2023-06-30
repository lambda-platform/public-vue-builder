<template>
    <section>
        <agent v-if="$route.params.module == 'agent'" :baseUrl="microserviceUrl">
            <user-control slot="user-control"></user-control>
        </agent>

        <agent-form v-if="$route.params.module == 'profile'" type="profile" :baseUrl="microserviceUrl">
            <user-control slot="user-control"></user-control>
        </agent-form>

        <agent-form v-if="$route.params.module == 'password'" type="password" :baseUrl="microserviceUrl">
            <user-control slot="user-control"></user-control>
        </agent-form>
<div class="role">
        <lambda-role v-if="$route.params.module == 'role'">
        </lambda-role>
</div>
    </section>
</template>

<script>
export default {

    computed:{
        microserviceUrl(){
            if(window.init.projectSettings){
                return window.init.projectSettings.production_url;
            } else {
                return ""
            }

        }
    },
    created() {

        let token = this.getCookie('token');
        axios.defaults.headers.common['Authorization'] = 'Bearer '+token;

    },

    methods:{
        getCookie(n) {
            let a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
            return a ? a[1] : '';
        },
    }
};
</script>
