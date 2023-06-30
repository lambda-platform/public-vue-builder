<template>

    <FormItem :label=label :prop=rule>
        <Input type="text" v-model="model.form[model.component]"
               :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label">
            <Tooltip slot="append" :content="lang.createNumber" placement="left">
                <Button @click="generateNumber()" icon="ios-key-outline"></Button>
            </Tooltip>
        </Input>
    </FormItem>

</template>

<script>
    export default {
        props: ["model", "label", "rule", "meta"],
        computed: {
            lang() {
                const labels = ['createNumber',
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataForm.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        methods: {
            generateNumber() {
                this.model.form[this.model.component] = Math.floor(
                    1000 + Math.random() * 900000
                );
            }
        }
    };
</script>
