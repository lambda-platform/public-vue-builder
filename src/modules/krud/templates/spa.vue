<template>
    <section class="spa">
        <div class="crud-page">
            <div class="crud-page-header">
                <div class="crud-page-header-left">
                    <i v-if="$props.icon" :class="icon"></i>
                    <h3 v-if="$props.title">{{ $props.title.replace('-', ' ') }}</h3>
                    <slot name="nav"></slot>
                </div>

                <div class="crud-page-header-right">
                    <div class="tool-options">
                        <slot name="tooloptions"></slot>
                    </div>
                    <krudtools :search="search"
                               :refresh="refresh"
                               :exportExcel="exportExcel"
                               :print="print"
                               :save="save"
                               :isPrint="isPrint"
                               :isExcel="isExcel"
                               :isRefresh="isRefresh"
                               :isSave="isSave"
                               :isSearch="isSearch"
                    />
                    <slot name="right"></slot>
                </div>
            </div>

            <div class="crud-page-body">
                <div class="v-nav" v-if="hasVNavSlot">
                    <slot name="v-nav"></slot>
                </div>
                <div class="dg-flex">
                    <div class="data-grid">
                        <datagrid ref="grid" :schemaID="grid"
                                  :hasSelection="typeof $props.hasSelection === undefined?false:$props.hasSelection"
                                  :paginate="50"
                                  :fnEdit="edit"
                                  :fnQuickEdit="quickEdit"
                                  :fnView="view"
                                  :actions="$props.actions"
                                  :dblClick="$props.dbClickAction"
                                  :user_condition="$props.user_condition? $props.user_condition :null"
                                  :custom_condition="$props.custom_condition? $props.custom_condition :null"
                                  :onRowSelect="$props.onRowSelect"
                        />
                    </div>

                    <div class="data-form" :style="`width: ${form_width ? form_width : 600}`">
                        <dataform :style="`width: ${form_width ? form_width : 600}`" ref="form" :schemaID="form"
                                  :editMode="editMode" :onSuccess="onSuccess"
                                  :onError="onError"></dataform>
                    </div>
                </div>
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

