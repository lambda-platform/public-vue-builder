<template>
    <section class="report-builder 123test">
        <Spin size="large" fix v-if="loading"></Spin>
        <div class="rb-workspace">
            <div id="designer-host"></div>
        </div>
    </section>
</template>

<script>


export default {
    name: "Lambda report designer",
  mounted(){
      var designer = new GC.ActiveReports.ReportDesigner.Designer("#designer-host");
      designer.setReport({id: "report.rdlx", displayName: "my report"});
  },

    data() {
        return {

        }
    },

    methods: {

    }
};
</script>

<style>
#designer-host {
    width: 100%;
    height: 100vh;
}
</style>
