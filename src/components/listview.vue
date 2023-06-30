<template>
    <section class="page page-list">
        <div class="page-list-header">
            <h3>{{ title }} ({{ listData.length }})</h3>
            <div class="page-list-header-search">
                <Input @on-keyup="filterList" icon="ios-search" :placeholder="lang1.pleaseEnterSearchValue"
                       style="width: 200px"/>
            </div>
            <div class="page-list-header-control">
                <router-link :to="`${prefix ? prefix : ''}/${type}/builder`" class="btn-del">
                    <Button type="success">
                        <Icon type="md-add"></Icon>
                        {{ lang.add }}
                    </Button>
                </router-link>
            </div>
        </div>

        <div v-if="loading" class="loader">
            <div class="loader-wrapper">
                <div class="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h3>Түр хүлээнэ үү</h3>
            </div>
        </div>

        <Row v-else :gutter="16" class="pz-list"
             v-slimscroll="{height:'100vh-30',size:7,alwaysVisible: true,wheelStep:7,color:'#2C3A47'}">
            <Col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in filteredList" :key="item.index">
                <div class="pz-list-item">
                    <div class="pz-list-item-body">
                        <h3>{{ item.name }}</h3>
                        <small>{{ item.created_at }}</small>
                    </div>
                    <div class="pz-list-item-control">

                        <a href="javascript:void(0);" class="btn-preview"
                           style="margin-right: 5px; font-size: 10px"
                           v-if="type == 'form' || type == 'grid' || type == 'datasource'">
                            {{ item.id }}
                        </a>

                        <router-link :to="`${prefix ? prefix : ''}/${type}/preview/${item.id}`" class="btn-preview"
                                     v-if="preview != 'hidden'">
                            <Icon type="ios-eye"></Icon>
                        </router-link>&nbsp;
                        <a href="javascript:void(0);" class="btn-preview"
                           v-if="type == 'form' || type == 'grid' || type == 'datasource'"
                           @click="duplicate(item.id, type)">
                            <Icon type="md-copy"></Icon>
                        </a>
                        <span>
                        <router-link :to="`${prefix ? prefix : ''}/${type}/builder/${item.id}`" class="btn-edit">
                            <Icon type="md-create"></Icon>
                        </router-link>
                        <Poptip confirm :title="lang.delete_data" confirm width="180" :ok-text="lang1.yes"
                                :cancel-text="lang1.no" @on-ok="deleteListItem(item.id)" @on-cancel="cancel">
                            <a href="javascript:void(0)" class="btn-del">
                                <Icon type="ios-trash"></Icon>
                            </a>
                        </Poptip>
                    </span>
                    </div>
                </div>
            </Col>
        </Row>
        <Modal
            v-model="duplicateModal"
            :title="lang1.copy"
            :ok-text="lang1.copy"
            @on-ok="doDuplicate"
        >
            <label>{{ lang1.name }}</label>
            <Input v-model="duplicateData.name" :placeholder="lang1.name" style="width: 100%"/>
            <label v-if="type === 'form' || type === 'grid'">{{ lang1.table }} (DB table)</label>
            <Select v-if="type === 'form'" v-model="duplicateData.schema.model" :placeholder="lang1.selectTable"
                    clearable
                    style="width: 100%"
                    filterable>
                <Option v-for="item in tableList" :value="item" :key="item.index">{{ item }}</Option>
            </Select>
            <Select v-if="type === 'grid'" v-model="duplicateData.schema.model" :placeholder="lang1.selectTable"
                    clearable
                    filterable style="width: 100%">
                <OptionGroup :label="lang.table_list">
                    <Option v-for="item in tableList" :value="item" :key="item.index">{{ item }}</Option>
                </OptionGroup>
                <OptionGroup :label="lang.table_list">
                    <Option v-for="item in viewList" :value="item" :key="item.index">{{ item }}</Option>
                </OptionGroup>
            </Select>
            <label v-if="type === 'grid'">{{ lang1.basicTable }} (DB table)</label>
            <Select v-if="type === 'grid'" v-model="duplicateData.schema.mainTable" :placeholder="lang1.selectTable"
                    clearable style="width: 100%" filterable>
                <Option v-for="item in tableList" :value="item" :key="item.index">{{ item }}</Option>
            </Select>
        </Modal>
    </section>
</template>

<script>
import {loadLanguageAsync} from "../locale/index";

