// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    'use strict';

    return Controller.extend("ns.Employees.controller.Main",{

        onInit: function () {
            var oView = this.getView();
            //var i18nBundle = oView.getModel("i18n").getResourceBundle();

            var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
            oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmpl, "jsonEmployees");

            var oJSONModelCntr = new sap.ui.model.json.JSONModel();
            oJSONModelCntr.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCntr, "jsonCountries");

            var oJSONModelLayout = new sap.ui.model.json.JSONModel();
            oJSONModelLayout.loadData("./localService/mockdata/Layouts.json", false);
            oView.setModel(oJSONModelLayout, "jsonLayouts");

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");

            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
            
        },
            showEmployeeDetails: function (category, nameEvent, path) {
                var detailView = this.getView().byId("employeeDetails");
                detailView.bindElement("jsonEmployees>" + path);
                this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsBeginExpanded");
            }

    });
});