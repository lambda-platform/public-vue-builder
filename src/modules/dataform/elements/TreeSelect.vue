<template>
    <FormItem :label=label :prop=rule>
        <div class="tree-select">
            <tree :data="treeData" @on-select-change="selected" v-if="!loading"></tree>
<!--            <Cascader :data="treeData" v-model="model.form[model.component]"></Cascader>-->

<!--            {{treeData}}-->
        </div>
    </FormItem>
</template>
<script>

   const getChildren = (rows, parentId, selectedValue)=>{


        let filtred = rows.filter(row=>row.parent_value == parentId)

        return filtred.map(row=>{
            row.children = getChildren(rows, row.value, selectedValue);
            if(row.children.length >= 1){
                row.expand = true
            }
            if(`${row.value}` == `${selectedValue}`)
                row.selected = true;
            else
                row.selected = false;

            row.title = row.label

            return row
        })
    };
    export default {

        props: ["model", "rule", "label", "meta", "disabled", "relation_data"],

        data(){
          return {
              treeData:[],
              loading:false
          }
        },
        computed: {
            treeValue(){
                return this.model.form[this.model.component]
            }
        },
        watch:{
            relation_data(){
               this.options();
            },
            treeValue(){
                this.loading = true
               this.options();
            },
        },

        methods: {
            options() {
                if(this.relation_data){
                    if (this.relation_data.length >= 1) {
                        let filtred = this.relation_data.filter(row=>row["parent_value"] === undefined);
                        filtred.map(row=>{
                            row.children = getChildren(this.relation_data, row.value, this.model.form[this.model.component]);
                            if(row.children.length >= 1){
                                row.expand = true
                            }

                            if(row.value == this.model.form[this.model.component])
                                row.selected = true;
                            else
                                row.selected = false;

                            row.title = row.label
                            return row
                        });

                       Vue.set(this.$data, "treeData", filtred);

                        // this.$set(this.$data, 'treeData', filtred);

                        setTimeout(()=>{
                            this.loading = false
                        }, 10)

                    } else {
                        this.treeData = []
                    }
                } else {
                    this.treeData = []
                }

            },
            selected(e){
                if(e.length >= 1)
                    Vue.set(this.model.form, this.model.component, e[0].value);
            },

        }
    };
</script>
