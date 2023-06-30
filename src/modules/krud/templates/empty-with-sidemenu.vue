<template>
    <section class="offcanvas-template">
        <div class="crud-page">
            <paper-header class="mini paper-header-nav" style="height: 60px">
                <template slot="left">
                    <slot name="left"></slot>
                </template>
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
import slidePanel from "../components/slidePanel";
import crudLog from "../components/crudLog";
import mixins from "./mixins";
export default {
    mixins: [mixins],
    components: {
        "slide-panel": slidePanel,
        "crud-log": crudLog,
    },
};
</script>
