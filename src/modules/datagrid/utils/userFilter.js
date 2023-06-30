
export function getRelation(relation) {

    if(relation.filterWithUser){
        if(!!relation.filterWithUser && relation.filterWithUser.constructor === Array){
            relation.filterWithUser.forEach(userFilter=>{
                let condition = `${userFilter["tableField"]} = '${window.init.user[userFilter["userField"]]}'`
                if(relation.filter == "" || typeof relation.filter === "undefined"){
                    relation.filter = condition;
                } else {
                    relation.filter = relation.filter+ " AND " + condition
                }
            });
        } else {
            let condition = `${relation.filterWithUser["tableField"]} = '${window.init.user[relation.filterWithUser["userField"]]}'`
            if(relation.filter == "" || typeof relation.filter === "undefined"){
                relation.filter = condition;
            } else {
                relation.filter = relation.filter+ " AND " + condition
            }
        }
        relation.filterWithUser = undefined;
    }
    // console.log(relation)
    return relation
}
