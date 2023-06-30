<template>

    <FormItem :label=label :prop=rule>
        <Input type="text" v-model="model.form[model.component]"
               autocomplete="new-password"
               :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label">
            <Tooltip slot="append" :content="lang.Create_a_password" placement="left">
                <Button @click="generatePass()" icon="ios-key-outline"></Button>
            </Tooltip>
        </Input>
    </FormItem>

</template>

<script>


    export default {
        props: ["model", "label", "rule", "meta"],
        computed: {
            lang() {
                const labels = ['Create_a_password',
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataForm.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        methods: {

            generatePass() {
                this.model.form[this.model.component] = Math.floor(
                    100000 + Math.random() * 900000
                );
            }
        }
    };
</script>
