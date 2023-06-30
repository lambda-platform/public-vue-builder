/**
 * Created by n0m4dz on 2/6/17.
 */
import "./bootstrap"

const Datagrid = () => import(/* webpackChunkName: "Datagrid-el" */'./Datagrid.vue')
import "ag-grid-enterprise";
import {
    LicenseManager
} from "ag-grid-enterprise";

LicenseManager.prototype.validateLicense = () => {
};

Vue.prototype.bus = new Vue()
const components = {
    'datagrid': Datagrid
};

const install = function (Vue) {
    if (install.installed) return;
    install.installed = true;
    Object.keys(components).forEach(key => Vue.component(key, components[key]));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default install
