<template>
    <section>
        <agent v-if="$route.params.module == 'agent'">
            <user-control slot="user-control"></user-control>
        </agent>
        <agent-form v-if="$route.params.module == 'profile'" type="profile" :withoutHeader="withoutHeader">
            <user-control slot="user-control"></user-control>
        </agent-form>

        <agent-form v-if="$route.params.module == 'password'" type="password" :withoutHeader="withoutHeader">
            <user-control slot="user-control"></user-control>
        </agent-form>

        <notif-list v-if="$route.params.module == 'notify'"/>

        <logger v-if="$route.params.module == 'logger'"/>

        <settings v-if="$route.params.module == 'settings'" :menu-id="$route.query.id"/>
    </section>
</template>

<script>
import Settings from "./settings"

export default {
    components: {Settings},
    computed: {
        withoutHeader() {
            return window.init.withoutHeader === true ? true : false;
        },
    },
};
</script>
