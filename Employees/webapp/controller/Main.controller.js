// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], 
/**
 * 
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
 */

function(Controller, JSONModel) {
    'use strict';

    return Controller.extend("ns.Employees.controller.Main",{

        onInit: function () {
            var oView = this.getView();
            
            //var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
            //var oJSONModelEmpl = new JSONModel();
            //oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            //oView.setModel(oJSONModelEmpl, "jsonEmployees");

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
                var oView = this.getView();
                var i18nBundle = oView.getModel("i18n").getResourceBundle();
                var oJSONLayout = oView.getModel("jsonLayouts").getData();
                
                var detailView = this.getView().byId("employeeDetails");
                detailView.bindElement("odataNorthwind>" + path);

                if(oJSONLayout.ActiveKey === "OneColumn"){
                    this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", i18nBundle.getText("TwoColBExp"));                    
                }else{
                    this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", oJSONLayout.ActiveKey);
                }
                
                var incidenceModel = new JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();

            }

    });
});