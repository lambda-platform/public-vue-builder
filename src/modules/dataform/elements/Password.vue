<template>
    <div>
        <FormItem :label="lang.currentPassword" prop='current_password'
                  v-if="meta.passwordOption.edit_with_old_password">
            <Input type="password" v-model="model.form['current_password']"
                   autocomplete="new-password"
                   :placeholder="lang.currentPassword"/>
        </FormItem>
        <FormItem :label="lang._pass" :prop=rule>
            <Input :type="passwordGenerated ? 'text': 'password'" v-model="model.form[model.component]"
                   autocomplete="new-password"
                   :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label">
                <Tooltip slot="append"
                         :content="lang.Create_a_password"
                         placement="left" v-if="meta.passwordOption.generate">
                    <Button @click="generatePass()" icon="ios-key-outline"></Button>
                </Tooltip>
            </Input>
        </FormItem>
        <FormItem :label="lang.confirmPassword" prop='password_confirm'
                  v-if="meta.passwordOption.confirm">
            <Input :type="passwordGenerated ? 'text': 'password'" v-model="model.form['password_confirm']"
                   :placeholder="lang.confirmPassword"/>
        </FormItem>
    </div>
</template>

<script>

export default {
    props: ["model", "label", "rule", "meta"],
    computed: {
        lang() {
            const labels = ['currentPassword', 'confirmPassword', 'Create_a_password','_pass'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },
    created() {
        // console.log('PASSWORD', this.model.form[this.model.component]);
        // console.log(this.rule)
    },
    data() {

        return {
            passwordGenerated: false,

        }
    },
    methods: {
        generatePass() {
            let charactersArray = ['a-z', 'A-Z', '0-9', '#'];
            let CharacterSet = '';
            let password = '';

            if (charactersArray.indexOf('a-z') >= 0) {
                CharacterSet += 'abcdefghijklmnopqrstuvwxyz';
            }
            if (charactersArray.indexOf('A-Z') >= 0) {
                CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            }
            if (charactersArray.indexOf('0-9') >= 0) {
                CharacterSet += '0123456789';
            }
            if (charactersArray.indexOf('#') >= 0) {
                CharacterSet += '!{}()%&*$#^<>~@|';
            }
            for (let i = 0; i < 8; i++) {
                password += CharacterSet.charAt(Math.floor(Math.random() * CharacterSet.length));
            }
            this.model.form[this.model.component] = password;
            if (this.meta.passwordOption.confirm) {
                this.model.form['password_confirm'] = password;
            }
            this.passwordGenerated = true;
        }
    }
};
</script>
