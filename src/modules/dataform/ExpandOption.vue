<template>
    <div class="expand">
        <Tabs :animated="false" size="small" class="expand-tab">
            <TabPane :label="lang.basicSettings">
                <Row type="flex">
                    <Col :xs="12">
                        <div class="title">
                            <h3>{{ lang.AdditionalValues }}</h3>
                        </div>
                        <ul>
                            <li v-if="item.formType == 'Image' || item.formType == 'File'">
                                <label>{{ lang.selectMultipleImg }}</label>
                                <i-switch v-model="item.file.isMultiple" size="small"></i-switch>
                            </li>

                            <li v-if="item.formType == 'CK' || item.formType == 'CkOld'">
                                <label>{{ lang.TypeOfTheEditor }}</label>
                                <Select v-model="item.editorType" :placeholder="lang.TypeOfTheEditor">
                                    <Option v-for="editor in editorTypes" :key="editor.index" :value="editor.type">
                                        {{ editor.label }}
                                    </Option>
                                </Select>
                            </li>

                            <li>
                                <label>Санамж текст</label>
                                <Input v-model="item.warn" :placeholder="item.warn"/>
                            </li>

                            <li>
                                <label>{{ lang.Placeholder }}</label>
                                <Input v-model="item.placeHolder"
                                       :placeholder="item.placeHolder == '' ? item.label : item.placeHolder"/>
                            </li>

                            <li>
                                <label>{{ lang.default_Value }}</label>
                                <Input v-model="item.default" :placeholder="lang.default_Value"/>
                            </li>

                            <li>
                                <label>{{ lang.Get_value_parameter }}</label>
                                <Input v-model="item.param" :placeholder="lang.Parameter_name"/>
                            </li>

                            <li>
                                <label>{{ lang.Get_user_ID }}</label>
                                <i-switch v-model="item.hasUserId" size="small"></i-switch>
                            </li>
                            <li>
                                <label>Хэрэглэгчээс утга авах</label>
                                <Select v-model="item.fillByUserField" filterable clearable
                                        placeholder="Хэрэглэгчээс утга авах">
                                    <Option v-for="item in user_fields" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </li>
                        </ul>
                    </Col>

                    <!-- Rule set -->
                    <Col :xs="12" :sm="12" :md="8" :lg="8">
                        <div class="title">
                            <h3>{{ lang.Verification_conditions }}</h3>
                        </div>

                        <div class="rule-control">
                            <Select v-model="item.rules" :placeholder="lang.Form_of_data_verification" filterable
                                    multiple>
                                <Option v-for="r in validationRules" :value="r" :key="r.index">{{ r.type }}</Option>
                            </Select>
                        </div>

                        <ul class="rule-msg-list">
                            <li v-for="r in item.rules" :key="r.index">
                                <label>[{{ r.type }}]</label>
                                <span><Input v-model="r.msg"/></span>
                            </li>
                        </ul>

                        <div class="rule-control">
                            <label>Нэмэлт Regex pattern</label>
                            <Input v-model="item.custom_regex"/>
                        </div>
                        <ul class="rule-msg-list" v-if="item.custom_regex">
                            <li>
                                <label>Нэмэлт Regex анхааруулга</label>
                                <span><Input v-model="item.custom_regex_msg"
                                             placeholder="Нэмэлт Regex анхааруулга"/></span>
                            </li>
                        </ul>

                        <div class="title" v-if="item.formType == 'Password'">
                            <h3>{{ lang.Password_settings }}</h3>
                        </div>
                        <ul v-if="item.formType == 'Password'">
                            <li>
                                <label>{{ lang.Password_verification }}</label>
                                <i-switch v-model="item.passwordOption.confirm" size="small"></i-switch>
                            </li>

                            <li>
                                <label>{{ lang.Create_a_password }}</label>
                                <i-switch v-model="item.passwordOption.generate" size="small"></i-switch>
                            </li>
                            <li>
                                <label>{{ lang.Check_password_during_editing }}</label>
                                <i-switch v-model="item.passwordOption.edit_with_old_password" size="small"></i-switch>
                            </li>
                        </ul>

                        <div class="title" v-if="item.formType == 'Number'">
                            <h3>{{ lang.number_precision }}</h3>
                        </div>
                        <ul class="rule-msg-list" v-if="item.formType == 'Number'">
                            <li>
                                <Input v-model="item.precision" :placeholder="lang.number_precision"/>
                            </li>
                        </ul>

                        <div class="title" v-if="item.formType == 'Number'">
                            <h3>Тоон формат болиулах</h3>
                        </div>
                        <ul class="rule-msg-list" v-if="item.formType == 'Number'">
                            <li>
                                <i-switch v-model="item.no_format" size="small"></i-switch>
                            </li>
                        </ul>
                        <div class="title" v-if="item.formType == 'Date'">
                            <h3>Өнөөдрийн огноо авах</h3>
                        </div>
                        <ul class="rule-msg-list" v-if="item.formType == 'Date'">
                            <li>
                                <i-switch v-model="item.autoFillCurrentDate" size="small"></i-switch>
                            </li>
                        </ul>

                        <!-- Element formula -->
                        <div class="title">
                            <h3>{{ lang.Consolidation_formula }}</h3>
                        </div>
                        <ul>
                            <li>
                                <label>{{ lang.Whether_to_summarize }}</label>
                                <i-switch v-model="item.hasEquation" size="small"></i-switch>
                            </li>

                            <li v-if="item.hasEquation">
                                <label>{{ lang.Choose_a_formula }}</label>
                                <Select v-model="item.equations" :placeholder="lang.Formula_type">
                                    <Option v-for="equation in equations" :key="equation.index" :value="equation">
                                        {{ equation }}
                                    </Option>
                                </Select>
                            </li>
                            <li v-if="item.hasEquation">
                                <label>{{ lang.Take_the_word_before_merger }} /{{ lang.example }} {{ lang.total }}:,
                                    {{ lang.number }}: {{ lang.ets }}/</label>
                                <Input v-model="item.preStaticWord" :placeholder="lang.Symbol"/>
                            </li>
                            <li v-if="item.hasEquation">
                                <label>{{ lang.get_sign_after_merger }} /{{ lang.example }} %, $, ₮
                                    {{ lang.ets }}/</label>
                                <Input v-model="item.prefix" :placeholder="lang.Symbol"/>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.configureTheData"
                     v-if="item.formType == 'Select' || item.formType == 'ISelect' || item.formType == 'TreeSelect' || item.formType == 'Radio'  || item.formType == 'RadioWithThumb' || item.formType == 'AdminMenu' || item.formType == 'FooterButton'">
                <Row type="flex">
                    <Col span="24">
                        <div class="title">
                            <h3>
                                {{ lang.Whether_get_values_database }}:
                                <i-switch v-model="item.isFkey" size="small"></i-switch>
                            </h3>
                            <h3>
                                {{ lang.Choose_multiple_values }} /multiple/:
                                <i-switch v-model="item.relation.multiple" size="small"></i-switch>
                            </h3>
                        </div>

                        <div v-if="!item.isFkey" class="localSelectOptions">
                            <Form ref="option" :model="optionForm" :rules="optionRule" inline>
                                <FormItem prop="value">
                                    <Input type="text" v-model="optionForm.value" :placeholder="lang.value"/>
                                </FormItem>
                                <FormItem prop="model">
                                    <FormItem prop="label">
                                        <Input type="text" v-model="optionForm.label" :placeholder="lang.visible_word"/>
                                    </FormItem>
                                </FormItem>
                                <FormItem prop="model">
                                    <FormItem prop="thumb">
                                        <Upload
                                            :on-success="img_upload_success"
                                            :show-upload-list="false"
                                            action="/lambda/krud/upload">
                                            <Button>{{ lang.visible_thumb }}</Button>
                                        </Upload>
                                    </FormItem>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="addOption">
                                        {{ lang.add }}
                                    </Button>
                                </FormItem>
                            </Form>

                            <Table v-if="item.options && item.options.length>0" border size="small"
                                   :columns="optionsColumns" :key="item.options.length"
                                   :data="item.options ? item.options : []"
                                   height="250">
                            </Table>
                        </div>

                        <ul v-if="item.isFkey">
                            <li v-if="microservices.length >= 1">
                                <label>Microservice</label>

                                <Select v-model="item.relation.microservice_id" placeholder="Microservice" clearable
                                        filterable
                                >
                                    <Option v-for="microservice in microservices" :value="microservice.microservice_id"
                                            :key="microservice.index">
                                        {{ microservice.microservice }}
                                    </Option>
                                </Select>

                            </li>
                            <li v-if="microservices.length >= 1">
                                <label>{{ lang.table }}</label>
                                <Select v-model="item.relation.table" :placeholder="lang.selectTable" clearable
                                        filterable
                                        :disabled="!item.isFkey" @on-change="relationSchema">
                                    <OptionGroup :label="`${microservice.microservice}: Table list`"
                                                 v-for="microservice in microservices.filter(ms=>ms.microservice_id === item.relation.microservice_id)"
                                                 :key="microservice.index">
                                        <Option v-for="item in microservice.tableList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                    <OptionGroup :label="`${microservice.microservice}: View list`"
                                                 v-for="microservice in microservices.filter(ms=>ms.microservice_id === item.relation.microservice_id)"
                                                 :key="microservice.index">
                                        <Option v-for="item in microservice.viewList" :value="item" :key="item.index">
                                            {{ item }}
                                        </Option>
                                    </OptionGroup>
                                </Select>
                            </li>
                            <li v-else>
                                <label>{{ lang.table }}</label>
                                <multiselect
                                    v-model='item.relation.table'
                                    :placeholder='lang.selectTable'
                                    :options="[{type:'table',list:tableList}, {type:'view',list:viewList}]"
                                    @select="relationSchema"
                                    group-values="list" group-label="type" :group-select="true"

                                ></multiselect>

                            </li>
                            <li>
                                <label>{{ lang.Related_fields }}</label>
                                <Select v-model="item.relation.key" :placeholder="lang.Related_fields" clearable
                                        filterable
                                        :disabled="!item.isFkey">
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">
                                        {{ item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Visible_fields }} </label>
                                <Select v-model="item.relation.fields" :placeholder="lang.Select_fields" clearable
                                        filterable
                                        multiple :disabled="!item.isFkey">
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                            item.model
                                        }}
                                    </Option>
                                </Select>
                            </li>

                            <li>
                                <label>{{ lang.Sort_field }}</label>
                                <Select v-model="item.relation.sortField" :placeholder="lang.Select_fields" clearable
                                        filterable
                                        :disabled="!item.isFkey">
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                            item.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label></label>
                                <RadioGroup v-model="item.relation.sortOrder">
                                    <Radio label="asc" :disabled="!item.isFkey">
                                        <Icon type="arrow-up-c"></Icon>
                                        <span>A-Z</span>
                                    </Radio>
                                    <Radio label="desc" :disabled="!item.isFkey">
                                        <Icon type="arrow-down-c"></Icon>
                                        <span>Z-A</span>
                                    </Radio>
                                </RadioGroup>
                            </li>
                            <li>
                                <label>{{ lang.Father_column }} ({{ lang.form }})</label>
                                <Select v-model="item.relation.parentFieldOfForm" :placeholder="lang.Father_column"
                                        clearable filterable
                                        :disabled="!item.isFkey">
                                    <Option v-for="item in schema" :value="item.model" :key="item.index">{{
                                            item.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Father_column }} ({{ lang.this_table }})</label>
                                <Select v-model="item.relation.parentFieldOfTable" :placeholder="lang.Father_column"
                                        clearable
                                        filterable :disabled="!item.isFkey">
                                    <Option v-for="item in relSchema" :value="item.model" :key="item.index">{{
                                            item.model
                                        }}
                                    </Option>
                                </Select>
                            </li>
                        </ul>

                        <div class="title" v-if="item.isFkey">
                            <h3>{{ lang.Display_Add_Data_button }}
                                <i-switch v-model="item.relation.addAble" size="small"
                                          @on-change="callForms"></i-switch>
                            </h3>
                        </div>

                        <ul v-if="item.relation.addAble">
                            <li v-if="microservices.length >= 1">
                                <label>Microservice</label>

                                <Select v-model="item.relation.addFromMicroservice" placeholder="Microservice" clearable
                                        filterable
                                >
                                    <Option v-for="microservice in microservices" :value="microservice.microservice_id"
                                            :key="microservice.index">
                                        {{ microservice.microservice }}
                                    </Option>
                                </Select>
                            </li>
                            <li v-if="microservices.length >= 1">
                                <label>{{ lang.Add_data_Form }}</label>
                                <Select v-model="item.relation.addFrom" :placeholder="lang.Add_data_Form" clearable
                                        filterable
                                        :disabled="!item.isFkey" @on-change="relationSchema"
                                        v-if="item.relation.addFromMicroservice">
                                    <Option v-for="of in otherForms" :value="of.id" :key="of.id"
                                            v-if="of.projects_id == item.relation.addFromMicroservice">{{
                                            of.name
                                        }}
                                    </Option>
                                </Select>
                            </li>
                            <li v-else>
                                <label>{{ lang.Add_data_Form }}</label>

                                <Select v-model="item.relation.addFrom" :placeholder="lang.Add_data_Form" clearable
                                        filterable
                                        :disabled="!item.isFkey" @on-change="relationSchema">
                                    <OptionGroup :label="lang.List_of_tables">
                                        <Option v-for="item in otherForms" :value="item.id" :key="item.id">{{
                                                item.name
                                            }}
                                        </Option>
                                    </OptionGroup>


                                </Select>
                            </li>
                        </ul>

                        <div class="title" v-if="item.isFkey">
                            <h3>{{ lang.Link_terms }}</h3>
                        </div>
                        <query-builder v-if="item.isFkey && relSchema.length >= 1" @change="changeItemFilter"
                                       :query="item.relation.filter"
                                       :fields="relSchema">
                        </query-builder>

                        <div class="title" v-if="item.isFkey  && relSchema.length >= 1">
                            <h3>{{ lang.Link_terms }} ({{ lang.Get_customer }})</h3>
                        </div>

                        <div>
                            <Row>
                                <Col span="10">
                                    <Select v-model="optionSelectFilterWithUser.userField" filterable
                                            :placeholder="lang.Custom_column">
                                        <Option v-for="item in user_fields" :value="item" :key="item">{{
                                                item
                                            }}
                                        </Option>
                                    </Select>
                                </Col>
                                <Col span="10">
                                    <Select v-model="optionSelectFilterWithUser.tableField" filterable
                                            :placeholder="lang.judgment_column">
                                        <Option v-for="item in relSchema" :value="item.model" :key="item.model">
                                            {{ item.model }}
                                        </Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Button type="primary" shape="circle" icon="md-add"
                                            @click="addSelectUserFilter"></Button>
                                </Col>
                            </Row>

                            <Row v-for="(condition, index) in item.relation.filterWithUser" :key="index">
                                <Col span="10">
                                    {{ condition.userField }}
                                </Col>
                                <Col span="10">
                                    {{ condition.tableField }}
                                </Col>
                                <Col span="4">
                                    <Button type="primary" shape="circle" icon="ios-trash"
                                            @click="deleteSelectUserFilter(index)"></Button>
                                </Col>
                            </Row>

                        </div>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.trigger">
                <Row type="flex">
                    <Col span="10">
                        <ul>
                            <div class="title">
                                <h3>{{ lang.trigger }} |
                                    <small>{{ lang.Call_from_server }}}</small>
                                </h3>
                            </div>
                            <span>
                                <label>{{ lang.trigger }} ({{ lang.data_loading_URL }}) url1,url2</label>
                                <Input v-model="item.trigger" type="textarea" :placeholder="lang.trigger"/>
                            </span>
                            <span>
                                <label>{{ lang.Trigger_load_time }} </label>
                                <Input v-model="item.triggerTimeout" placeholder="trigger Timeout"/>
                            </span>

                        </ul>
                    </Col>

                    <Col span="14">
                        <h4>{{ lang.Example_data_returned_server }}</h4>
                        <pre class="trigger-example">
                            {
                              "schema": [
                                {
                                  "field": "country",
                                  "value": "Mongolia",
                                  "props": {
                                    "disabled": true
                                  }
                                }
                              ],
                              "message": {
                                "type": "success",
                                "message": "lang.Successful"
                              },
                              "info":[
                                {
                                   "target":"target_id",
                                    "html":"info_by_html"
                                }
                              ]
                            }
                        </pre>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.informationLink">
                <Row type="flex">
                    <Col span="10">
                        <ul>
                            <div class="title">
                                <h3>{{ lang.informationLink }}</h3>
                            </div>
                            <span>
                                <label>{{ lang.URL_call_information_link }} (https://host/data/)</label>
                                <Input v-model="item.info_url" :placeholder="lang.URL_call_information_link"/>
                            </span>
                        </ul>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.GetValuesFromTheTable + /searchable input/" v-if="item.formType == 'Search'">
                <Row type="flex">
                    <Col span="24">
                        <div class="title">
                            <h3>{{ lang.GetValuesFromTheTable }}</h3>
                            <i-switch v-model="item.isGridSearch" size="small"></i-switch>
                        </div>
                        <ul>
                            <li>
                                <Checkbox v-model="item.gridSearch.multiple" :disabled="!item.isGridSearch">
                                    <span>{{ lang.Choose_multiple_values }}</span>
                                </Checkbox>
                            </li>
                            <li>
                                <Select v-model="item.gridSearch.grid" :placeholder="lang.Value_table" clearable
                                        filterable
                                        :disabled="!item.isGridSearch" @on-change="searchGridSchema">
                                    <Option v-for="item in this.gridList" :value="item.id" :key="item.index">
                                        {{ item.name }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Value_return_field }}</label>
                                <Select v-model="item.gridSearch.key" :placeholder="lang.Value_return_field" clearable
                                        filterable
                                        :disabled="!item.isGridSearch">
                                    <Option v-for="item in searchSchema" :value="item.model" :key="item.index">
                                        {{ item.model }}
                                    </Option>
                                </Select>
                            </li>
                            <li>
                                <label>{{ lang.Visible_fields }}</label>
                                <Select v-model="item.gridSearch.labels" :placeholder="lang.Visible_fields" clearable
                                        filterable
                                        multiple :disabled="!item.isGridSearch">
                                    <Option v-for="item in searchSchema" :value="item.model" :key="item.index">
                                        {{ item.model }}
                                    </Option>
                                </Select>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </TabPane>

            <TabPane :label="lang.Geographic" v-if="item.formType == 'Geographic'">
                <div style="padding: 20px">
                    <h3>
                        {{ lang.Geographic_settings }}
                    </h3>
                    <hr>
                    <Row :gutter="16">
                        <Col span="8">
                            <div>
                                <h4>{{ lang.attribute }} ({{ lang.properties }})</h4>
                                <Input v-model="item.GeographicOption.attributes" type="textarea" :autosize="true"

                                       :placeholder="lang.attribute + (lang.properties)">
                                </Input>
                            </div>
                        </Col>
                        <Col span="8">
                            <div>
                                <h4>{{ lang.Geometric_type }}</h4>
                                <RadioGroup v-model="item.GeographicOption.geometryType" class="">
                                    <Radio label="point">
                                        <span>{{ lang.point }}</span>
                                    </Radio>
                                    <Radio label="line">
                                        <span>{{ lang.line }}</span>
                                    </Radio>
                                    <Radio label="polygon">
                                        <span>{{ lang.polygon }}</span>
                                    </Radio>
                                </RadioGroup>
                            </div>
                        </Col>
                    </Row>

                    <Row :gutter="16">
                        <Col span="8">
                            <div>
                                <h4>{{ lang.length_center }}</h4>
                                <Input v-model="item.GeographicOption.center.lng"></Input>
                                <h4>{{ lang.latitude_center }}</h4>
                                <Input v-model="item.GeographicOption.center.lat"></Input>
                            </div>
                        </Col>
                        <Col span="8">
                            <div>
                                <h4>{{ lang.Map_magnification }}1-20</h4>
                                <Slider v-model="item.GeographicOption.zoom" :min="1" :max="20"
                                        :tip-format="formatZoom"
                                        style="width: 100%">
                                </Slider>
                            </div>
                        </Col>
                        <Col span="8">
                            <div>
                                <h4>{{ lang.Background_map }}</h4>
                                <RadioGroup v-model="item.GeographicOption.baseMap" class="">
                                    <Radio :label="0">
                                        <span>{{ lang.Google_Street }}</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>{{ lang.Google_Space }}</span>
                                    </Radio>
                                    <Radio :label="2">
                                        <span>{{ lang.Open_Street_Map }}</span>
                                    </Radio>
                                </RadioGroup>
                            </div>
                        </Col>
                    </Row>

                    <Row :gutter="16">
                        <Col span="4">
                            <div>
                                <h4>{{ lang.Check_overlap_area }}</h4>
                                <Checkbox v-model="item.GeographicOption.checkByArea">
                                    {{ lang.Check_overlap_area }}
                                </Checkbox>
                            </div>
                        </Col>

                        <Col span="4">
                            <div v-if="item.GeographicOption.checkByArea">
                                <h4>{{ lang.Feature_Class_link }}</h4>
                                <Input v-model="item.GeographicOption.featureLayerUrl"
                                       :placeholder="lang.Feature_Class_link">
                                </Input>
                            </div>
                        </Col>

                        <Col span="16">
                            <div v-if="item.GeographicOption.checkByArea">
                                <h4>{{ lang.Search_field }} (GIS)</h4>
                                <Input v-model="item.GeographicOption.searchField"
                                       :placeholder="lang.Search_field">
                                </Input>
                            </div>
                            <div v-if="item.GeographicOption.checkByArea">
                                <h4>{{ lang.Search_value_field }} (FORM)</h4>
                                <Input v-model="item.GeographicOption.formValueField"
                                       :placeholder="lang.Search_value_field">
                                </Input>
                            </div>
                            <div v-if="item.GeographicOption.checkByArea">
                                <h4>{{ lang.Success_message }}</h4>
                                <Input v-model="item.GeographicOption.successMsg"
                                       :placeholder="lang.Success_message">
                                </Input>
                            </div>
                            <br>
                            <div v-if="item.GeographicOption.checkByArea">
                                <h4>{{ lang.Error_message }}</h4>
                                <Input v-model="item.GeographicOption.errorMsg"
                                       :placeholder="lang.Error_message">
                                </Input>
                            </div>
                        </Col>
                    </Row>
                </div>
            </TabPane>

            <TabPane label="QGis" v-if="item.formType == 'QGis'">
                <div style="padding: 20px">
                    <Row v-if="item.qgisOptions">
                        <Col span="8">
                            <Input v-model="item.qgisOptions.service" placeholder="Geo Service"/>
                        </Col>
                        <Col span="8">
                            <Input v-model="item.qgisOptions.link" placeholder="Давхаргын холбоос"/>
                        </Col>

                        <Col span="24">
                            <div class="title">
                                <h3>Зургийн баазын мэдээлэл</h3>
                            </div>
                        </Col>

                        <Col span="8">
                            <Input v-model="item.qgisOptions.cTable" placeholder="Зургийн хүснэгт"/>
                        </Col>
                        <Col span="8">
                            <Input v-model="item.qgisOptions.cShapeField" placeholder="Зургийн мэдээлэлтэй талбар"/>
                        </Col>
                        <Col span="8">
                            <Input v-model="item.qgisOptions.cAttr" placeholder="Давхаргын холбогдох attr"/>
                        </Col>

                        <Col span="24">
                            <div class="title">
                                <h3>Давхаргын attribute & баазын холбоос</h3>
                            </div>
                        </Col>
                        <Col span="24">
                            <div class="qgis-attrs">
                                <div class="localSelectOptions">
                                    <Form ref="qgis-option" :model="optionForm" :rules="optionRule" inline>
                                        <FormItem prop="value">
                                            <Input type="text" v-model="optionForm.value"
                                                   placeholder="Layer attribute-н нэр"/>
                                        </FormItem>
                                        <FormItem prop="label">
                                            <Select v-model="optionForm.label" filterable
                                                    clearable
                                                    placeholder="Утга оноох талбар">
                                                <Option v-for="item in schema" :value="item.model"
                                                        :key="item.model">
                                                    {{ item.label ? item.label : item.model }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                        <FormItem prop="label">
                                            {{ optionForm.label }}
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary" @click="addQgisOption">
                                                {{ `${$static_words ? $static_words.add : 'Нэмэх'}` }}
                                            </Button>
                                        </FormItem>
                                    </Form>

                                    <Table border size="small" :columns="qgisColumns"
                                           :data="item.qgisOptions.attrList"
                                           height="250"></Table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </TabPane>

            <TabPane label="Grid Selector тохируулга" v-if="item.formType == 'GridSelector'">
                <div>
                    <Row>
                        <Col span="12"><Input type="text" v-model="item.GSOption.sourceGridModalTitle"
                                              placeholder="Modal дээр харуулах нэр"/></Col>
                        <Col span="12">
                            <Select v-model="item.GSOption.sourceMicroserviceID" placeholder="Microservice" clearable
                                    filterable>
                                <Option v-for="microservice in microservices" :value="microservice.microservice_id"
                                        :key="microservice.index">
                                    {{ microservice.microservice }}
                                </Option>
                            </Select>

                            <Select v-model="item.GSOption.sourceGridID" placeholder="Өгөгдөл дуудаж хүснэгт" clearable
                                    @on-change="setGridSource" filterable>
                                <Option v-for="item in otherGrids" :value="item.id" :key="item.id">{{
                                        item.name
                                    }}
                                </Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <Input type="text" v-model="item.GSOption.sourceGridTitle"
                                   placeholder="Хайлтын дээр харуулах гарчиг"/>
                            <br>
                            <Input type="text" v-model="item.GSOption.sourceGridUserCondition"
                                   placeholder="Хайлтын дээр ажиллах хэрэглэгчийн нөхцөл"/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label>Хайлтын дээр харуулах тайлбар</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ckeditor ref="ckeditor" :editor="editor" v-model="item.GSOption.sourceGridDescription"
                                      :config="editorConfig"></ckeditor>
                        </Col>
                    </Row>
                    <br>

                    <div>
                        <Row>
                            <Col>
                                <Select v-model="item.GSOption.sourceGridValueField" placeholder="Grid талбар" clearable
                                        filterable>
                                    <Option v-for="(item, iIndex) in sourceGridColumns.filter(c=>c!== null)"
                                            :key="iIndex" :value="item.model">{{ item.model }}
                                    </Option>
                                </Select>
                            </Col>
                        </Row>
                        <Container
                            group-name="sub-form-columns"
                            :drop-placeholder="dropPlaceholderOptions"
                            @drop="onDropSub($event)">
                            <!--form element-->
                            <Draggable
                                v-for="(item, iIndex) in item.GSOption.sourceGridTargetColumns.filter(c=>c!== null)"
                                :key="iIndex">
                                <Row>
                                    <Col span="10">
                                        {{ item.model }}
                                    </Col>
                                    <Col span="10">
                                        {{ item.label }}
                                    </Col>
                                    <Col span="4">
                                        <Button type="primary" shape="circle" icon="ios-trash"
                                                @click="deleteSourceGridTargetColumn(iIndex)"></Button>
                                    </Col>
                                </Row>
                            </Draggable>
                        </Container>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import {elementList} from "./elements";
import {rules} from "./rule";
import {applyDrag, getTableMeta} from "./utils/helpers";
import CKEditor from '@ckeditor/ckeditor5-vue2';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import {Container, Draggable} from 'vue-smooth-dnd'

export default {
    props: ["item", "edit", "sub", "schema", "otherGrids", "projectID"],
    components: {
        Container, Draggable,
        ckeditor: CKEditor.component
    },
    data() {
        return {
            editor: Editor,
            editorConfig: {
                toolbar: {
                    items: ['heading', '|',
                        'bold', 'italic', '|', 'link', '|',
                        'blockQuote', '|',
                        'insertTable', '|',
                        "indent", "outdent", '|',
                        'mediaEmbed'], shouldNotGroupWhenFull: true
                }
            },
            dropPlaceholderOptions: {
                className: 'drop-preview',
                animationDuration: '150',

            },
            configMini: ['heading', '|',
                'bold', 'italic', '|', 'link', '|',
                'blockQuote', '|',
                'insertTable', '|',
                "indent", "outdent", '|',
                'mediaEmbed', '|'],
            expendPart: '1',
            loadConfig: true,
            tableList: window.init.dbSchema.tableList,
            microservices: window.init.microservices ? window.init.microservices : [],
            viewList: window.init.dbSchema.viewList,
            elementList: elementList,
            gridList: window.init.gridList,
            relSchema: [],
            searchSchema: [],
            validationRules: _.cloneDeep(rules),
            otherForms: [],
            user_fields: window.init.user_fields,
            editorTypes: [
                {
                    type: "mini",
                    label: "Mini"
                },
                {
                    type: "article",
                    label: "Article"
                },
                {
                    type: "full",
                    label: "Full editor"
                }
            ],
            equations: [
                "SUM",
                "COUNT",
                "MIN",
                "MAX",
                "AVG"
            ],
            optionForm: {
                value: null,
                label: null,
                thumb: null
            },
            optionRule: {
                value: [
                    {
                        required: true,
                        message: "Утга оруулна уу",
                        trigger: "blur"
                    }
                ],
                label: [
                    {
                        required: true,
                        message: "Харагдах үг оруулна уу",
                        trigger: "blur"
                    }
                ]
            },
            optionSelectFilterWithUser: {
                userField: null,
                tableField: null,
            },
            sourceGridColumns: [],
            qgisColumns: [
                {
                    title: "QGis attribute",
                    key: "value",
                },
                {
                    title: "Баазын талбарын нэр",
                    key: "label",
                },
                {
                    title: "Устгах",
                    key: "action",
                    width: 100,
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    on: {
                                        click: () => {
                                            this.removeQgisOption(params.index);
                                        }
                                    }
                                },
                                "Устгах"
                            )
                        ]);
                    }
                }
            ],
        };
    },

    async created() {
        if (this.$props.edit) {
            this.updateSyncItem(this.$props.item);

            this.validationRules = this.validationRules.map(v => {
                let r = this.item.rules.find(r => r.type == v.type);
                return r == undefined ? v : r;
            });
        } else {
            if (this.item.rules.length == 0) {
                this.item.rules.push(this.validationRules[0]);
            }
        }


        if (this.$props.item.isFkey && this.$props.item.relation.table !== null) {
            this.relationSchema(this.$props.item.relation.table);
        }

        if (this.$props.item.isGridSearch && this.$props.item.gridSearch.grid !== null) {
            this.searchGridSchema(this.$props.item.gridSearch.grid);
        }

        if (!this.item.options) {
            this.item.options = [];

        }


        /*FOR OLD VB SCHEMA*/
        if (this.item.formType == 'Geographic') {
            if (!this.item.GeographicOption) {
                this.item.GeographicOption = {
                    attributes: "",
                    geometryType: 'point',
                    zoom: 8,
                    center: {
                        lat: 47.91876971846709,
                        lng: 106.91736415028574
                    },
                    baseMap: 0,
                    checkByArea: false,
                    featureLayerUrl: '', //feature layer url
                    featureTitles: '', // title,desc,author
                    searchField: '',
                    formValueField: '',
                    successMsg: '',
                    errorMsg: ''

                }
            }
        }
        /*FOR GRID SELECTOR*/
        if (this.item.formType == 'GridSelector') {

            if (!this.item.GSOption) {
                this.item.GSOption = {
                    sourceMicroserviceID: null,
                    sourceGridID: null,
                    sourceGridModalTitle: "",
                    sourceGridTargetColumns: [],
                    sourceGridTitle: "",
                    sourceGridDescription: "",
                    sourceGridUserCondition: "",
                    sourceGridParentBasedCondition: "",
                    sourceGridValueField: null
                }
            }
        }

        if (this.item.formType == 'QGis') {
            if (this.item.qgisOptions == undefined) {
                this.item.qgisOptions = {
                    service: "",
                    cTable: "",
                    cShapeField: "",
                    cAttr: "",
                    link: "",
                    attrList: []
                }
            }
        }

        if (this.item.formType == 'Image') {
            if (this.item.file.isMultiple == undefined) {
                this.item.file.isMultiple = false
            }
        }

        if (this.item.formType == 'Number') {
            if (this.item.precision == undefined) {
                this.item.precision = 0;
            }
            if (this.item.no_format == undefined) {
                this.item.no_format = false;
            }
        }

        if (this.item.formType == 'Password') {
            if (!this.item.passwordOption) {
                this.item.passwordOption = {
                    generate: false,
                    confirm: false,
                    edit_with_old_password: false
                }
            }
        }
        if (this.item.relation) {

            if (this.item.relation.addFromMicroservice === undefined) {
                this.item.relation.addFromMicroservice = null;
            }
        }
        /*FOR OLD VB SCHEMA*/
    },
    mounted() {
        if (this.item.relation.addAble) {
            this.callForms();
        }
    },

    computed: {
        lang() {
            const labels = ['basicSettings', 'configureTheData', 'trigger', 'informationLink', 'GetValuesFromTheTable', 'Geographic',
                'AdditionalValues', 'selectMultipleImg', 'TypeOfTheEditor', 'Placeholder', 'default_Value', 'Get_value_parameter',
                'Parameter_name', 'Get_user_ID', 'Consolidation_formula', 'Whether_to_summarize', 'Choose_a_formula', 'Formula_type'
                , 'Take_the_word_before_merger', 'example', 'total', 'number', 'ets', 'Symbol', 'get_sign_after_merger',
                'Verification_conditions', 'Form_of_data_verification', 'Password_settings', 'Password_verification', 'Check_password_during_editing',
                'number_precision', 'Whether_get_values_database', 'Choose_multiple_values', 'value', 'visible_word', 'visible_thumb', 'add', 'table', 'selectTable',
                'Related_fields', 'Visible_fields', 'Select_fields', 'Sort_field', 'Father_column', 'form', 'this_table', 'Display_Add_Data_button',
                'Add_data_Form', 'List_of_tables', 'Link_terms', 'Get_customer', 'Custom_column', 'judgment_column', 'Call_from_server', 'data_loading_URL',
                'Trigger_load_time', 'Example_data_returned_server', 'Successful', 'URL_call_information_link', 'Value_table', 'Value_return_field',
                'Geographic_settings', 'attribute', 'properties', 'Geometric_type', 'point', 'line', 'polygon', 'length_center', 'latitude_center', 'Map_magnification',
                'Background_map', 'Google_Street', 'Google_Space', 'Open_Street_Map', 'Check_overlap_area', 'Feature_Class_link', 'Search_field', 'Search_value_field',
                'Success_message', 'Error_message', 'please_enter_value', 'values', '_delete',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
        optionsColumns() {
            return [
                {
                    title: this.lang.values,
                    key: "value",

                },
                {
                    title: this.lang.visible_word,
                    key: "label",

                },
                {
                    title: this.lang.visible_thumb,
                    key: "thumb",
                    render: (h, params) => {
                        if (params.row.thumb == null) {
                            return ""
                        } else
                            return h('img', {
                                    style: {
                                        height: 'auto',
                                        width: '100px'
                                    },
                                    attrs: {
                                        src: params.row.thumb
                                    }
                                },
                            );
                    }

                },
                {
                    title: this.lang._delete,
                    key: "action",
                    width: 100,
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    on: {
                                        click: () => {
                                            this.removeOption(params.index);
                                        }
                                    }
                                },
                                this.lang._delete
                            )
                        ]);
                    }
                }
            ]
        }
    },

    methods: {

        addOption() {
            if (!this.item.options) {
                this.item.options = [];
            }
            this.$refs["option"].validate(valid => {
                if (valid) {
                    this.item.options.push({...this.optionForm});
                    this.optionForm = {
                        value: null,
                        label: null,
                        thumb: null
                    };
                }
            });
        },

        removeOption(index) {
            this.item.options.splice(index, 1);
        },

        formatZoom(val) {
            return 'Zoom: ' + val;
        },

        updateSyncItem(item) {
            //Grid search
            if (
                item.formType !== "subform" &&
                typeof item.gridSearch == "undefined"
            ) {
                item.isGridSearch = false;
                item.gridSearch = {
                    grid: null,
                    key: null,
                    labels: null,
                    multiple: false
                };
            }

            //CK editor
            if (
                (item.formType == "CK" || item.formType == "CkOld") &&
                typeof item.editorType == "undefined"
            ) {
                item.editorType = this.editorTypes[0].type;
            }
            //Query builder
            if (item.formType == "Select" || item.formType == "!Select") {
                this.relationSchema(item.relation.table);
            }

        },

        //Preparing table meta for relation fields
        relationSchema(table) {
            this.relSchema = getTableMeta(table);
        },

        searchGridSchema(val) {
            let searchGridItem = this.gridList.filter(
                item => item.id === val
            )[0];
            this.searchSchema = JSON.parse(searchGridItem.schema).schema;
        },

        //Filter event
        changeItemFilter(query) {
            if (query) {
                this.$props.item.relation.filter = query.sql;
            } else {
                this.$props.item.relation.filter = undefined;
            }
        },
        callForms() {

            if (window.otherForms) {
                this.otherForms = window.otherForms;
            } else {
                axios.get('/lambda/puzzle/schema/form').then(({data}) => {
                    window.otherForms = data.data;
                    this.otherForms = data.data;
                });
            }
        },

        addSelectUserFilter() {
            if (!this.$props.item.relation.filterWithUser) {
                this.$props.item.relation.filterWithUser = [];
            }

            this.$props.item.relation.filterWithUser.push(this.optionSelectFilterWithUser);

            this.optionSelectFilterWithUser = {
                userField: null,
                tableField: null,
            };

            console.log(this.$props.item.relation.filterWithUser);
        },

        deleteSelectUserFilter(index) {
            console.log(index);
            this.$props.item.relation.filterWithUser.splice(index, 1);
        },

        async setGridSource(val) {
            if (val) {
                let defualtURL = `/lambda/puzzle/schema/grid/${val}`;
                if (this.projectID) {
                    defualtURL = `/lambda/puzzle/projects/grid/${val}`
                }
                let res = await axios.get(defualtURL)

                if (res.data.data) {
                    let gridSchema = JSON.parse(res.data.data.schema);
                    this.sourceGridColumns = getTableMeta(gridSchema.model);

                    this.item.GSOption.sourceGridTargetColumns = [];
                    gridSchema.schema.forEach(field => {

                        if (!field.hide) {
                            this.item.GSOption.sourceGridTargetColumns.push({
                                model: field.model,
                                label: field.label,
                                gridType: field.gridType,
                            })
                        }

                    })


                }
            }

        },
        deleteSourceGridTargetColumn(index) {
            this.item.GSOption.sourceGridTargetColumns.splice(index, 1);
        },
        onDropSub(dropResult) {

            this.item.GSOption.sourceGridTargetColumns = applyDrag(this.item.GSOption.sourceGridTargetColumns, dropResult);
        },
        img_upload_success(val) {
            this.optionForm.thumb = val;
        },

        addQgisOption() {
            console.log(this.optionForm);
            this.$refs["qgis-option"].validate(valid => {
                if (valid) {
                    this.item.qgisOptions.attrList.push({...this.optionForm});
                    this.optionForm = {
                        value: null,
                        label: null
                    };
                    console.log(this.item.qgisOptions.attrList);
                }
            });
        },

        removeQgisOption(index) {
            this.item.qgisOptions.attrList.splice(index, 1);
        },
    },

};
</script>
