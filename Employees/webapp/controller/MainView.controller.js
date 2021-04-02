// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            var oView = this.getView();
            //var i18nBundle = oView.getModel("i18n").getResourceBundle();

            var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
            oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJSONModelEmpl, "jsonEmployees");

            var oJSONModelCntr = new sap.ui.model.json.JSONModel();
            oJSONModelCntr.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCntr, "jsonCountries");

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName : true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");
        };

        function onFilter() {
            var oJSONCntr = this.getView().getModel("jsonCountries").getData();

            var filters = [];
            if (oJSONCntr.EmployeeId !== ""){
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCntr.EmployeeId ));
            }

            if (oJSONCntr.CountryKey !== ""){
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCntr.CountryKey ));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "")
            oModel.setProperty("/CountryKey", "")
        };

        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        };

        function onShowCity(){
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig")
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        };

        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig")
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        }

        var Main = Controller.extend("ns.Employees.controller.MainView", {})

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;

        return Main;
    });