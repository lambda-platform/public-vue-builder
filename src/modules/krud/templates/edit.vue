<template>
    <section class="offcanvas-template">
        <div class="crud-page">
            <div class="crud-page-header">

                <div class="crud-page-header-left">
                    <h3>{{title}}</h3>
                    <slot name="nav"></slot>
                </div>

                <div class="crud-page-header-right">
                    <slot name="tooloptions"></slot>
                    <slot name="right"></slot>
                </div>
            </div>

            <div class="crud-page-body">
                <div class="v-nav" v-if="hasVNavSlot">
                    <slot name="v-nav"></slot>
                </div>
                <div class="dg-flex">
                    <dataform ref="form" :schemaID="schema" :editMode="true" :onSuccess="onSuccess"
                              :onError="onError"/>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import mixins from "./mixins";

export default {
    props: ["schema", "id"],
    mixins: [mixins],
    mounted() {
        setTimeout(() => {
            this.$refs.form.editModel(this.$props.id?this.$props.id:1);
        }, 500);
    },

    methods: {
        onSuccess(val) {
        },

        onError(val) {
        }
    }
};
</script>


