<template>
    <ul>
        <li v-for="(item, index) in menu" v-if="can(item)" :key="index">
            <!-- CRUD -->
            <Tooltip v-if="hasTooltip" :content="getTitle(item)" placement="right">
                <router-link :to="`/p/${item.id}`" v-if="item.link_to != 'link' && item.link_to != 'router-link'">
                    <i v-if="item.icon" :class="item.icon"></i>
                </router-link>
            </Tooltip>
            <router-link :to="`/p/${item.id}`" v-if="item.link_to != 'link' && item.link_to != 'router-link' && !hasTooltip">
                <i v-if="item.icon" :class="item.icon"></i>
                <span v-html="getTitle(item)"></span>
            </router-link>

            <!-- SPA URL -->
            <Tooltip v-if="hasTooltip" :content="getTitle(item)" placement="right">
                <router-link :to="item.url" v-if="item.link_to == 'router-link'">
                    <i v-if="item.icon" :class="item.icon"></i>
                </router-link>
            </Tooltip>
            <router-link :to="item.url" v-if="item.link_to == 'router-link' && !hasTooltip">
                <i v-if="item.icon" :class="item.icon"></i>
                <span v-html="getTitle(item)"></span>
            </router-link>

            <!-- Anchor link -->
            <Tooltip v-if="hasTooltip" :content="getTitle(item)" placement="right">
                <a :href="item.url" v-if="item.link_to == 'link'" target="_blank">
                    <i v-if="item.icon" :class="item.icon"></i>
                </a>
            </Tooltip>
            <a href="item.url" v-if="item.link_to == 'link' && !hasTooltip" target="_blank">
                <i v-if="item.icon" :class="item.icon"></i>
                <span v-html="getTitle(item)"></span>
            </a>
        </li>
    </ul>
</template>

<script>

export default {
    props: ['hasTooltip'],
    data() {
        return {
            menu: window.init.menu,
            cruds: window.init.cruds,
            permissions: window.init.permissions.permissions,
            extra: window.init.permissions.extra,
        };
    },
    created() {
    },
    methods: {
        can(menu) {
            if (this.permissions[menu.id]) {
                if (this.permissions[menu.id].show)
                    return true;
                else
                    return false
            } else
                return false;
        },

        getTitle(item) {
            if (item.link_to == 'crud') {
                let crudIndex = this.cruds.findIndex(crud => crud.id == item.url);
                if (crudIndex >= 0)
                    return this.cruds[crudIndex].title
                else
                    return ''
            } else
                return item.title;
        },
    }
};
</script>
