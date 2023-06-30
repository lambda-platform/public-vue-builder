export const getTableView = (tableOrView) => {

    let list = tableOrView === "table" ? window.init.dbSchema.tableList : window.init.dbSchema.viewList;
    if (window.init.project && window.init.microservices) {
        if (window.init.microservices.length >= 1) {
            let microIndex = window.init.microservices.findIndex(micro => micro.microservice_id === window.init.project.id);
            if (microIndex >= 0) {
                return tableOrView === "table" ? window.init.microservices[microIndex].tableList : window.init.microservices[microIndex].viewList;
            }
        }
    }

    return list;
}

