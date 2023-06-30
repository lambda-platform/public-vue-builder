export function getQuery(model, filters, extraQuery){

    if(model.nodes.length >= 1){
        var selects = getSelects(model);

        var joins = getJoins(model);
        var orders = getOrders(model);
        var groups = getGroup(model);
        var order = "";
        var group = "";

        let mainTable = model.nodes[0].title;

        let order_ = '';
        if(orders){
            order_ = 'ORDER BY '+orders
        }
        let groups_ = '';
        if(groups){
            groups_ = 'GROUP BY '+groups
        }

        if(filters !== null){
            filters = 'WHERE '+ filters.sql;
        } else {
            filters = '';
        }

        if(extraQuery){
            selects = selects + ", "+extraQuery
        }
        return `SELECT ${selects} FROM ${mainTable} ${joins} ${filters} ${groups_} ${order_}`;



    } else {
        return 'Хүснэгт сонгогдоогүй байна'
    }




}

function getSelects(model) {
    let selects = [];

    model.nodes.map(table=>{
        table.ports.map(field=>{
            if(field.field.output && field.type == 'in'){

                if(!field.field.alias_db || field.field.alias_db == "" || field.field.alias_db === null || typeof field.field.alias_db == "undefined"){
                    field.field.alias_db = field.field.name;
                }
                let select_field = field.field.table+'.'+field.field.name+" as " + field.field.alias_db;

                let field_full_name = field.field.table+'.'+field.field.name

                if(field.field.aggregate != 'none'){
                    switch(field.field.aggregate) {
                        case 'count':

                            selects.push(`COUNT(${field_full_name}) as ${field.field.alias_db}_count`)

                            break;
                        case 'max':

                            selects.push(`MAX(${field_full_name}) as ${field.field.alias_db}_max`)

                            break;
                        case 'min':

                            selects.push(`MIN(${field_full_name}) as ${field.field.alias_db}_min`)

                            break;
                        case 'avg':

                            selects.push(`AVG(${field_full_name}) as ${field.field.alias_db}_avg`)

                            break;
                        case 'sum':

                            selects.push(`SUM(${field_full_name}) as ${field.field.alias_db}_sum`)

                            break;
                        case 'countDistinct':

                            selects.push(`COUNT(DISTINCT ${field_full_name}) as ${field.field.alias_db}_count_distinct`)

                            break;
                        case 'avgDistinct':

                            selects.push(`AVG(DISTINCT ${field_full_name}) as ${field.field.alias_db}_avg_distinct`)

                            break;
                        case 'sumDistinct':

                            selects.push(`SUM(DISTINCT ${field_full_name}) as ${field.field.alias_db}_sum_distinct`)

                            break;
                        default:
                            selects.push(select_field)
                    }
                } else {
                    selects.push(select_field)
                }


            }

        })
    })

    return selects.join(', ')
}

function getOrders(model) {
    let orders = [];



    model.nodes.map(table=>{
        table.ports.map(field=>{
            if(field.field.output && field.field.sortType != 'none' && field.type == 'in'){

                orders.push({
                    sortOrder:field.field.sortOrder,
                    sql:`${field.field.alias_db} ${field.field.sortType}`,
                })

            }

        })
    });
    orders = _.orderBy(orders,'sortOrder','asc');

    orders = orders.map(order=>order.sql);
    return orders.join(', ')
}
function getGroup(model) {
    let groups = [];



    model.nodes.map(table=>{
        table.ports.map(field=>{
            if(field.field.output && field.field.groupBy && field.type == 'in') {
                groups.push({
                    groupOrder: field.field.groupOrder,
                    sql: `${field.field.alias_db}`,
                })
            }

        })
    });

    groups = _.orderBy(groups,'groupOrder','asc');

    groups = groups.map(group=>group.sql);
    return groups.join(', ')
}

export function getFields(model) {
    let fields = [];

    model.nodes.map(table=>{
        table.ports.map(field=>{

            if(field.type == 'in'){
                fields.push(field.field);
            }

        })
    })

    return fields
}

function getJoins(model) {
    let joins = '';

    model.links.map((link, index)=>{


        let from = getFieldByLinkId(model, link.from);
        let to = getFieldByLinkId(model, link.to);


        let in_ = null
        let out_ = null
        if(from.type == 'out'){
            in_ = to;
            out_ = from;
        } else {
            in_ = from;
            out_ = to;
        }

        let join = '';


        join = `LEFT JOIN ${in_.table} on ${out_.table}.${out_.name} = ${in_.table}.${in_.name}`


        if(index >= 1)
            joins = joins + ' ' + join
        else
            joins = joins + join


    });

    return joins
}

function getFieldByLinkId(model, portId) {


    let field_ = {};

    model.nodes.map(table=>{
        table.ports.map(field=>{
            if(portId === field.id){
                field_ = field.field;

                field_.type = field.type
            }
        })
    })

    return field_


}
