<template>
    <section class="list-template">
        <div :class="`crud-page ${hideHeader ? 'no-header' : '' }`">
            <div class="crud-page-header">
                <div v-if="hasNavSlot" class="krud-left">
                    <div class="crud-page-header-left">
                        <slot name="nav"></slot>
                    </div>
                </div>

                <div v-else class="crud-page-header-left">
                    <i v-if="$props.icon" :class="icon"></i>
                    <h3 v-if="$props.title">{{ $props.title.replace(/-/g, ' ') }}</h3>
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
                    <datagrid ref="grid"
                              :schemaID="grid"
                              :paginate="50"
                              :fnEdit="edit"
                              :fnQuickEdit="quickEdit"
                              :fnView="view"
                              :hasSelection="typeof $props.hasSelection === undefined ? false : $props.hasSelection"
                              :onRowSelect="$props.onRowSelect"
                              :actions="$props.actions"
                              :permissions="$props.permissions"
                              :user_condition="$props.user_condition? $props.user_condition :null"
                              :custom_condition="$props.custom_condition? $props.custom_condition :null"
                              :dblClick="$props.dbClickAction"
                              :liveData="$props.liveData"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import mixins from "./mixins";

export default {
    mixins: [mixins],
};
</script>
