<template>
    <FormItem :label=label :prop=rule>
        <div>{{ lang.notFound }}</div>
    </FormItem>
</template>

<script>

export default {
    props: ["model", "rule", "label", "meta"],
    computed: {
        lang() {
            const labels = ['notFound',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },
    methods: {

    },
};
</script>
