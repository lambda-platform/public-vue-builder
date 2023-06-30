<template>
    <Row :class="`gb-table-row ${ expanded ? 'active' : ''}`">
        <Col span="3">
        <span class="drag-handler">
            <Icon type="ios-move"></Icon>
        </span>
            <strong>
                <Input v-if="item.virtualColumn" v-model="item.model" size="small" placeholder="Багана" />
                <span v-else>{{ item.model }}</span>
                <Select v-if="item.virtualColumn" v-model="item.dbType" size="small" >
                    <Option value="int" >int</Option>
                    <Option value="string" >varchar</Option>
                </Select>
                <small v-else>{{ item.dbType }}</small>

            </strong>
        </Col>
        <Col span="3">
            <Input v-model="item.label" :placeholder="item.model" size="small" />
        </Col>
        <Col span="3">
            <Select v-model="item.gridType" placeholder="Төрөл" clearable filterable size="small" >
                <Option v-for="item in elementList" :value="item.element" :key="item.index">{{ item.element }}
                </Option>
            </Select>
        </Col>

        <Col span="2" class="center">
            <InputNumber v-model="item.width" :min="0" placeholder="auto" size="small"  :disabled="!meta.width"/>
        </Col>

        <Col span="1" class="center">
            <i-switch v-model="item.hide" size="small"></i-switch>
        </Col>
        <Col span="2" class="center">
            <i-switch v-model="item.sortable" size="small"></i-switch>
        </Col>
        <Col span="1" class="center">
            <i-switch v-model="item.filterable" size="small"></i-switch>
        </Col>
        <Col span="2" class="center">
            <i-switch v-model="item.searchable" size="small"></i-switch>
        </Col>

        <Col span="2" class="center">
            <i-switch v-model="item.hasTranslation" size="small"></i-switch>
        </Col>

        <Col span="2" class="center">
            <i-switch v-model="item.printable" size="small"></i-switch>
        </Col>

        <Col span="1" class="center">
            <i-switch v-model="item.updateable" size="small"></i-switch>
        </Col>
        <Col span="1" class="center">
            <a href="javascript:void(0)" :class="`expand-toggle ${ expanded ? 'active' : ''}`"
               @click="expanded = !expanded">
                <Icon type="ios-arrow-down"></Icon>
            </a>
            <Button v-if="item.virtualColumn" shape="circle" type="error" size="small" icon="ios-trash" @click="deleteColumn"></Button>
        </Col>

        <Col span="24" v-if="item.relation" :class="`item-more-options ${ expanded ? 'active' : '' }`">
            <expand-option :item="item" shape="circle" icon="ios-search" :fieldList="fieldList"></expand-option>
        </Col>
    </Row>
</template>

<script>
    import expandOption from "./ExpandOption";
    import {elementList} from "./elements";

    let elements = window.init.data_grid_custom_elements ? [...elementList, ...window.init.data_grid_custom_elements.map(element => {
        return element
    })] : elementList;

    export default {
        props: ["item", "edit", "relation", "meta", "deleteVirtualColumn", "index", "fieldList"],
        components: {
            "expand-option": expandOption
        },
        data() {
            return {
                elementList: elements,
                expanded: false
            };
        },
        methods:{
            deleteColumn(){
                this.deleteVirtualColumn(this.index)
            }
        }
    };
</script>


