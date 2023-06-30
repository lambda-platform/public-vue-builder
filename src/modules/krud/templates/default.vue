<template>
    <section class="template2">
        <div class="crud-page">
            <div class="crud-page-header">
                <div class="crud-page-header-left">
                    <h3>{{ $props.title.replace('-', ' ') }}</h3>
                </div>
                <div class="crud-page-header-right">
                    <slot name="tooloptions"></slot>
                    <krudtools :search="search" :refresh="refresh" :exportExcel="exportExcel"></krudtools>
                </div>
            </div>

            <div class="crud-page-body">
                <div class="data-grid">
                    <datagrid ref="grid" :schemaID="grid" :paginate="50" :fnEdit="edit" :fnQuickEdit="quickEdit"
                              :fnView="view" :actions="$props.actions"></datagrid>
                </div>
                <div class="data-form">
                    <dataform ref="form" :schemaID="form" :editMode="editMode" :onSuccess="onSuccess"
                              :onError="onError"></dataform>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import slidePanel from "../components/slidePanel";

export default {
    props: ["title", "grid", "form"],
    components: {
        "slide-panel": slidePanel
    },

    data() {
        return {
            gridSrc: "",
            formSrc: "",
            openSlidePanel: false,
            editMode: false
        };
    },

    created() {
        this.$emit("grid-add");
    },

    methods: {
        // Grid functions
        view(id) {
            console.log(id);
        },

        edit(id) {
            this.openSlidePanel = true;
            this.editMode = true;
            this.$refs.form.editModel(id);
        },

        quickEdit(id) {
            console.log(id);
        },

        // Form functions
        onSuccess(val) {
            if (this.editMode) {
                this.$refs.grid.update(val);
            } else {
                this.$refs.grid.append(val);
            }
        },

        onError(val) {
        }
    }
};
</script>
