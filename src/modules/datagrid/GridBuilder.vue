<template>
    <section class="grid-builder">
        <Spin size="large" fix v-if="loading"></Spin>

        <div class="gb-sidebar">
            <div class="gb-control" v-slimscroll="scrollOptions">
                <div class="gb-control-item">
                    <label>{{ lang.name }}</label>
                    <Input v-model="gridName" :placeholder="lang.name"/>
                </div>
                <div class="gb-control-item">
                    <label>{{ lang.data_table }}</label>
                    <multiselect
                        v-if="!editMode"
                        v-model='datagrid.model'
                        :placeholder='lang.selectTable'
                        :options="[{type:'table',list:tableList}, {type:'view',list:viewList}]"
                        @select="setBuilder"
                        group-values="list" group-label="type" :group-select="true"
                    ></multiselect>
                    <Input v-model="datagrid.model" disabled v-if="editMode"/>
                </div>

                <div class="gb-control-item">
                    <label>{{ lang.basicTable }}</label>
                    <multiselect v-model='datagrid.mainTable' :placeholder='lang.selectTable'
                                 :options="tableList"></multiselect>
                </div>

                <div class="gb-control-item" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.idField }}</label>
                    <Select v-model="datagrid.identity" :placeholder="lang.idField" clearable>
                        <Option v-for="item in datagrid.schema" :value="item.model" :key="item.index">{{ item.model }}
                        </Option>
                    </Select>
                </div>

                <div class="gb-control-item" v-if="(isModelSelected) ||  editMode">
                    <label>{{ lang.Sort_field }}</label>
                    <Select v-model="datagrid.sort" :placeholder="lang.Sort_field" clearable>
                        <Option v-for="item in datagrid.schema" :value="item.model" :key="item.index">
                            {{ item.model }}
                        </Option>
                    </Select>

                    <RadioGroup v-model="datagrid.sortOrder">
                        <Radio label="asc">
                            <Icon type="arrow-up-c"></Icon>
                            <span>A-Z</span>
                        </Radio>
                        <Radio label="desc">
                            <Icon type="arrow-down-c"></Icon>
                            <span>Z-A</span>
                        </Radio>
                    </RadioGroup>
                </div>

                <div class="gb-control-item r-flex" v-if="(isModelSelected) ||  editMode">
                    <label>{{ lang.destroyedCanBeRestored }}</label>
                    <i-switch v-model="datagrid.softDelete" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="(isModelSelected) ||  editMode">
                    <label>{{ lang.paging }}</label>
                    <InputNumber v-model="datagrid.paging" size="small" :max="9999999" :min="0"></InputNumber>
                </div>

                <div class="divider" v-if="isModelSelected ||  editMode"></div>

                <div class="gb-control-item" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.actions }}
                        <small> {{ lang.firstColumn }}
                            <i-switch v-model="datagrid.actionPosition" size="small"></i-switch>
                        </small>
                    </label>
                    <Select v-model="datagrid.actions" :placeholder="lang.actionsField" clearable multiple>
                        <Option value="v">
                            {{ lang.view }}
                        </Option>
                        <Option value="e">
                            {{ lang.edit }}
                        </Option>
                        <Option value="d">
                            {{ lang.delete }}
                        </Option>
                        <Option value="qe">
                            {{ lang.buttonEdit }}
                        </Option>
                        <Option value="cl">
                            {{ lang.copy }}
                        </Option>
                        <Option value="dbl">
                            {{ lang.doubleClicktoEdit }}
                        </Option>
                        <Option value="obl">
                            Нэг товшилтоор засах
                        </Option>
                    </Select>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.performActionWithMouse }}</label>
                    <i-switch v-model="datagrid.isContextMenu" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.staticWidth }}</label>
                    <i-switch v-model="datagrid.staticWidth" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>100% {{ lang.width }}</label>
                    <i-switch v-model="datagrid.fullWidth" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>Глобал хайлт</label>
                    <i-switch v-model="datagrid.isGlobalSearch" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.multipleLinesChooseFrom }}</label>
                    <i-switch v-model="datagrid.hasCheckbox" size="small"></i-switch>
                </div>
                <div class="gb-control-item r-flex" v-if="datagrid.hasCheckbox && (isModelSelected ||  editMode)">
                    <label>{{ lang.selectSameValues }}</label>
                    <i-switch v-model="datagrid.autoSelect" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex"
                     v-if="datagrid.hasCheckbox && datagrid.autoSelect && (isModelSelected ||  editMode)">
                    <Select v-model="datagrid.autoSelectModel" :placeholder="lang.comparisonModel" clearable>
                        <Option v-for="item in datagrid.schema" :value="item.model" :key="item.index">
                            {{ item.model }}
                        </Option>
                    </Select>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.numbered }}</label>
                    <i-switch v-model="datagrid.isNumbered" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.clientRender }}</label>
                    <i-switch v-model="datagrid.isClient" size="small"></i-switch>
                </div>
                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.pivotTool }}</label>
                    <i-switch v-model="datagrid.isPivot" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.saveSearch }}</label>
                    <i-switch v-model="datagrid.saveFilter" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.print }}</label>
                    <i-switch v-model="datagrid.isPrint" size="small"></i-switch>
                </div>
                <div class="gb-control-item" v-if="datagrid.isPrint && (isModelSelected ||  editMode)">
                    <Select v-model="datagrid.printSize" :placeholder="lang.paperSize">
                        <Option value="A3">A3</Option>
                        <Option value="A3 landscape">A3 {{ lang.landScape }}</Option>
                        <Option value="A4" selected>A4</Option>
                        <Option value="A4 landscape">A4 {{ lang.landScape }}</Option>
                        <Option value="A5">A5</Option>
                        <Option value="A5 landscape">A5 {{ lang.landScape }}</Option>
                    </Select>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.makeExcel }}</label>
                    <i-switch v-model="datagrid.isExcel" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.excelUpload }}</label>
                    <i-switch v-model="datagrid.isExcelUpload" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.reboot }}</label>
                    <i-switch v-model="datagrid.isRefresh" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.showFullText }}</label>
                    <i-switch v-model="datagrid.fullText" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.displayMenuColumn }}</label>
                    <i-switch v-model="datagrid.colMenu" size="small"></i-switch>
                </div>

                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.columnFilterButton }}</label>
                    <i-switch v-model="datagrid.colFilterButton" size="small"></i-switch>
                </div>
                <div class="gb-control-item r-flex" v-if="isModelSelected ||  editMode">
                    <label>{{ lang.displayTableFrame }}</label>
                    <i-switch v-model="datagrid.showGrid" size="small"></i-switch>
                </div>

                <!--                <div class="gb-control-item">-->
                <!--                    <label>Засах үйлдэл хаах багана</label>-->
                <!--                    <Input v-model="datagrid.updateDisableField" placeholder="Засах үйлдэл хаах багана"/>-->
                <!--                </div>-->
                <!--                <div class="gb-control-item">-->
                <!--                    <label>Засах үйлдэл хаах багана</label>-->
                <!--                    <Input v-model="datagrid.updateDisableFieldValue" placeholder="Засах үйлдэл хаах утга"/>-->
                <!--                </div>-->


                <div class="gb-control-item">
                    <label>{{ lang.theme }}</label>
                    <Select v-model="datagrid.gridTheme" :placeholder="lang.theme"
                            filterable>
                        <Option v-for="theme in gridThemes" :value="theme" :key="theme.index">{{ theme }}</Option>
                    </Select>
                </div>
                <div class="gb-control-item">
                    <label>{{ lang.size }}</label>
                    <RadioGroup v-model="datagrid.theme">
                        <Radio label="normal">
                            <span>{{ lang.simple }}</span>
                        </Radio>
                        <Radio label="mini">
                            <span>{{ lang.mini }}</span>
                        </Radio>
                    </RadioGroup>
                </div>
            </div>


            <div class="gb-submit">
                <Button type="success" :loading="loadingSubmit" long @click="saveGrid">
                    <span v-if="!loadingSubmit">{{ lang.save }}</span>
                    <span v-else>{{ lang.pleaseWait }}</span>
                </Button>
            </div>
        </div>

        <div class="gb-workspace">
            <Tabs type="card" :animated="false">
                <!-- Main configuration -->
                <TabPane :label="lang.basicSettings" icon="md-code-working">
                    <div class="gb-config">
                        <div class="gb-table">
                            <Row class="gb-table-header">
                                <Col span="3">
                                    <span class="drag-handler-head">#</span>
                                    {{ lang.model }}
                                </Col>
                                <Col span="3">{{ lang.nickName }}</Col>
                                <Col span="3"> {{ lang.type }}</Col>
                                <Col span="2" class="center"> {{ lang.width }}</Col>
                                <Col span="1" class="center"> {{ lang.hide }}</Col>
                                <Col span="2" class="center"> {{ lang.sort }}</Col>
                                <Col span="1" class="center"> {{ lang.court }}</Col>
                                <Col span="2" class="center"> {{ lang.searchResults }}</Col>
                                <Col span="2" class="center"> {{ lang.translation }}</Col>
                                <Col span="2" class="center"> {{ lang.tobePublished }}</Col>
                                <Col span="1" class="center">
                                    <Tooltip :content="lang.updateSelectedLineData">
                                        {{ lang.renew }}
                                    </Tooltip>
                                </Col>

                                <Col span="1" class="center">
                                    <Tooltip :content="lang.whenEnteringDataFromExcelFile">
                                        {{ lang.excel }}
                                    </Tooltip>
                                </Col>

                                <Col span="1" class="center">...</Col>
                            </Row>

                            <!-- Schema fields -->
                            <div class="gb-table-body">
                                <draggable v-model="datagrid.schema" :options="{group:'step', handle: '.drag-handler'}">
                                    <grid-item v-for="(item, index) in datagrid.schema" :key="index" :index="index"
                                               :item="item" :fieldList="fieldList"
                                               :meta="{width: datagrid.staticWidth}"
                                               :edit="editMode" :deleteVirtualColumn="deleteVirtualColumn"></grid-item>
                                </draggable>
                                <div class="new-virtual-column">
                                    <Button type="success" shape="circle" icon="md-add" @click="addVirtualColumn">
                                        Виртуал багана
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPane>

                <!-- Filter -->
                <TabPane :label="lang.filtersettings" icon="md-funnel">
                    <div class="gb-config">
                        <Row>
                            <Col :xs="24" :sm="24" :md="14" :lg="16">
                                <h3>{{ lang.filtersettings }}</h3>
                                <div class="gb-table" style="overflow: auto;">
                                    <Row class="gb-table-header">
                                        <Col span="5"> {{ lang.model }}</Col>
                                        <Col span="4"> {{ lang.nickName }}</Col>
                                        <Col span="4"> {{ lang.type }}</Col>
                                        <Col span="2" class="center">
                                        </Col>
                                    </Row>

                                    <!-- Schema fields -->
                                    <div class="gb-table-body" style="height: calc(50% - 80px)!important;">
                                        <grid-filter-item v-for="item in datagrid.schema" v-if="item.filterable"
                                                          :key="item.index" :item="item" :schema="datagrid.schema"
                                                          :edit="editMode"></grid-filter-item>
                                    </div>
                                </div>

                            </Col>

                            <Col :xs="24" :sm="24" :md="10" :lg="8">
                                <div class="main-filters">
                                    <!-- <h3>Нэмэлт шүүлтүүр</h3> -->
                                    <div class="main-filter">
                                        <h3>{{ lang.countingAssociatedInfo }} /has join count/</h3>
                                        <table border="1" class="gb-filter-table">
                                            <thead>
                                            <th>{{ lang.relatedTable }}</th>
                                            <th>{{ lang.relatedFields }}</th>
                                            <th>{{ lang.fatherField }}</th>
                                            <th>...</th>
                                            </thead>
                                            <tbody>
                                            <tr v-for="f in datagrid.filter" :key="f.index">
                                                <td>
                                                    <Select v-model="f.table" :placeholder="lang.selectTable" clearable
                                                            filterable @on-change="setFilterSchema">
                                                        <OptionGroup :label="lang.tableList">
                                                            <Option v-for="item in tableList" :value="item"
                                                                    :key="item.index">{{ item }}
                                                            </Option>
                                                        </OptionGroup>
                                                        <OptionGroup :label="lang.viewList">
                                                            <Option v-for="item in viewList" :value="item"
                                                                    :key="item.index">{{ item }}
                                                            </Option>
                                                        </OptionGroup>
                                                    </Select>
                                                </td>
                                                <td>
                                                    <Select v-model="f.key" :placeholder="lang.fatherField" clearable>
                                                        <Option v-for="item in fieldList" :value="item.model"
                                                                :key="item.index">
                                                            {{ item.model }}
                                                        </Option>
                                                    </Select>
                                                </td>
                                                <td>
                                                    <Select v-model="f.pkey" :placeholder="lang.fatherField" clearable>
                                                        <Option v-for="item in datagrid.schema" :value="item.model"
                                                                :key="item.index">
                                                            {{ item.model }}
                                                        </Option>
                                                    </Select>
                                                </td>
                                                <td>
                                                    <a href="javascript:void(0)" @click="removeNullFilter(f.index)">
                                                        <Icon type="ios-trash-outline"></Icon>
                                                    </a>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td colspan="4">
                                                    <a href="javascript:void(0)" class="add-filter-btn"
                                                       @click="addNullFilter">{{ lang.add }}</a>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </TabPane>

                <!-- Aggregation & Formula -->
                <TabPane :label="lang.consolidationFormulas" icon="md-calculator">
                    <div class="gb-config gb-formula">
                        <Row>
                            <Col :xs="24" :sm="24" :md="10" :lg="10">
                                <div class="formula-wrapper">
                                    <h3>{{ lang.formula }}</h3>
                                    <Form ref="formula" :model="formulaForm" :rules="formulaRule" inline>
                                        <FormItem prop="template">
                                            <Input type="text" v-model="formulaForm.template"
                                                   :placeholder="`${lang.formula} {a}+{b}`" style="width:300px"/>
                                        </FormItem>
                                        <FormItem prop="model">
                                            <Select v-model="formulaForm.model" style="width:200px"
                                                    :placeholder="lang.resultsStorageArea">
                                                <Option v-for="(ss, index) in datagrid.schema"
                                                        v-if="ss.hidden !== true && ss.key != 'PRI'" :value="ss.model"
                                                        :key="index">{{ ss.model }}
                                                </Option>
                                            </Select>
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary" @click="addFormula">{{ lang.add }}</Button>
                                        </FormItem>
                                    </Form>
                                    <Table border size="small" :columns="formulaColumns" :data="datagrid.formula"
                                           height="400"></Table>
                                </div>
                            </Col>

                            <Col :xs="24" :sm="24" :md="14" :lg="14">
                                <div class="formula-wrapper">
                                    <h3>{{ lang.consolidation }}</h3>
                                    <div class="aggregation">
                                        <div class="aggret-section">
                                            <Form ref="columnAggregationForm" :model="columnAggregationForm"
                                                  :rules="columnAggregationRule" inline>
                                                <FormItem prop="column">
                                                    <Select v-model="columnAggregationForm.column" style="width:200px"
                                                            :placeholder="lang.column">
                                                        <Option v-for="(ss, index) in datagrid.schema"
                                                                v-if="ss.hidden !== true && ss.key != 'PRI'"
                                                                :value="ss.model" :key="index">{{ ss.model }}
                                                        </Option>
                                                    </Select>
                                                </FormItem>
                                                <FormItem prop="aggregation">
                                                    <Select v-model="columnAggregationForm.aggregation"
                                                            style="width:200px" :placeholder="lang.consolidationType">
                                                        <Option v-for="(aggregation, index) in aggregations"
                                                                :value="aggregation" :key="index">{{ aggregation }}
                                                        </Option>
                                                    </Select>
                                                </FormItem>
                                                <FormItem prop="symbol">
                                                    <Input type="text" v-model="columnAggregationForm.symbol"
                                                           :placeholder="lang.symbol " style="width:300px"/>
                                                </FormItem>

                                                <FormItem>
                                                    <Button type="primary" @click="addColumnAggergation">{{
                                                            lang.add
                                                        }}
                                                    </Button>
                                                </FormItem>
                                            </Form>
                                            <Table border size="small" :columns="columnAggregationColumns"
                                                   :data="datagrid.columnAggregations" height="250"></Table>
                                        </div>

                                        <div class="aggret-section aggret-section-formula">
                                            <h3>{{ lang.consolidationFormula }}</h3>
                                            <Form ref="columnAggregationsFormulaForm"
                                                  :model="columnAggregationsFormulaForm"
                                                  :rules="columnAggregationsFormulaRule" inline>
                                                <FormItem prop="title">
                                                    <Input type="text" v-model="columnAggregationsFormulaForm.title"
                                                           :placeholder="lang.name" style="width:200px"/>
                                                </FormItem>
                                                <FormItem prop="template">
                                                    <Input type="text" v-model="columnAggregationsFormulaForm.template"
                                                           :placeholder="`${lang.formula} {a}+{b}`"
                                                           style="width:300px"/>
                                                </FormItem>
                                                <FormItem prop="symbol">
                                                    <Input type="text" v-model="columnAggregationsFormulaForm.symbol"
                                                           :placeholder="lang.symbol" style="width:100px"/>
                                                </FormItem>

                                                <FormItem>
                                                    <Button type="primary" @click="addColumnAggregationsFormula">
                                                        {{ lang.add }}
                                                    </Button>
                                                </FormItem>
                                            </Form>
                                            <Table border size="small" :columns="columnAggregationsFormulaColumns"
                                                   :data="datagrid.columnAggregationsFormula" height="250"></Table>
                                        </div>

                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </TabPane>

                <!-- Condition -->
                <TabPane :label="lang.conditionTrigger" icon="md-contract">
                    <div class="gb-config">
                        <query-builder v-if="fieldList && fieldList.length >= 0 && (isModelSelected ||  editMode)"
                                       @change="setCondition" :query="datagrid.condition"
                                       :fields="fieldList"></query-builder>
                        <br>
                        <div class="trigger-wrapper">
                            <table>
                                <tr>
                                    <td>
                                        <label>{{ lang.controllerNameSpace }}</label>
                                    </td>
                                    <td>
                                        <Input v-model="datagrid.triggers.namespace" :placeholder="lang.namespace"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>{{ lang.beforeCallingFromDatabase }}</label>
                                    </td>
                                    <td>
                                        <Input v-model="datagrid.triggers.beforeFetch" :placeholder="lang.beforeFetch"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>{{ lang.afterCallingFromDatabase }}</label>
                                    </td>
                                    <td>
                                        <Input v-model="datagrid.triggers.afterFetch" :placeholder="lang.afterFetch"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>{{ lang.beforeDeleting }}</label>
                                    </td>
                                    <td>
                                        <Input v-model="datagrid.triggers.beforeDelete"
                                               :placeholder="lang.beforeDeleting"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>{{ lang.afterDeleting }}</label>
                                    </td>
                                    <td>
                                        <Input v-model="datagrid.triggers.afterDelete"
                                               :placeholder="lang.afterDeleting"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>{{ lang.beforePrinting }}</label>
                                    </td>
                                    <td>
                                        <Input v-model="datagrid.triggers.beforePrint"
                                               :placeholder="lang.beforePrinting"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>{{ lang.cacheClearTriggerLabel }}</label>
                                    </td>
                                    <td>
                                        <Input v-model="datagrid.triggers.cacheClearUrl"
                                               :placeholder="lang.cacheClearTriggerLabel"/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </TabPane>

                <TabPane :label="lang.spreadsheetForm" icon="md-apps">
                    <div class="gb-config">
                        <Row>
                            <Col :span="18" class="gb-form">
                                <Row class="gb-table-header">
                                    <Col span="6">
                                        <span class="drag-handler-head">#</span>
                                        {{ lang.model }}
                                    </Col>
                                    <Col span="4"> {{ lang.edit }}</Col>
                                    <Col span="6"> {{ lang.fromType }}</Col>
                                    <Col span="4"> {{ lang.update }}</Col>
                                    <Col span="4"> {{ lang.post }}</Col>

                                </Row>

                                <!-- Schema fields -->
                                <div class="gb-table-body">
                                    <grid-form-item v-for="item in datagrid.schema" :key="item.index"
                                                    :item="item" :edit="editMode"></grid-form-item>
                                </div>
                            </Col>

                            <Col :span="6">
                                <div class="gb-control-item" v-if="isModelSelected ||  editMode">
                                    <label>
                                        {{ lang.editable_UpdateLink }}
                                        <small>http://google.com/{var}</small>
                                        <Input v-model="datagrid.editableAction"/>
                                    </label>
                                </div>

                                <div class="gb-control-item" v-if="isModelSelected ||  editMode">
                                    <label>
                                        {{ lang.fixEntireLine }}
                                        <i-switch v-model="datagrid.editFullRow" size="small"></i-switch>
                                    </label>
                                </div>

                                <div class="gb-control-item" v-if="isModelSelected ||  editMode">
                                    <label>
                                        {{ lang.switchEditMode }} - {{ lang.withOneClick }}
                                        <i-switch v-model="datagrid.singleClickEdit" size="small"></i-switch>
                                    </label>
                                </div>

                                <div class="gb-control-item" v-if="isModelSelected ||  editMode">
                                    <label>
                                        {{ lang.highlightChanges }}
                                        <i-switch v-model="datagrid.flashChanges" size="small"></i-switch>
                                    </label>
                                </div>

                                <div class="gb-control-item" v-if="isModelSelected ||  editMode">
                                    <label>
                                        {{ lang.saveChangesBulk }}
                                        <i-switch v-model="datagrid.editableShouldSubmit" size="small"></i-switch>
                                    </label>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </TabPane>

                <!-- Excel import -->
                <TabPane :label="lang.gbExcelImport" icon="md-document">
                    <div class="gb-config">
                        <div class="gb-excel-import-form">
                            <div class="formula-wrapper">
                                <h3>{{ lang.excelImportFormTitle }}</h3>
                                <Form ref="excelUploadConfig" label-position="top" inline>

                                    <Row>
                                        <Col :xs="24" :sm="24" :md="12" :lg="12">
                                            <FormItem prop="template" :label="lang.excelUploadSampleFile">
                                                <div class="file-uploader">
                                                    <Upload :action="`${$projectSettings ? $projectSettings.production_url: ''}/lambda/krud/upload`"
                                                            v-model="datagrid.excelUploadSample"
                                                            :on-success="success"
                                                            size="small">
                                                        <div class="file-upload-handler">
                                                            <span>{{ lang.pleaseSelectFile }}</span>
                                                        </div>
                                                    </Upload>
                                                    <div v-if="datagrid.excelUploadSample != null" class="file-control">
                                                        <a :href="`${$projectSettings ? $projectSettings.production_url: ''}${datagrid.excelUploadSample}`" target="_blank" download>
                                                            <i
                                                                class="ti-download"></i>{{ lang.download }}</a>
                                                        <a :href="`${$projectSettings ? $projectSettings.production_url: ''}${datagrid.excelUploadSample}`" target="_blank"> <i
                                                            class="ti-eye"></i>{{ lang.view }}</a>
                                                    </div>
                                                </div>
                                            </FormItem>
                                        </Col>
                                        <Col :xs="24" :sm="24" :md="12" :lg="12">
                                            <FormItem prop="template" :label="lang.excelUploadCustomNamespace">
                                                <Input type="text" v-model="datagrid.excelUploadCustomNamespace"
                                                       style="width:300px"/>
                                            </FormItem>
                                            <FormItem prop="template" :label="lang.excelUploadCustomTrigger">
                                                <Input type="text" v-model="datagrid.excelUploadCustomTrigger"
                                                       placeholder="ExcelExportController@import1" style="width:300px"/>
                                            </FormItem>
                                        </Col>
                                        <Col :xs="24" :sm="24" :md="12" :lg="12">
                                            <FormItem prop="template" :label="lang.excelUploadRowtoStart">
                                                <Input type="text" v-model="datagrid.excelUploadRowtoStart"
                                                       style="width:300px"/>
                                            </FormItem>
                                            <FormItem prop="template" :label="lang.excelUploadCustomUrl">
                                                <Input type="text" v-model="datagrid.excelUploadCustomUrl"
                                                       placeholder="/admin/#/myExcelImport1" style="width:300px"/>
                                            </FormItem>
                                        </Col>
                                    </Row>

                                </Form>
                            </div>
                        </div>
                        <div class="gb-table">
                            <Row class="gb-table-header">
                                <Col span="3">
                                    <span class="drag-handler-head">#</span>
                                    {{ lang.model }}
                                </Col>
                                <Col span="1" class="center">
                                    <Tooltip :content="lang.whenEnteringDataFromExcelFile">
                                        {{ lang.excel }}
                                    </Tooltip>
                                </Col>
                                <Col span="3"> {{ lang.type }}</Col>

                                <Col span="3"> {{ lang.excelImportFieldName }}</Col>
                                <Col span="1" class="center">...</Col>
                            </Row>

                            <!-- Schema fields -->
                            <div class="gb-table-body">
                                <draggable v-model="datagrid.schema" :options="{group:'col', handle: '.drag-handler'}">
                                    <grid-item-excel-import v-for="item in datagrid.schema" :key="item.index"
                                                            :item="item"
                                                            :meta="{width: datagrid.staticWidth}"
                                                            :edit="editMode">

                                    </grid-item-excel-import>
                                </draggable>
                            </div>
                        </div>
                    </div>
                </TabPane>

                <!-- Layout -->
                <TabPane :label="lang.appearance" icon="md-laptop">
                    <Row>
                        <Col span="16">
                            <div class="grid-templates">
                                <div class="row-template-1">
                                    <div class="template-0" :class="this.datagrid.template == 0 ? 'active' : ''"
                                         @click="setTemplate(0)">
                                        <div class="t-grid">{{ lang.dataTable }}</div>
                                    </div>
                                    <br/>
                                    <div class="template-1" :class="this.datagrid.template == 1 ? 'active' : ''"
                                         @click="setTemplate(1)">
                                        <div class="t-grid">{{ lang.dataTable }}</div>
                                        <div class="t-filter">{{ lang.filter }}</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="template-2" :class="this.datagrid.template == 2 ? 'active' : ''"
                                         @click="setTemplate(2)">
                                        <div class="t-filter">{{ lang.filter }}</div>
                                        <div class="t-grid">{{ lang.dataTable }}</div>
                                    </div>
                                    <br/>
                                    <div class="template-3" :class="this.datagrid.template == 3 ? 'active' : ''"
                                         @click="setTemplate(3)">
                                        <div class="t-main-grid">
                                            <div class="t-filter-top">{{ lang.filter }}</div>
                                            <div class="t-grid">
                                                {{ lang.dataTable }}
                                            </div>
                                        </div>
                                        <div class="t-filter">{{ lang.filter }}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </Row>


                    <header-builder v-if="!loading" :header="datagrid.header"
                                    :schema="datagrid.schema"></header-builder>

                </TabPane>

                <TabPane :label="lang.updateSelectedLineDataSettings" icon="md-code-working">
                    <div class="gb-config">
                        <Row>
                            <Col :xs="24" :sm="24" :md="14" :lg="16">
                                <h3>{{ lang.updateSelectedLineDataSettings }}</h3>
                                <div class="gb-table">
                                    <Row class="gb-table-header">
                                        <Col span="3"> {{ lang.model }}</Col>
                                        <Col span="3"> {{ lang.name }}</Col>
                                        <Col span="4"> {{ lang.fieldName }}</Col>
                                        <Col span="4"> {{ lang.buttonName }}</Col>
                                        <Col span="4"> {{ lang.type }}</Col>
                                        <Col span="4"> {{ lang.updateAndReboot }}</Col>
                                        <Col span="2" class="center">
                                        </Col>
                                    </Row>

                                    <!-- Schema fields -->
                                    <div class="gb-table-body auto-height">
                                        <grid-row-update-item v-for="item in datagrid.schema.filter(i=>i.updateable)"
                                                              :key="item.index" :item="item" :schema="datagrid.schema"
                                                              :edit="editMode"></grid-row-update-item>
                                    </div>
                                </div>

                            </Col>

                        </Row>
                    </div>
                </TabPane>

            </Tabs>
        </div>
    </section>
