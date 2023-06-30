let ExcelFilter = () => {
    function ExcelFilter() {
    }

    ExcelFilter.prototype.init = function (params) {
        console.log(params);
        this.valueGetter = params.valueGetter;
        this.filterText = null;
        this.setupGui(params);
    }

    ExcelFilter.prototype.setupGui = function (params) {
        this.gui = document.createElement("div");
        this.gui.innerHTML =
            '<div style="padding: 4px;">' +
            '<div style="font-weight: bold;">Custom Athlete Filter</div>' +
            '<div><input style="margin: 4px 0px 4px 0px;" type="text" id="filterText" placeholder="Full name search..."/></div>' +
            '<div style="margin-top: 20px; width: 200px;">This filter does partial word search on multiple words, eg "mich phel" still brings back Michael Phelps.</div>' +
            "</div>";
        this.eFilterText = this.gui.querySelector("#filterText");
        this.eFilterText.addEventListener("changed", listener);
        this.eFilterText.addEventListener("paste", listener);
        this.eFilterText.addEventListener("input", listener);
        this.eFilterText.addEventListener("keydown", listener);
        this.eFilterText.addEventListener("keyup", listener);
        var that = this;

        function listener(event) {
            that.filterText = event.target.value;
            params.filterChangedCallback();
        }
    }

    ExcelFilter.prototype.getGui = function () {
        return this.gui;
    }

    ExcelFilter.prototype.doesFilterPass = function (params) {
        var passed = true;
        var valueGetter = this.valueGetter;
        this.filterText
            .toLowerCase()
            .split(" ")
            .forEach(function (filterWord) {
                var value = valueGetter(params);
                if (
                    value
                        .toString()
                        .toLowerCase()
                        .indexOf(filterWord) < 0
                ) {
                    passed = false;
                }
            });
        return passed;
    }

    ExcelFilter.prototype.isFilterActive = function () {
        var isActive = this.filterText !== null && this.filterText !== undefined && this.filterText !== "";
        return isActive;
    }

    ExcelFilter.prototype.getApi = function () {
        var that = this;
        return {
            getModel: function () {
                var model = {value: that.filterText.value};
                return model;
            },
            setModel: function (model) {
                that.eFilterText.value = model.value;
            }
        };
    }

    ExcelFilter.prototype.getModelAsString = function (model) {
        return model ? model : "";
    }

    ExcelFilter.prototype.getModel = function () {
        return this.filterText;
    }

    ExcelFilter.prototype.setModel = function () {
    }

    return ExcelFilter;
}

export default ExcelFilter;
