<template>
    <FormItem :label=label :prop=rule>
        <div class="ivu-input-wrapper ivu-input-type form-item-register">
            <!--            <multiselect-->
            <!--                v-model="registerChar1"-->
            <!--                :disabled="meta && meta.disabled ? meta.disabled : false"-->
            <!--                :options="options"-->
            <!--                @input="registerChanged"-->
            <!--                track-by="value"-->
            <!--                :searchable="true"-->
            <!--                :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label ? label : ''"-->
            <!--                label="label"-->
            <!--                class="select-char first-char">-->
            <!--            </multiselect>-->
            <!--            <multiselect-->
            <!--                v-model="registerChar2"-->
            <!--                :disabled="meta && meta.disabled ? meta.disabled : false"-->
            <!--                :options="options"-->
            <!--                @input="registerChanged"-->
            <!--                track-by="value"-->
            <!--                :searchable="true"-->
            <!--                :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label ? label : ''"-->
            <!--                label="label"-->
            <!--                class="select-char second-char">-->
            <!--            </multiselect>-->
            <Poptip placement="bottom" v-model="visibleChar1">
                <Button>
                    {{ registerChar1.label }}
                </Button>
                <div class="letters" slot="content">
                    <table>
                        <tr>
                            <td @click="setChar1('A')">А</td>
                            <td @click="setChar1('Б')">Б</td>
                            <td @click="setChar1('В')">В</td>
                            <td @click="setChar1('Г')">Г</td>
                            <td @click="setChar1('Д')">Д</td>
                            <td @click="setChar1('Е')">Е</td>
                            <td @click="setChar1('Ё')">Ё</td>
                        </tr>
                        <tr>
                            <td @click="setChar1('Ж')">Ж</td>
                            <td @click="setChar1('З')">З</td>
                            <td @click="setChar1('И')">И</td>
                            <td @click="setChar1('Й')">Й</td>
                            <td @click="setChar1('К')">К</td>
                            <td @click="setChar1('Л')">Л</td>
                            <td @click="setChar1('М')">М</td>
                        </tr>
                        <tr>
                            <td @click="setChar1('Н')">Н</td>
                            <td @click="setChar1('О')">О</td>
                            <td @click="setChar1('Ө')">Ө</td>
                            <td @click="setChar1('П')">П</td>
                            <td @click="setChar1('Р')">Р</td>
                            <td @click="setChar1('С')">С</td>
                            <td @click="setChar1('Т')">Т</td>
                        </tr>
                        <tr>
                            <td @click="setChar1('У')">У</td>
                            <td @click="setChar1('Ү')">Ү</td>
                            <td @click="setChar1('Ф')">Ф</td>
                            <td @click="setChar1('Х')">Х</td>
                            <td @click="setChar1('Ц')">Ц</td>
                            <td @click="setChar1('Ч')">Ч</td>
                            <td @click="setChar1('Ш')">Ш</td>
                        </tr>
                        <tr>
                            <td @click="setChar1('Щ')">Щ</td>
                            <td @click="setChar1('Ъ')">Ъ</td>
                            <td @click="setChar1('Ы')">Ы</td>
                            <td @click="setChar1('Ь')">Ь</td>
                            <td @click="setChar1('Э')">Э</td>
                            <td @click="setChar1('Ю')">Ю</td>
                            <td @click="setChar1('Я')">Я</td>
                        </tr>
                    </table>
                </div>
            </Poptip>

            <Poptip placement="bottom" v-model="visibleChar2">
                <Button class="no-border-radius">
                    {{ registerChar2.label }}
                </Button>
                <div class="letters" slot="content">
                    <table>
                        <tr>
                            <td @click="setChar2('A')">А</td>
                            <td @click="setChar2('Б')">Б</td>
                            <td @click="setChar2('В')">В</td>
                            <td @click="setChar2('Г')">Г</td>
                            <td @click="setChar2('Д')">Д</td>
                            <td @click="setChar2('Е')">Е</td>
                            <td @click="setChar2('Ё')">Ё</td>
                        </tr>
                        <tr>
                            <td @click="setChar2('Ж')">Ж</td>
                            <td @click="setChar2('З')">З</td>
                            <td @click="setChar2('И')">И</td>
                            <td @click="setChar2('Й')">Й</td>
                            <td @click="setChar2('К')">К</td>
                            <td @click="setChar2('Л')">Л</td>
                            <td @click="setChar2('М')">М</td>
                        </tr>
                        <tr>
                            <td @click="setChar2('Н')">Н</td>
                            <td @click="setChar2('О')">О</td>
                            <td @click="setChar2('Ө')">Ө</td>
                            <td @click="setChar2('П')">П</td>
                            <td @click="setChar2('Р')">Р</td>
                            <td @click="setChar2('С')">С</td>
                            <td @click="setChar2('Т')">Т</td>
                        </tr>
                        <tr>
                            <td @click="setChar2('У')">У</td>
                            <td @click="setChar2('Ү')">Ү</td>
                            <td @click="setChar2('Ф')">Ф</td>
                            <td @click="setChar2('Х')">Х</td>
                            <td @click="setChar2('Ц')">Ц</td>
                            <td @click="setChar2('Ч')">Ч</td>
                            <td @click="setChar2('Ш')">Ш</td>
                        </tr>
                        <tr>
                            <td @click="setChar2('Щ')">Щ</td>
                            <td @click="setChar2('Ъ')">Ъ</td>
                            <td @click="setChar2('Ы')">Ы</td>
                            <td @click="setChar2('Ь')">Ь</td>
                            <td @click="setChar2('Э')">Э</td>
                            <td @click="setChar2('Ю')">Ю</td>
                            <td @click="setChar2('Я')">Я</td>
                        </tr>
                    </table>
                </div>
            </Poptip>


            <input class="ivu-input"
                   :disabled="meta && meta.disabled ? meta.disabled : false"
                   @change="registerChanged"
                   type="number"
                   :maxlength="8"
                   :minlength="8"
                   v-model="registerNumber"/>
        </div>
        <div :id="`register_${model.component}`" class="ivu-form-item-error-tip"></div>
    </FormItem>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"],
    data() {
        return {
            registerNumber: null,
            visibleChar1: false,
            visibleChar2: false,
            registerChar1: {value: 'А', label: 'А'},
            registerChar2: {value: 'А', label: 'А'},
            options: [
                {value: 'А', label: 'А'},
                {value: 'Б', label: 'Б'},
                {value: 'В', label: 'В'},
                {value: 'Г', label: 'Г'},
                {value: 'Д', label: 'Д'},
                {value: 'Е', label: 'Е'},
                {value: 'Ё', label: 'Ё'},
                {value: 'Ж', label: 'Ж'},
                {value: 'З', label: 'З'},
                {value: 'И', label: 'И'},
                {value: 'Й', label: 'Й'},
                {value: 'К', label: 'К'},
                {value: 'Л', label: 'Л'},
                {value: 'М', label: 'М'},
                {value: 'Н', label: 'Н'},
                {value: 'О', label: 'О'},
                {value: 'Ө', label: 'Ө'},
                {value: 'П', label: 'П'},
                {value: 'Р', label: 'Р'},
                {value: 'С', label: 'С'},
                {value: 'Т', label: 'Т'},
                {value: 'У', label: 'У'},
                {value: 'Ү', label: 'Ү'},
                {value: 'Ф', label: 'Ф'},
                {value: 'Х', label: 'Х'},
                {value: 'Ц', label: 'Ц'},
                {value: 'Ч', label: 'Ч'},
                {value: 'Ш', label: 'Ш'},
                {value: 'Щ', label: 'Щ'},
                {value: 'Ъ', label: 'Ъ'},
                {value: 'Ы', label: 'Ы'},
                {value: 'Ь', label: 'Ь'},
                {value: 'Э', label: 'Э'},
                {value: 'Ю', label: 'Ю'},
                {value: 'Я', label: 'Я'}
            ]
        };
    },
    computed: {
        registerLocal() {
            return this.model.form[this.model.component];
        }
    },

    created() {
        // let value = this.model.form[this.model.component];
        // let firstchar = value.charAt(0);
        // this.registerChar1 = {value: firstchar, label: firstchar};
        // let secondchar = value.charAt(1);
        // this.registerChar2 = {value: secondchar, label: secondchar};
        // this.registerNumber = value.substring(2, 10);
    },
    watch: {
        registerLocal(value, oldValue) {
            if (value) {
                let firstchar = value.charAt(0);
                this.registerChar1 = {value: firstchar, label: firstchar};
                let secondchar = value.charAt(1);
                this.registerChar2 = {value: secondchar, label: secondchar};
                this.registerNumber = value.substring(2, 10);
            } else {
                this.registerNumber = null;
                this.registerChar1 = {value: 'А', label: 'А'};
                this.registerChar2 = {value: 'А', label: 'А'};
            }
        }
    },
    methods: {
        registerChanged() {
            if (this.registerNumber && this.registerChar1.value && this.registerChar2.value) {
                let preFix = this.registerChar1.value + this.registerChar2.value;
                let number = this.registerNumber.substring(0, 8);
                let fillRD = preFix + number;
                if (this.registerNumber.length > 8) {
                    this.registerNumber = number;
                } else if (fillRD.length == 10) {
                    Vue.set(this.model.form, this.model.component, fillRD);
                } else {
                    Vue.set(this.model.form, this.model.component, null);
                }
            } else {
                Vue.set(this.model.form, this.model.component, null);
            }
        },

        setChar1(val) {
            this.registerChar1.value = val;
            this.registerChar1.label = val;
            this.visibleChar1 = false;
            this.registerChanged();
        },

        setChar2(val) {
            this.registerChar2.value = val;
            this.registerChar2.label = val;
            this.visibleChar2 = false;
            this.registerChanged();
        },
    }
}
;
</script>
