<template>
    <FormItem :label=label :prop=rule>
        <RadioGroup v-model="model.form[model.component]">
            <Radio :label="item.value" v-for="item in options" :key=item.index
                   :disabled="meta && meta.disabled ? meta.disabled : false">
                <span>{{item.label}}</span>
            </Radio>
            <Radio :label="other">
                <span>{{lang.other}}:
                    <Input type="text" v-model="other"
                           :placeholder="lang.pleaseWriting"/>
                </span>
            </Radio>
        </RadioGroup>
    </FormItem>
</template>

<script>

    export default {
        props: ["model", "label", "rule", "meta"],
        methods: {
        },
        data() {
            return {
                other: ''
            }
        },

        computed: {
            lang() {
                const labels = ['pleaseWriting', 'other'
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            },
            options() {
                this.other=this.model.form[this.model.component];

                if (this.meta.options.length >= 1) {
                    return this.meta.options;
                } else if (this.relations) {
                    if (this.relations[this.meta.relation.table]) {
                        if (this.relations[this.meta.relation.table]['data']) {
                            return this.relations[this.meta.relation.table]['data']
                        } else
                            return [];
                    } else
                        return [];
                }
            }
        }
    };
</script>