</template>

<script>
import draggable from "vuedraggable";
import GridGroup from "./GridGroup";
import GridItem from "./GridItem";
import GridItemExcelImport from "./GridItemExcelImport";
import GridFilterItem from "./GridFilterItem";
import GridRowUpdateItem from "./GridRowUpdateItem";
import GridFormItem from "./GridFormItem";
import HeaderBuilder from "./HeaderBuilder";
import {idGenerator} from "./utils/methods";
import {builderData} from "./utils/data";
import {getTableMeta} from "./utils/helpers";
import {getTableView} from "../../utils/index";

export default {
    props: ["editMode", "src", "onCreate", "onUpdate", "projectID"],
    computed: {
        lang() {
            const labels = ['selectTable', 'viewList', 'tableList', 'idField', 'name', 'data_table', 'pleaseWait', 'save', 'columnFilterButton',
                'displayTableFrame', 'displayMenuColumn', 'showFullText', 'reboot', 'view', 'download', 'pleaseSelectFile', 'excelUpload', 'exportExcel',
                'landScape', 'portrait', 'print', 'saveSearch', 'pivotTool', 'clientRender', 'selectSameValues', 'staticWidth', 'width', 'multipleLinesChooseFrom',
                'Sort_field', 'destroyedCanBeRestored', 'paging',
                'basicSettings', 'appearanceName', 'hide', 'court', 'searchResults', 'translation', 'tobePublished', 'updateSelectedLineData', 'update',
                'whenEnteringDataFromExcelFile', 'excel', 'Filter', 'settings', 'model', 'updateSelectedLineDataSettings', 'fieldName', 'buttonName',
                'updateAndReboot', 'countingAssociatedInfo', 'relatedTable', 'relatedFields', 'fatherField', 'consolidationFormulas', 'formula',
                'resultsStorageArea', 'consolidation', 'consolidationType', 'consolidationFormula', 'conditionTrigger', 'beforeCallingFromDatabase',
                'afterCallingFromDatabase', 'beforeDeleting', 'afterDeleting', 'beforePrinting', 'spreadsheetForm', 'edit', 'fromType', 'update', 'post',
                'editable_UpdateLink', 'fixEntireLine', 'switchEditMode', 'withOneClick', 'highlightChanges', 'saveChangesBulk', 'appearance', 'dataTable',
                'filter', 'mini', 'simple', 'size', "controllerNameSpace", 'add', 'symbol', 'type', 'nickName', 'filtersettings', 'filtersAndSelectedLineSettings',
                'sort', 'column', 'delete', 'actionsField', 'copy', 'doubleClicktoEdit', 'buttonEdit', 'firstColumn', 'actions', 'performActionWithMouse',
                'renew', 'pleaseWaitForLoading', 'namespace', 'afterFetch', 'beforeFetch', 'makeExcel', 'numbered', 'basicTable', 'formInfoSavedSuccessfully',
                'tableDataHasBeenSuccessfullyEdited', 'successfullySaved', 'anErrorOccurredWhileSaving',
                'gbExcelImport', 'excelImportFieldName', 'excelImportFormTitle', 'excelUploadSampleFile', 'excelUploadRowtoStart', 'excelUploadCustomUrl', 'excelUploadCustomNamespace', 'excelUploadCustomTrigger',
                'cacheClearTriggerLabel', 'theme'

            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
        tableList() {
            return getTableView("table")
        },
        viewList() {
            return getTableView("view")
        }
    },
    components: {
        draggable,
        HeaderBuilder,
        GridItem,
        GridItemExcelImport,
        GridGroup,
        GridFilterItem,
        GridRowUpdateItem,
        GridFormItem,
    },

    data() {
        return builderData(this);
    },


    created() {
        this.init();
    },

    methods: {
        idGenerator: idGenerator,
        success(val) {
            this.datagrid.excelUploadSample = val;
        },
        init() {
            if (this.$props.editMode == true) {
                axios.get(this.$props.src).then(async (o) => {
                    this.gridName = o.data.data.name;
                    this.datagrid = JSON.parse(o.data.data.schema);

                    await this.updateSyncGrid();

                    this.datagrid.schema.map(item => {
                        if (item.filterable) {
                            if (!("filter" in item)) {
                                item.filter = {
                                    label: null,
                                    placeholder: null,
                                    type: null,
                                    isFkey: false,
                                    relation: {
                                        microservice_id: null,
                                        connection_field: null,
                                        table: null,
                                        key: null,
                                        fields: [],
                                        sortField: null,
                                        sortOrder: "asc",
                                        parentFieldOfForm: null,
                                        parentFieldOfTable: null
                                    }
                                };
                            }
                        }

                        if (item.updateable) {

                            if (!("update" in item)) {
                                let updateForm = {};
                                updateForm[item.model] = null;
                                item.update = {
                                    label: null,
                                    updateLabel: null,
                                    buttonLabel: null,
                                    buttonIcon: null,
                                    placeholder: null,
                                    refresh: false,
                                    updateForm: updateForm,
                                    type: null,
                                    isFkey: false,
                                    relation: {
                                        microservice_id: null,
                                        self: true,
                                        table: null,
                                        key: null,
                                        fields: [],
                                        sortField: null,
                                        sortOrder: "asc",
                                        parentFieldOfForm: null,
                                        parentFieldOfTable: null
                                    }
                                };
                            }
                        }

                    });
                    this.loading = false;
                })
                    .catch(o => {
                        console.log(o);
                    });
            } else {
                setTimeout(() => {
                    this.loading = false;
                }, 800)
            }
        },

        addVirtualColumn() {
            this.datagrid.schema.push({
                "virtualColumn": true,
                "model": "",
                "title": "",
                "dbType": "int4",
                "table": "",
                "key": "",
                "extra": "",
                "nullable": "YES",
                "label": "",
                "gridType": "Text",
                "width": 200,
                "hide": false,
                "sortable": false,
                "printable": false,
                "pinned": false,
                "pinPosition": "left",
                "link": "",
                "linkTarget": "_self",
                "relation": {
                    "table": null,
                    "key": null,
                    "fields": [],
                    "sortField": null,
                    "sortOrder": "asc",
                    "multiple": false,
                    "filter": "",
                    "parentFieldOfForm": "",
                    "parentFieldOfTable": ""
                },
                "filterable": false,
                "filter": {
                    "type": null,
                    "param": null,
                    "paramCompareType": "contain",
                    "showSideFilter": true,
                    "default": null,
                    "relation": {"table": null, "key": null, "fields": [], "sortField": null, "sortOrder": "asc"}
                },
                "editable": {"status": false, "type": "text", "shouldUpdate": false, "shouldPost": false},
                "searchable": false,
                "hasTranslation": false,
                "options": []
            });
        },
        deleteVirtualColumn(index) {
            this.datagrid.schema.splice(index, 1);
        },

        async updateSyncGrid() {
            //DB field sync
            let dbSchema = await getTableMeta(this.datagrid.model);

            this.fieldList = dbSchema;
            //Remove DB deleted field from schema
            this.datagrid.schema = this.datagrid.schema.filter(item => {
                let deletedField = _.find(dbSchema, {
                    model: item.model
                });

                this.updateSyncItem(item);

                if (typeof deletedField !== "undefined" || item.formType == "SubForm" || item.virtualColumn) {
                    return item;
                }
            });


            //Sync added DB field
            if (dbSchema) {
                dbSchema.forEach(item => {
                    let newField = _.find(this.datagrid.schema, {
                        model: item.model
                    });
                    if (typeof newField === "undefined") {
                        this.datagrid.schema.push(this.setSchemaItem(item));
                    }
                });
            }

            if (typeof this.datagrid.filter == "undefined") {
                Vue.set(this.datagrid, "filter", []);
            }

            if (typeof this.datagrid.isContextMenu == "undefined") {
                Vue.set(this.datagrid, "isContextMenu", true);
            }

            if (typeof this.datagrid.fullWidth == "undefined") {
                Vue.set(this.datagrid, "fullWidth", true);
            }

            if (typeof this.datagrid.hasCheckbox == "undefined") {
                Vue.set(this.datagrid, "hasCheckbox", false);
            }

            if (typeof this.datagrid.isPivot == "undefined") {
                Vue.set(this.datagrid, "isPivot", false);
            }

            if (typeof this.datagrid.isPrint == "undefined") {
                Vue.set(this.datagrid, "isPrint", false);
            }

            if (typeof this.datagrid.printSize == "undefined") {
                Vue.set(this.datagrid, "printSize", 'A4');
            }

            if (typeof this.datagrid.isExcel == "undefined") {
                Vue.set(this.datagrid, "isExcel", true);
            }

            if (typeof this.datagrid.isExcelUpload == "undefined") {
                Vue.set(this.datagrid, "isExcelUpload", false);
            }

            if (typeof this.datagrid.isGlobalSearch == "undefined") {
                Vue.set(this.datagrid, "isGlobalSearch", true);
            }

            if (typeof this.datagrid.excelUploadSample == "undefined") {
                Vue.set(this.datagrid, "excelUploadSample", null);
            }

            if (typeof this.datagrid.excelImportRowtoStart == "undefined") {
                Vue.set(this.datagrid, "excelImportRowtoStart", null);
            }

            if (typeof this.datagrid.excelUploadCustomUrl == "undefined") {
                Vue.set(this.datagrid, "excelUploadCustomUrl", null);
            }

            if (typeof this.datagrid.excelUploadCustomNamespace == "undefined") {
                Vue.set(this.datagrid, "excelUploadCustomNamespace", null);
            }

            if (typeof this.datagrid.excelUploadCustomTrigger == "undefined") {
                Vue.set(this.datagrid, "excelUploadCustomTrigger", null);
            }

            if (typeof this.datagrid.excelImportRelation == "undefined" || !this.datagrid.excelImportRelation.hasOwnProperty('table')) {
                let excelImportRelationTemp = {
                    table: null,
                    key: null,
                    fields: [],
                    sortField: null,
                    sortOrder: "asc",
                    multiple: false,
                    filter: "",
                    parentFieldOfForm: "",
                    parentFieldOfTable: ""
                };
                Vue.set(this.datagrid, "excelImportRelation", excelImportRelationTemp);
            }

            if (typeof this.datagrid.isRefresh == "undefined") {
                Vue.set(this.datagrid, "isRefresh", false);
            }

            if (typeof this.datagrid.isNumbered == "undefined") {
                Vue.set(this.datagrid, "isNumbered", false);
            }

            if (typeof this.datagrid.saveFilter == "undefined") {
                Vue.set(this.datagrid, "saveFilter", false);
            }

            if (typeof this.datagrid.header == "undefined") {
                let header = {
                    render: false,
                    structure: []
                };
                Vue.set(this.datagrid, "header", header);
            }

            if (typeof this.datagrid.triggers == "undefined") {
                let triggers = {
                    beforeFetch: '',
                    afterFetch: '',
                    beforeDelete: '',
                    afterDelete: '',
                    cacheClearUrl: ''
                };
                Vue.set(this.datagrid, "triggers", triggers);
            }

            if (typeof this.datagrid.fullText == "undefined") {
                Vue.set(this.datagrid, "fullText", false);
            }

            if (typeof this.datagrid.editableAction == "undefined") {
                Vue.set(this.datagrid, "editableAction", null);
            }

            if (typeof this.datagrid.singleClickEdit == "undefined") {
                Vue.set(this.datagrid, "singleClickEdit", true);
            }

            if (typeof this.datagrid.flashChanges == "undefined") {
                Vue.set(this.datagrid, "flashChanges", false);
            }

            if (typeof this.datagrid.editFullRow == "undefined") {
                Vue.set(this.datagrid, "editFullRow", false);
            }

            if (typeof this.datagrid.editableShouldSubmit == "undefined") {
                Vue.set(this.datagrid, "editableShouldSubmit", false);
            }

            if (typeof this.datagrid.colMenu == "undefined") {
                Vue.set(this.datagrid, "colMenu", false);
            }

            if (typeof this.datagrid.colFilterButton == "undefined") {
                Vue.set(this.datagrid, "colFilterButton", true);
            }

            if (typeof this.datagrid.showGrid == "undefined") {
                Vue.set(this.datagrid, "showGrid", true);
            }

            if (typeof this.datagrid.theme == "undefined") {
                Vue.set(this.datagrid, "theme", 'normal');
            }

            if (typeof this.datagrid.autoSelect == "undefined") {
                Vue.set(this.datagrid, "autoSelect", false);
            }

            if (typeof this.datagrid.autoSelectModel == "undefined") {
                Vue.set(this.datagrid, "autoSelectModel", null);
            }
        },

        updateSyncItem(item) {
            if (typeof item.options == "undefined") {
                item.options = [];
            }

            if (typeof item.printable == "undefined") {
                item.printable = false
            }

            if (typeof item.pinned == "undefined") {
                item.pinned = false
            }

            if (typeof item.pinPosition == "undefined") {
                item.pinPosition = 'left'
            }

            if (typeof item.link == "undefined") {
                item.link = ''
            }

            if (typeof item.linkTarget == "undefined") {
                item.linkTarget = '_self'
            }

            //for excel import
            if (typeof item.canExcelImport == "undefined") {
                item.canExcelImport = false;
            }

            if (typeof item.excelImportFieldName == "undefined") {
                item.excelImportFieldName = null;
            }

            if (typeof this.datagrid.isExcel == "undefined") {
                Vue.set(this.datagrid, "isExcel", false);
            }

            if (typeof this.datagrid.isExcelUpload == "undefined") {
                Vue.set(this.datagrid, "isExcelUpload", false);
            }

            if (typeof this.datagrid.excelUploadSample == "undefined") {
                Vue.set(this.datagrid, "excelUploadSample", null);
            }

            if (typeof this.datagrid.excelImportRowtoStart == "undefined") {
                Vue.set(this.datagrid, "excelImportRowtoStart", null);
            }

            if (typeof this.datagrid.excelUploadCustomUrl == "undefined") {
                Vue.set(this.datagrid, "excelUploadCustomUrl", null);
            }

            if (typeof this.datagrid.excelUploadCustomNamespace == "undefined") {
                Vue.set(this.datagrid, "excelUploadCustomNamespace", null);
            }

            if (typeof this.datagrid.excelUploadCustomTrigger == "undefined") {
                Vue.set(this.datagrid, "excelUploadCustomTrigger", null);
            }

            if (typeof this.datagrid.excelImportRelation == "undefined" || !this.datagrid.excelImportRelation.hasOwnProperty('table')) {
                item.excelImportRelation = {
                    table: null,
                    key: null,
                    fields: [],
                    sortField: null,
                    sortOrder: "asc",
                    multiple: false,
                    filter: "",
                    parentFieldOfForm: "",
                    parentFieldOfTable: ""
                };
            }

            // delete item.editable;
            if (typeof item.editable == "undefined") {
                item.editable = {
                    status: false,
                    shouldUpdate: false,
                    shouldPost: false,
                    type: 'text'
                }
            }
        },

        async setBuilder(table) {
            this.fieldList = await getTableMeta(table);
            // console.log(this.fieldList);
            this.isModelSelected = true;
            this.datagrid.model = table;

            if (_.includes(this.viewList, table)) {
                this.datagrid.isView = true;
            }

            if (this.gridName == null) {
                this.gridName = table;
            }

            this.datagrid = {
                ...this.datagrid,
                sort: null,
                sordOrder: "desc",
                template: 0
            };

            this.$data.datagrid.schema = this.fieldList.map(item => {
                return this.setSchemaItem(item);
            });
        },

        setSchemaItem(item) {
            //Default identity field
            if (item.model == "id") {
                this.datagrid.sort = item.model;
                this.datagrid.identity = item.model;
            }

            //Customized schema item
            return {
                ...item,
                label: "",
                gridType: "Text",
                excelImportGridType: "Text",
                width: 200,
                hide: false,
                sortable: true,
                printable: false,
                pinned: false,
                pinPosition: 'left',
                link: '',
                linkTarget: '_self',
                relation: {
                    microservice_id: null,
                    table: null,
                    key: null,
                    fields: [],
                    sortField: null,
                    sortOrder: "asc",
                    multiple: false,
                    filter: "",
                    parentFieldOfForm: "",
                    parentFieldOfTable: ""
                },
                excelImportRelation: {
                    table: null,
                    key: null,
                    fields: [],
                    sortField: null,
                    sortOrder: "asc",
                    multiple: false,
                    filter: "",
                    parentFieldOfForm: "",
                    parentFieldOfTable: ""
                },
                filterable: true,
                filter: {
                    type: null,
                    param: null,
                    paramCompareType: 'contain',
                    showSideFilter: true,
                    default: null,
                    relation: {
                        microservice_id: null,
                        table: null,
                        key: null,
                        fields: [],
                        sortField: null,
                        sortOrder: "asc"
                    }
                },
                editable: {
                    status: false,
                    type: 'text',
                    shouldUpdate: false,
                    shouldPost: false
                },
                searchable: true,
                hasTranslation: false,
                canExcelImport: false,
                excelImportFieldName: null,
                options: []
            };
        },

        setTemplate(val) {
            this.datagrid.template = val;
        },

        addNullFilter() {
            let filter = {
                type: "null",
                table: null,
                key: null,
                pkey: this.datagrid.identity
            };

            this.datagrid.filter.push(filter);
        },

        removeNullFilter(index) {
            this.datagrid.filter.splice(index, 1);
        },

        async setFilterSchema(val) {
            this.fieldList = await getTableMeta(val);
        },

        setCondition(query) {
            if (query) {
                this.datagrid.condition = query.sql;
            } else {
                this.datagrid.condition = undefined;
            }

        },

        //Formula functions
        addFormula() {
            this.$refs["formula"].validate(valid => {
                if (valid) {
                    //for old old version. it will use when edit
                    if (this.datagrid.formula === undefined) {
                        this.datagrid = {
                            ...this.datagrid,
                            formula: []
                        };
                    }

                    this.datagrid.formula.push({
                        model: this.formulaForm.model,
                        template: this.formulaForm.template
                    });
                    this.formulaForm = {
                        model: "",
                        template: ""
                    };
                }
            });
        },

        removeFormula(index) {
            this.datagrid.formula.splice(index, 1);
        },

        //Column aggregation
        addColumnAggergation() {
            this.$refs["columnAggregationForm"].validate(valid => {
                if (valid) {
                    //for old old version. it will use when edit
                    if (this.datagrid.columnAggregations === undefined) {
                        this.datagrid = {
                            ...this.datagrid,
                            columnAggregations: []
                        };
                    }

                    this.datagrid.columnAggregations.push({
                        column: this.columnAggregationForm.column,
                        aggregation: this.columnAggregationForm.aggregation,
                        symbol: this.columnAggregationForm.symbol
                    });
                    this.columnAggregationForm = {
                        column: "",
                        aggregation: "",
                        symbol: ""
                    };
                }
            });
        },

        removeColumnAggergation(index) {
            this.datagrid.columnAggregations.splice(index, 1);
        },

        //Columns aggregation's formula
        addColumnAggregationsFormula() {
            this.$refs["columnAggregationsFormulaForm"].validate(valid => {
                if (valid) {
                    //for old old version. it will use when edit
                    if (this.datagrid.columnAggregationsFormula === undefined) {
                        this.datagrid = {
                            ...this.datagrid,
                            columnAggregationsFormula: []
                        };
                    }

                    this.datagrid.columnAggregationsFormula.push({
                        title: this.columnAggregationsFormulaForm.title,
                        symbol: this.columnAggregationsFormulaForm.symbol,
                        template: this.columnAggregationsFormulaForm.template
                    });
                    this.columnAggregationsFormulaForm = {
                        title: "",
                        symbol: "",
                        template: ""
                    };
                }
            });
        },

        removeColumnAggregationsFormula(index) {
            this.datagrid.columnAggregationsFormula.splice(index, 1);
        },

        setHeader() {

            if (this.header == null) {

            }
        },

        saveGrid() {
            this.loadingSubmit = true;
            let data = {
                name: this.gridName,
                schema: JSON.stringify({
                    ...this.datagrid,
                    microservices: window.init.microSettings ? window.init.microSettings : []
                }),

            };
            //console.log(data);

            let defualtURL = `/lambda/puzzle/schema/grid`;
            if (this.projectID) {
                defualtURL = `/lambda/puzzle/project/${this.projectID}/grid`
            }

            let submitUrl = this.$props.editMode
                ? this.$props.src
                : defualtURL;

            axios.post(submitUrl, data).then(({data}) => {
                if (data.status) {
                    if (this.editMode) {
                        this.$Notice.success({
                            // title: 'Амжилттай хадгалагдлаа',
                            title: this.lang.successfullySaved,
                            // title: this.vars.selectTable,
                            // desc: `"${this.gridName}" хүснэгтийн мэдээлэл амжилттай засагдлаа.`


                            desc: this.gridName + this.lang.tableDataHasBeenSuccessfullyEdited

                        });
                    } else {
                        this.$Notice.success({
                            // title: 'Амжилттай хадгалагдлаа',
                            title: this.lang.successfullySaved,
                            // desc: `"${this.formName}" формын мэдээлэл амжилттай хадгалагдлаа.`
                            desc: this.formName + ' ' + this.lang.formInfoSavedSuccessfully
                        });
                        window.history.back();
                    }
                } else {
                    this.$Message.info(this.lang.anErrorOccurredWhileSaving);
                }
                setTimeout(() => {
                    this.loadingSubmit = false;
                }, 600)
            });
        }
    }
};
</script>
