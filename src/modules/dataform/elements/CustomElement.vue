<template>
    <FormItem :label=label :prop=rule>
        Custom Element
    </FormItem>
</template>

<script>

export default {
    props: ["model", "rule", "label", "meta"],

};
</script>
