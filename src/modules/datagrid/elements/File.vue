<template>
    <div>
        <span v-if="params.value != '' && params.value != null" class="ag-grid-file">
            <a target="_blank" :href="params.value" class="ag-grid-file-link">
                <i class="ti-eye"></i> харах
            </a>
            <a :href="params.value" target="_blank" class="ag-grid-file-link" download>
                <i class="ti-download"></i> татах
            </a>
        </span>
        <span v-else>
            ...
        </span>
    </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend();
</script>

<style lang="scss">
.ag-grid-file {
    &-link {
        padding: 3px;
        border-radius: 3px;
        margin-right: 5px;
        color: #666666;
        transition: color .25s;
        display: inline-flex;
        align-items: center;

        i {
            font-size: 12px;
            margin-right: 3px;
        }

        &:hover {
            color: #0C78E6;
        }
    }
}

.ag-grid-divider {
    height: 20px;
    width: 1px;
    margin: 0 3px;
    display: inline-block;
    background: #dedede;
}
</style>