export default {
    props: ["title", "type", "src", "preview", "prefix"],
    data() {
        return {
            duplicateModal: false,
            loading: true,
            listData: [],
            filteredList: [],
            duplicateData: {
                schema: {},
                name: null,
                id: null,
            },
            tableList: window.init["dbSchema"]["tableList"],
            viewList: window.init["dbSchema"]["viewList"],
            reportList: window.init["dbSchema"]["reportList"],
        };
    },

    created() {
        this.getData();
    },
    computed: {
        lang() {
            const labels = ['add', 'delete_data'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('puzzle.' + labels[i]);
                return obj;
            }, {});
        },
        lang1() {
            const labels = ['pleaseEnterSearchValue', 'yes', 'no', 'copy', 'name', 'selectTable', 'table', 'basicTable', 'table_list'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('components.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {
        beforeMount() {
            if (this.selectedLang != "mn") {
                loadLanguageAsync(this.selectedLang);
            }
        },

        switchLanguage(val) {
            this.selectedLang = val;
            loadLanguageAsync(val);
        },

        getData() {
            axios.get(this.$props.src).then(({data}) => {
                this.loading = false;
                this.listData = data.data.sort((s1, s2) => {
                    return s2.id - s1.id;
                });
                this.filteredList = this.listData.map(o => ({...o}));
            });
        },

        doDuplicate() {
            let src = "/lambda/puzzle/schema/form"
            if (this.type === "grid") {
                src = "/lambda/puzzle/schema/grid";

                this.duplicateData.schema.schema.forEach(col => {
                    col.table = this.duplicateData.schema.model
                });
            }
            if (this.$project) {
                src = `/lambda/puzzle/project/${this.$project.id}/form`
                if (this.type === "grid") {
                    src = `/lambda/puzzle/project/${this.$project.id}/grid`;

                    this.duplicateData.schema.schema.forEach(col => {
                        col.table = this.duplicateData.schema.model
                    });
                }
            }
            // if(this.type == "from"){
            //   this.duplicateData.schema.ui.schema = [];
            // }

            let data = {
                name: this.duplicateData.name,
                schema: JSON.stringify(this.duplicateData.schema)
            };
            if (this.type === "datasource") {
                src = "/lambda/puzzle/schema/datasource"
            }
            axios.post(src, data).then(({data}) => {
                if (data.status) {
                    this.$Notice.success({
                        title: 'Амжилттай хадгалагдлаа',
                        desc: `"${this.formName}" формын мэдээлэл амжилттай хадгалагдлаа.`
                    });
                    this.duplicateModal = false;
                    this.duplicateData = {
                        schema: {},
                        name: null,
                        id: null,
                    };
                    this.getData();
                } else {
                    this.$Notice.error({
                        title: 'Хадгалах үед алдаа гарлаа!',
                    });
                }
            });
        },
        duplicate(id, type) {
            let src = `/lambda/puzzle/schema/form/${id}/builder`
            if (this.type == "grid") {
                src = `/lambda/puzzle/schema/grid/${id}`
            }

            if (this.$project) {
                src = `/lambda/puzzle/project/${this.$project.id}/form/${id}/builder`
                if (this.type == "grid") {
                    src = `/lambda/puzzle/project/${this.$project.id}/grid/${id}`
                }
            }
            axios.get(src)
                .then(({data}) => {
                    this.duplicateData.name = data.data.hasOwnProperty('name') ? data.data.name : data.data.model;
                    this.duplicateData.schema = JSON.parse(data.data.schema);
                    this.duplicateData.id = id;
                    this.duplicateModal = true;
                }).catch(o => {
                console.log(o);
            });
        },
        deleteListItem(id) {
            axios.delete(this.$project ? `/lambda/puzzle/delete/project/vb_schemas/${this.$project.id}/${this.type}/${id}` : `/lambda/puzzle/delete/vb_schemas/${this.type}/${id}`).then(o => {
                this.filteredList = this.filteredList.filter(
                    item => item.id !== id
                );
                this.listData = this.listData.filter(item => item.id !== id);
                this.$Message.success("444 Амжилттай устгалаа!");
            });
        },
        cancel() {
        },
        filterList($event) {
            let vm = this;
            let q = $event.target.value;
            if (q != "") {
                let filtered = vm.listData.filter(
                    (f) => {
                        f.name
                            .toString()
                            .toLowerCase()
                            .indexOf(q.toLowerCase()) >= 0
                    }
                );
                vm.filteredList = filtered.map(o => ({...o}));
            } else {
                vm.filteredList = vm.listData.map(o => ({...o}));
            }
        }
    }
};
</script>
