<template>
    <Button class="success" @click="cbfn">
        Click here
    </Button>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
    methods: {
        cbfn(){
            alert('working')
        }
    }
});
</script>
