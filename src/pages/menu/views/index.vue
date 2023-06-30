<template>
    <section class="page">
        <krud class="material" :template="property.template" :property="property">
            <template slot="nav">
                <slot name="nav"></slot>
            </template>
            <user-control slot="right"></user-control>
        </krud>
    </section>
</template>


<script>
    import UserControl from "../../../components/UserControl"

    export default {
        name: "menu_creator",
        components: {
            UserControl
        },
        computed:{
            property(){
                if (this.$project) {
                    return {
                        template: "canvas",
                        title: "Цэсний тохиргоо",
                        grid: '55',
                        form: '54',
                        actions: []
                    }
                }

                return {
                    template: "canvas",
                    title: "Цэсний тохиргоо",
                    grid: 'menu_grid',
                    form: 'menu_form',
                    actions: []
                }
            }
        },
        data() {
            return {

            };
        }
    };
</script>


