<template>
    <div contenteditable="true" @input="update"></div>
</template>
<script>
export default {
    props: ["content", "el"],
    mounted: function() {
        this.$el.innerText = this.content == "" ? this.el : this.content;
    },
    methods: {
        update: function(event) {
            this.$emit("update", event.target.innerText);
        }
    }
};
</script>
