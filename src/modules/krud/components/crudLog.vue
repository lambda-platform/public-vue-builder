<template>
  <div class="crud-log">
    <div class="fieldset">
      <legend>{{ lang.lang }}</legend>
      <Table :columns="logColumns" :data="logs" size="small" :height="logs.length >= 3 ? 200 : 100"></Table>
    </div>
    <div class="fieldset">
      <legend>{{ lang.Information_viewing_history }}</legend>
      <Table :columns="readColumns" :data="reads" size="small" :height="reads.length >= 3 ? 200 : 80"></Table>
    </div>
  </div>
</template>

<script>
export default {
  name: "crudLog",
  props: ["form", "grid", "rowId"],
  data() {
    return {
      logs: [],
      reads: [],
      logColumns: [
        {
          title: 'Бүртгэлийн төрөл',
          key: 'action'
        },
        {
          title: 'Хэрэглэгч',
          key: 'user'
        },
        {
          title: 'Огноо',
          key: 'created_at'
        }
      ],
      readColumns: [
        {
          title: 'Хэрэглэгч',
          key: 'user'
        },
        {
          title: 'Огноо',
          key: 'created_at'
        }
      ],
    }
  },
    computed: {
        lang() {
            const labels = [
                'registration_history',
                'Information_viewing_history',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('crud.' + labels[i]);
                return obj;
            }, {});
        },
    },
  methods: {
    getLog() {
      this.logs = [];
      this.reads = [];
      axios.post("/lambda/puzzle/grid/data/crud_log?&paginate=5000&page=1&sort=id&order=desc", {
        schemaId: this.form,
        row_id: this.rowId
      }).then(res => {
         res.data.data.forEach(log=>{
           if(log.action !='edit'){
             this.logs.push({
               action: log.action == "store" ? "Бүртгэсэн" : "Зассан",
               user:log.last_name.charAt(0)+"."+log.first_name,
               created_at:moment(log.created_at).format("YYYY-MM-DD HH:mm:ss")
             })
           }
           if(log.action =='edit'){
             this.reads.push({
               user:log.last_name.charAt(0)+"."+log.first_name,
               created_at:moment(log.created_at).format("YYYY-MM-DD HH:mm:ss")
             })
           }

          })
      });
    }
  },
  watch: {
    rowId() {
      this.getLog();
    }
  },
  mounted() {
    this.getLog();
  }
}

</script>
