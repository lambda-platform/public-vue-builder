<template>
    <div class="dv-pagination">
        <div class="dv-pagination-info">
            <div class="dv-pagination-info-sort">
                <Select class="dv-pagination-sort-select roles-select" clearable @on-change="filterByRole"
                        :placeholder="lang.categorySearch"
                        label-in-value
                        style="width:200px">
                    <Option v-for="item in roles" :key="item.index" :value="item.id">
                        <span>{{ item.display_name }}</span>
                    </Option>
                </Select>

                <Select class="dv-pagination-sort-select" @on-change="sortSelect" :placeholder="lang.sort" label-in-value
                        style="width:200px">
                    <Option value="idASC">
                        <span >  ID {{lang.by}} : </span>
                        <span class="dv-sort-direction">&uarr;{{lang.ascending}}</span>
                    </Option>
                    <Option value="idDESC">
                        <span>ID {{lang.by}} : </span>
                        <span class="dv-sort-direction">&darr;{{lang.descending}}</span>
                    </Option>
                    <Option value="loginASC">
                        <span>{{lang.byLoginName}}:</span>
                        <span class="dv-sort-direction">&uarr;{{lang.ascending}}</span>
                    </Option>
                    <Option value="loginDESC">
                        <span>{{lang.byLoginName}}:</span>
                        <span class="dv-sort-direction">&darr;{{lang.descending}}</span>
                    </Option>
                    <Option value="createdASC">
                        <span>{{lang.dateAdded}}: </span>
                        <span class="dv-sort-direction">&uarr;{{lang.ascending}}</span>
                    </Option>
                    <Option value="createdDESC">
                        <span>{{lang.dateAdded}}: </span>
                        <span class="dv-sort-direction">&darr;{{lang.descending}}</span>
                    </Option>
                </Select>
            </div>
            <span class="page-info">{{lang.total}} <strong>{{isDeleted ? deletedModel.total : model.total}}</strong></span>
        </div>
        <div class="dv-pagination-control">
            <div class="dv-per-page ivu-page-options-elevator">
                <span>{{ lang.page }}</span>
                <input v-model.number.lazy="query.per_page" @keyup.enter="perPage">
                <span>{{ lang.shows }}</span>
            </div>
            <div>
                <Page :total="isDeleted ? deletedModel.total : model.total" size="small" :current="query.page"
                      :page-size="query.per_page" show-elevator @on-change="changePage" class-name="dv-control"></Page>
            </div>
        </div>
    </div>
</template>
<script>


    export default {
        name: "Pagination",
        props: {

            isDeleted: Boolean,
            deletedModel: {},
            model: {},
            isTop: Boolean,
            layout: '',
            query: {
                per_page: Number
            },
            roles: []
        },
//        props: ['pagination', 'isDeleted', 'deletedModel', 'model', 'isTop', 'layout', 'query'],

        computed: {
            lang() {
                const labels = ['db', 'categorySearch', 'sort', 'ascending', 'descending', 'dateAdded', 'byLoginName', 'by', 'total','page', 'shows'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('user.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        methods: {


            perPage() {
//                this.query.per_page = val;
                this.$parent.fetchData();
                this.$parent.fetchDeletedData();
            },
            changePage(page) {
                this.query.page = page;
                this.$parent.fetchData();
                this.$parent.fetchDeletedData();
            },
            sortSelect(sort) {
                if (sort.value === 'idASC') {
                    this.query.direction = 'asc';
                    this.query.column = 'id';
                    this.$parent.fetchData();
                    this.$parent.fetchDeletedData();
                }
                else if (sort.value === 'idDESC') {
                    this.query.direction = 'desc';
                    this.query.column = 'id';
                    this.$parent.fetchData();
                    this.$parent.fetchDeletedData();
                }
                else if (sort.value === 'loginASC') {
                    this.query.direction = 'asc';
                    this.query.column = 'login';
                    this.$parent.fetchData();
                    this.$parent.fetchDeletedData();
                }
                else if (sort.value === 'loginDESC') {
                    this.query.direction = 'desc';
                    this.query.column = 'login';
                    this.$parent.fetchData();
                    this.$parent.fetchDeletedData();
                }
                else if (sort.value === 'createdASC') {
                    this.query.direction = 'asc';
                    this.query.column = 'created_at';
                    this.$parent.fetchData();
                    this.$parent.fetchDeletedData();
                }
                else if (sort.value === 'createdDESC') {
                    this.query.direction = 'desc';
                    this.query.column = 'created_at';
                    this.$parent.fetchData();
                    this.$parent.fetchDeletedData();
                }
            },
            filterByRole(item) {
                if (typeof item == 'undefined' || item == undefined) {
                    this.query.role = 'all';
                } else {
                    this.query.role = item.value;
                }
                this.$parent.fetchData();
                this.$parent.fetchDeletedData();
            },




        }
    }
</script>
