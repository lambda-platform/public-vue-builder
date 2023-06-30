<template>
    <Row class="gb-table-row">
        <Col span="6">
            <strong>
                <span>{{ item.model }}</span>
                <small>{{ item.dbType }}</small>
            </strong>
        </Col>
        <Col span="4" class="center">
            <i-switch v-model="item.editable.status" size="small"></i-switch>
        </Col>
        <Col span="6" class="center">
            <Select v-model="item.editable.type" :placeholder="lang.Select_fields" clearable
                    filterable>
                <Option v-for="item in editElements" :value="item" :key="item">{{item}}</Option>
            </Select>
        </Col>
        <Col span="4" class="center">
            <i-switch v-model="item.editable.shouldUpdate" size="small"></i-switch>
        </Col>
        <Col span="4" class="center">
            <i-switch :disabled="item.editable.status" v-model="item.editable.shouldPost" size="small"></i-switch>
        </Col>
    </Row>
</template>

<script>

    export default {
        props: ["item", "edit", "relation", "meta"],
        computed: {
            lang() {
                const labels = ['Select_fields',
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        data() {
            return {
                editElements: ['text', 'number', 'date'],
            };
        },
    };
</script>


