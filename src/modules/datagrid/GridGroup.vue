<template>
    <section>
        <div v-for="item in meta.items"
             :key="item.index">

            <section v-if="item.type && item.type == 'group'" class="header-group">
                <a href="javascript:void(0)" class="drag-handler">
                    <Icon type="ios-move"></Icon>
                </a>
                <input type="text" v-model="item.name">

                <draggable
                    v-model="item.children"
                    class="item-holder"
                    :options="{group:'col', handle: '.drag-handler'}">
                    <grid-group :meta="{meta: item.children, width: meta.width}"></grid-group>
                </draggable>
            </section>

            <grid-item v-else
                       :item="item"
                       :meta="{width: meta.width}"
                       :edit="editMode"></grid-item>
        </div>
    </section>
</template>

<script>
    import draggable from "vuedraggable";
    import GridItem from "./GridItem";

    export default {
        props: ['meta'],
        components: {
            draggable,
            "grid-item": GridItem,
        }
    }
</script>
