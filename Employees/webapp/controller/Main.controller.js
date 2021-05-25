// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.m.MessageBox} MessageBox 
     */

    function (Controller, JSONModel, MessageBox) {
        'use strict';

        return Controller.extend("ns.Employees.controller.Main", {
            onBeforeRendering:
                function () {
                    this._detailEmployeeView = this.getView().byId("employeeDetails")
                },

            onInit: function () {
                var oView = this.getView();

                //var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
                //var oJSONModelEmpl = new JSONModel();
                //oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
                //oView.setModel(oJSONModelEmpl, "jsonEmployees");

                var oJSONModelCntr = new sap.ui.model.json.JSONModel();
                //oJSONModelCntr.loadData("./localService/mockdata/Countries.json", false);
                oJSONModelCntr.loadData("./model/json/Countries.json", false);
                oView.setModel(oJSONModelCntr, "jsonCountries");

                var oJSONModelLayout = new sap.ui.model.json.JSONModel();
                //oJSONModelLayout.loadData("./localService/mockdata/Layouts.json", false);
                oJSONModelLayout.loadData("./model/json/Layouts.json", false);
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
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

                this._bus.subscribe("incidence", "onDeleteIncidence", function (channelId, eventId, data) {
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                    this.getView().getModel("incidenceModel").remove
                        ("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                            "',SapId='" + data.SapId +
                            "',EmployeeId='" + data.EmployeeId + "')",
                            {
                                success: function () {
                                    this.onReadODataIncidence.bind(this)(data.EmployeeId);
                                    sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOk"));
                                }.bind(this),
                                error: function (e) {
                                    sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                                }.bind(this)
                            });
                }, this);

            },
            showEmployeeDetails: function (category, nameEvent, path) {
                var oView = this.getView();
                var i18nBundle = oView.getModel("i18n").getResourceBundle();
                var oJSONLayout = oView.getModel("jsonLayouts").getData();

                var detailView = this.getView().byId("employeeDetails");
                detailView.bindElement("odataNorthwind>" + path);

                if (oJSONLayout.ActiveKey === "OneColumn") {
                    this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", i18nBundle.getText("TwoColBExp"));
                } else {
                    this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", oJSONLayout.ActiveKey);
                }

                var incidenceModel = new JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();

                this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);

            },

            onSaveODataIncidence: function (channelId, eventId, data) {

                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Type: incidenceModel[data.incidenceRow].Type,
                        Reason: incidenceModel[data.incidenceRow].Reason
                    };

                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            this.onReadODataIncidence.bind(this)(employeeId);
                            // sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOk"));
                            MessageBox.success(oResourceBundle.getText("odataSaveOk"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    })
                }
                else if (incidenceModel[data.incidenceRow].CreationDateX ||
                    incidenceModel[data.incidenceRow].ReasonX ||
                    incidenceModel[data.incidenceRow].TypeX) {
                    var body = {
                        Type: incidenceModel[data.incidenceRow].Type,
                        TypeX: incidenceModel[data.incidenceRow].TypeX,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                        ReasonX: incidenceModel[data.incidenceRow].ReasonX,
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        CreationDateX: incidenceModel[data.incidenceRow].CreationDateX
                    };
                    this.getView().getModel("incidenceModel").update
                        ("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                            "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                            "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body,
                            {
                                success: function () {
                                    this.onReadODataIncidence.bind(this)(employeeId);
                                    sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOk"));
                                }.bind(this),
                                error: function (e) {
                                    sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                                }.bind(this)
                            });
                }
                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                };
            },

            onReadODataIncidence: function (employeeID) {

                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],
                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);
                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            data.results[incidence]._ValiDate = true;
                            data.results[incidence]._EnabledSave = true;
                            
                            var newIncidence = sap.ui.xmlfragment("ns.Employees.fragment.NewIncidence",
                            this._detailEmployeeView.getController());
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        }
                    }.bind(this),
                    error: function (e) {

                    }
                })

            }
        });
    });