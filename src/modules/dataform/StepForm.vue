<template>
    <div class="step-form">
        <div class="step-form-header">
            <Steps :current="0" size="small">
                <Step v-for="s in step.list" :key="s.id" :title="s.name"></Step>
            </Steps>
        </div>
        <div class="step-form-body" v-for="(s, index) in step.list" v-if="index === currentStep" :key="s.id">
            <dataform ref="form"
                      :schemaID="s.formId"
                      :do_render="currentStep"
                      :editMode="editIndex >= 0 ? true : false"
                      :isSubForm="true"
                      :onSuccess="onSuccess"
                      :step="true"
                      :onError="onError"/>
        </div>
    </div>
</template>

<script>

export default {
    props: ['step', 'currentStep', 'editIndex', 'onSuccess', 'onError']
}
</script>

