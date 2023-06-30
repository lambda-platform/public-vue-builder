<template>

    <Row :class="`gb-table-row ${ expanded ? 'active' : ''}`">
        <Col span="5">
            <strong>{{ item.model }}</strong>
        </Col>
        <Col span="4">
            <Input v-model="item.filter.label" :placeholder="item.label != null ? item.label : item.model"/>
        </Col>
        <Col span="4">
            <Select v-model="item.filter.type" :placeholder="lang.type" clearable filterable>
                <Option v-for="item in elementList" :value="item.element" :key="item.index">{{ item.element }}
                </Option>
            </Select>
        </Col>

        <Col span="2" class="center">
            <a href="javascript:void(0)" :class="`expand-toggle ${ expanded ? 'active' : ''}`"
               @click="expanded = !expanded">
                <Icon type="ios-arrow-down"></Icon>
            </a>
        </Col>

        <Col span="24" v-if="item.filter.relation" :class="`item-more-options ${ expanded ? 'active' : '' }`">
            <expand-filter-option :item="item" :schema="schema"></expand-filter-option>
        </Col>
    </Row>
</template>

<script>
    import expandFilterOption from "./ExpandFilterOption";
    import {elementList} from "./elements";

    let elements = window.init.data_grid_custom_elements ? [...elementList, ...window.init.data_grid_custom_elements.map(element => {
        return element
    })] : elementList;


    export default {
        props: ["item","schema", "edit", "relation"],
        computed: {
            lang() {
                const labels = ['type',
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        created() {
            if (this.item.filter.type == null) {
                this.item.filter.type = 'Text';
            }
        },

        components: {
            "expand-filter-option": expandFilterOption
        },

        data() {
            return {
                elementList: elements,
                expanded: false
            };
        },
    };
</script>


