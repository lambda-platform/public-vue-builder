import elements from "./elements"

export default {
    gutter: 16,
    schemaName: "Visual builder",
    schema: [],
    currentDom: null,
    findElId: null,
    mode: {
        type: "md",
        label: "Компьютер"
    },
    currentMode: "xs",
    rows: [],
    cols: [],
    charts: [],
    form: [],
    ...elements,
    editable: true,
    isDragging: false,
    delayedDragging: false,
    dragElOption: {
        group: {
            name: 'element',
            pull: 'clone',
            put: false
        },
        sort: false
    }
};
