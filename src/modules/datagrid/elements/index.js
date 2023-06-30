export const elementList = [
    {
        element: "Text",
        component: () => import(/* webpackChunkName: "grid-Text" */'./Text.vue'),
    },
    {
        element: "Select",
        component: () => import(/* webpackChunkName: "grid-Select" */'./Select.vue'),
    },
    {
        element: "Number",
        component: () => import(/* webpackChunkName: "grid-Number" */'./Number.vue'),
    },
    {
        element: "Date",
        component: () => import(/* webpackChunkName: "grid-Date" */'./Date.vue'),
    },
    {
        element: "Datetime",
        component: () => import(/* webpackChunkName: "grid-Date" */'./Date.vue'),
    },
    {
        element: "Image",
        component: () => import(/* webpackChunkName: "grid-Image-Item" */'./Image.vue'),
    },
    {
        element: "ImageBase64",
        component: () => import(/* webpackChunkName: "grid-Image-Base64" */'./ImageBase64.vue'),
    },
    {
        element: "File",
        component: () => import(/* webpackChunkName: "grid-File" */'./File.vue'),
    },
    {
        element: "Checkbox",
        component: () => import(/* webpackChunkName: "grid-Checkbox" */'./Check.vue'),
    },
    {
        element: "ColorPicker",
        component: () => import(/* webpackChunkName: "grid-ColorPicker" */'./ColorPicker.vue'),
    },
    {
        element: "Custom",
        component: () => import(/* webpackChunkName: "grid-Custom" */'./Custom.vue'),
    },
    {
        element: "DateRange",
        component: () => import(/* webpackChunkName: "grid-DateRange" */'./DateRange.vue'),
    },
    {
        element: "DateRangeDouble",
        component: () => import(/* webpackChunkName: "grid-DateRangeDouble" */'./DateRangeDouble.vue'),
    },
    {
        element: "File",
        component: () => import(/* webpackChunkName: "grid-File" */'./File.vue'),
    },
    {
        element: "Html",
        component: () => import(/* webpackChunkName: "grid-Html" */'./Html.vue'),
    },
    {
        element: "Input",
        component: () => import(/* webpackChunkName: "grid-Input" */'./Input.vue'),
    },
    {
        element: "InputNumber",
        component: () => import(/* webpackChunkName: "grid-InputNumber" */'./Number.vue'),
    },
    {
        element: "Link",
        component: () => import(/* webpackChunkName: "grid-Link" */'./Link.vue'),
    },
    {
        element: "Radio",
        component: () => import(/* webpackChunkName: "grid-Radio" */'./Radio.vue'),
    },
    {
        element: "Set-Filter",
        component: () => import(/* webpackChunkName: "grid-Text" */'./SetFilter.vue'),
    },
    {
        element: "Selectable-Input",
        component: () => import(/* webpackChunkName: "grid-SetFilter" */'./SetFilter.vue'),
    },
    {
        element: "Set-Filter-Date",
        component: () => import(/* webpackChunkName: "grid-SetFilterDate" */'./SetFilterDate.vue'),
    },
    {
        element: "Set-Filter-Altered",
        component: () => import(/* webpackChunkName: "grid-SetFilterAltered" */'./SetFilterAltered.vue'),
    },
    // {
    //     element: "Slider",
    //     component:()=> import(/* webpackChunkName: "grid-Text" */'./Text.vue'),
    // },
    {
        element: "SVG",
        component: () => import(/* webpackChunkName: "grid-Text" */'./Image.vue'),
    },
    // {
    //     element: "Switch",
    //     component:()=> import(/* webpackChunkName: "grid-Text" */'./Switch.vue'),
    // },
    {
        element: "Tag",
        component: () => import(/* webpackChunkName: "grid-Tag" */'./Tag.vue'),
    },
    // {
    //     element: "Year",
    //     component:()=> import(/* webpackChunkName: "grid-Year" */'./Year.vue'),
    // },
    {
        element: "Textarea",
        component: () => import(/* webpackChunkName: "grid-Textarea" */'./Textarea.vue'),
    },
    {
        element: "RadioButtonFilter",
        component: () => import(/* webpackChunkName: "grid-RadioButtonFilter" */'./RadioButtonFilter.vue'),
    },
    {
        element: "Button",
        component: () => import(/* webpackChunkName: "grid-Button" */'./Button.vue'),
    }
]


// export const element = (type) => {
//     if (type !== null) {
//         return require(`./${type}.vue`).default;
//     }
// }


export const element = (type) => {
    if (type !== null && typeof type !== "undefined") {
        try {
            const elIndex = elementList.findIndex(el => el.element == type);
            if (elIndex >= 0) {
                return elementList[elIndex].component;
            }
        } catch (e) {
            if (window.init.hasOwnProperty('data_grid_custom_elements') && window.init.data_grid_custom_elements) {
                let custom = window.init.data_grid_custom_elements.find(custom_element => custom_element.element == type);
                if (custom.length > 0 && custom) {
                    return require(`datagrid_custom/${type}.vue`).default;
                } else
                    return elementList[0].component;
            } else {
                throw e;
            }
        }
    }
}
