
export default {

  reset(state, data) {
  
    state.elementType = ''
    state.title = ''
    state.table = ''
    state.other = {
      filters:[]
    }
    state.fields = []
    state.areaLineColumnFields = {
      axis:[],
      lines:[],
  }
    state.pieColumnFields = {
      title:[],
      value:[],
  }
    state.radarFields = {
      values:[],
  }
   
  },
  setType(state, type) {
    state.elementType = type
  },
  setFilters(state, filters) {
    state.other.filters = filters
  },
  setFields(state, fields) {
    state.fields = fields
  },
  setData(state, data) {
    state.data = data
  },
  setTitle(state, title) {
    state.title = title
  },
  setTable(state, table) {
    state.table = table
  },
  setSource(state, source) {

    state.elementType = source.type
    state.table = source.table

    if(source.fields)
      state.fields = source.fields
    else
      stable.fields = []
    if(source.filters)
      state.other = {
        filters : source.filters
      }
    else 
      state.other = {
        filters:[]
      }  
    if (source.type === 'AreaChart' || source.type === 'LineChart' || source.type === 'ColumnChart') {
      state.areaLineColumnFields = { ...source }
    }
    if (source.type === 'PieChart' || source.type === 'FunnelChart' || source.type === 'TreeMapChart') {
      state.pieColumnFields = { ...source }
    }

    if (source.type === 'RadarChart') {
      state.radarFields = { ...source }
    }
    if (source.type === 'countBox') {
      state.countBox = { ...source }
    }

  },
    setCount(state, source){

        if(source.target == 'icon')
          state.countBox.icon = source.value;
        if(source.target == 'bgColor')
          state.countBox.bgColor = source.value;
        if(source.target == 'textColor')
          state.countBox.textColor = source.value;
        if(source.target == 'linkTitle')
          state.countBox.linkTitle = source.value;
        if(source.target == 'link')
          state.countBox.link = source.value;
    },
  setAreaLineColumnFields(state, areaLineColumnFields) {
    state.areaLineColumnFields = areaLineColumnFields
  },

}
