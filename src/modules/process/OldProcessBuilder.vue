<template>
    <div class="pb-space">
        <div class="pb-sidebar">
            <div class="pb-sidebar-body">
                <div class='fp-control-item'>
                    <label>Процессын нэр</label>
                    <Input v-model='processName' placeholder='Нэр оруулах'/>
                </div>

                <div class='fp-control-item'>
                    <label>Хандах эрхийн тохиргоо</label>
                    <Input v-model='processName' placeholder='Нэр оруулах'/>
                </div>
            </div>
            <div class="pb-sidebar-footer">
                <Button type='success' long @click='saveProcess'>Хадгалах</Button>
            </div>
        </div>

        <div class="pb-body">
            <Tabs type='card' :animated='false'>
                <!-- Main process config -->
                <TabPane label='Үндсэн тохиргоо' :key='`main-tab`' icon='md-code-working'>
                    <h1>Main config</h1>
                </TabPane>
                <!-- Permissions -->
                <TabPane v-if="schema.hasPermission" label='Хандах эрх тохиргоо' :key='`permission-tab`'
                         icon='md-code-working'>
                    <h1>Permission config</h1>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import "./scss/process.scss";

export default {
    name: "process-builder",
    data() {
        return {
            isLoading: false,
            processName: null,
            formList: [],
            schema: {
                hasPermission: false,
                steps: []
            }
        }
    },
    methods: {
        getForms() {
            this.isLoading = true;
            axios.get('/lambda/puzzle/schema/form').then(({data}) => {
                this.formList = data;
                this.isLoading = false;
            })
        },

        saveProcess() {

        },

        addStep() {

        },

        removeStep() {

        }
    }
}
</script>

<style scoped>

</style>
