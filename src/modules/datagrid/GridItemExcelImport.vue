<template>
    <Row :class="`gb-table-row ${ expanded ? 'active' : ''}`">
        <Col span="3">
        <span class="drag-handler">
            <Icon type="ios-move"></Icon>
        </span>
            <strong>
                <span>{{ item.model }}</span>
                <small>{{ item.dbType }}</small>
            </strong>
        </Col>
        <Col span="1" class="center">
            <i-switch v-model="item.canExcelImport" size="small"></i-switch>
        </Col>

        <Col span="3">
            <Select v-model="item.excelImportGridType" placeholder="Төрөл" clearable filterable>
                <Option v-for="item in elementList" :value="item.element" :key="item.index">{{ item.element }}
                </Option>
            </Select>
        </Col>

        <Col span="3">
            <Input v-model="item.excelImportFieldName" :placeholder="item.model"/>
        </Col>

        <Col span="1" class="center">
            <a href="javascript:void(0)" :class="`expand-toggle ${ expanded ? 'active' : ''}`"
               @click="expanded = !expanded">
                <Icon type="ios-arrow-down"></Icon>
            </a>
        </Col>

        <Col span="24" :class="`item-more-options ${ expanded ? 'active' : '' }`">
            <excel-import-expand-option :item="item"></excel-import-expand-option>
        </Col>
    </Row>
</template>

<script>
    import expandOption from "./ExpandOption";
    import excelImportExpandOption from "./ExcelImportExpandOption";
    import {elementList} from "./elements";

    let elements = window.init.data_grid_custom_elements ? [...elementList, ...window.init.data_grid_custom_elements.map(element => {
        return element
    })] : elementList;

    export default {
        props: ["item", "edit", "relation", "meta"],
        components: {
            "expand-option": expandOption,
            "excel-import-expand-option": excelImportExpandOption
        },
        data() {
            return {
                elementList: elements,
                expanded: false
            };
        }
    };
</script>


