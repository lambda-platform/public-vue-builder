<template>
    <Row :class="`gb-table-row ${ expanded ? 'active' : ''}`" v-if="item.updateable">
        <Col span="3">
        <strong>{{ item.model }}</strong>
        </Col>
        <Col span="3">
        <Input v-model="item.update.updateLabel" :placeholder="item.label != null ? item.label : item.model" />
        </Col>
        <Col span="4">
        <Input v-model="item.update.label" :placeholder="item.label != null ? item.label : item.model" />
        </Col>
        <Col span="2">
        <Input v-model="item.update.buttonLabel" :placeholder="item.label != null ? item.label : item.model" />
        </Col>
        <Col span="2">
            <Input v-model="item.update.buttonIcon" placeholder="icon" />
        </Col>
        <Col span="4">

        <Select v-model="item.filter.type" placeholder="Төрөл" clearable filterable>
            <Option v-for="item in elementList" :value="item.element" :key="item.index">{{ item.element }}
            </Option>
        </Select>
        </Col>
        <Col span="4">
            <i-switch v-model="item.update.refresh"></i-switch>
        </Col>

        <Col span="2" class="center">
        <a href="javascript:void(0)" :class="`expand-toggle ${ expanded ? 'active' : ''}`" @click="expanded = !expanded">
            <Icon type="ios-arrow-down"></Icon>
        </a>
        </Col>

        <Col span="24" v-if="item.update.relation" :class="`item-more-options ${ expanded ? 'active' : '' }`">
        <expand-filter-option :item="item" :schema="schema"></expand-filter-option>
        </Col>
    </Row>
</template>

<script>
import expandFilterOption from "./ExpandFilterOption";
import { elementList } from "./elements";

export default {
    props: ["item", "edit", "relation", "schema"],
    components: {
        "expand-filter-option": expandFilterOption
    },
    data() {
        return {
            elementList: elementList,
            expanded: false
        };
    }
};
</script>


