const AreaLine = ()=> import(/* webpackChunkName: "chart-area" */'./AreaLine.vue');
const Pie = ()=> import(/* webpackChunkName: "chart-pie" */'./Pie.vue');
const DataTable = ()=> import(/* webpackChunkName: "chart-table" */'./Table.vue');
const Radar = ()=> import(/* webpackChunkName: "chart-radar" */'./Radar.vue');
const CountBox = ()=> import(/* webpackChunkName: "chart-countbox" */'./CountBox.vue');


export const element = (type) => {
    if (type !== null && typeof type !== "undefined") {
       if(type == "AreaChart" || type == "LineChart" || type == "ColumnChart"){
           return AreaLine;
       } else if(type == "PieChart" || type == "TreeMapChart" || type == "FunnelChart"){
           return Pie;
       } else if(type == "DataTable"){
           return DataTable;
       } else if(type == "Radar"){
           return Radar;
       }else if(type == "countBox"){
           return CountBox;
       }
    }
    return undefined;
}
