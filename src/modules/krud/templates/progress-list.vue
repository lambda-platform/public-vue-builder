<template>
    <section class="offcanvas-template">
        <div class="crud-page">
            <div class="crud-page-header">
                <div class="crud-page-header-left">
                    <h3>{{ $props.title.replace('-', ' ') }}</h3>
                    <slot name="tooloptions"></slot>
                </div>

                <div class="crud-page-header-right">
                    <krudtools :search="search" :refresh="refresh" :exportExcel="exportExcel"></krudtools>
                </div>
            </div>

            <div class="crud-page-body">
                <datagrid ref="grid" :schemaID="grid" :paginate="50" :fnEdit="edit" :fnQuickEdit="quickEdit"
                          :fnView="view" :actions="$props.actions" :dblClick="$props.dbClickAction"
                          :rowCurrentChange="$props.rowCurrentChange"/>
            </div>
        </div>
    </section>
</template>

<script>
import mixins from "./mixins";

export default {
    mixins: [mixins]
};
</script>

