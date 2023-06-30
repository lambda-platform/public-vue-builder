<template>
    <section class="empty-template">
        <div :class="`crud-page ${hideHeader ? 'no-header' : '' }`">
            <paper-header class="mini with-tab-menu paper-header-nav">
                <template slot="nav">
                    <slot name="nav"></slot>
                </template>
                <template slot="right-tools">
                    <slot name="right_tools"></slot>
                </template>
                <template slot="right">
                    <slot name="right"></slot>
                </template>
            </paper-header>
            <div class="crud-page-body">
                <div class="v-nav" v-if="hasVNavSlot">
                    <slot name="v-nav"></slot>
                </div>
                <div class="dg-flex">
                    <slot name="dg-slot-body"></slot>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    computed: {
        hasVNavSlot() {
            return !!this.$slots['v-nav']
        }
    },
};
</script>
