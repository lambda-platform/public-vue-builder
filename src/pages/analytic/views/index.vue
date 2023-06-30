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
    export default {
        name: "crud",
        data() {
            return {
                property: {
                    template: "canvas",
                    title: "Анализ",
                    grid: 'analytic_grid',
                    form: 'analytic_form',
                    actions: []
                }
            };
        }
    };
</script>


