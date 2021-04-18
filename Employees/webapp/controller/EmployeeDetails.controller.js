// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ns/Employees/formaters/formatter",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof ns.Employees.formaters.formatter} formatter 
     * @param {typeof sap.m.MessageBox} MessageBox 
     */

    function (Controller, formatter, MessageBox) {
        'use strict';

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onCreateIncidence() {
            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("ns.Employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var index = odata.length;
            odata.push({ index: index + 1, _ValiDate: false, EnabledSave: false });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence)
        };

        function onDeleteIncidence(oEvent) {
            var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            MessageBox.confirm
                (this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"),
                    {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                this._bus.publish
                                    ("incidence", "onDeleteIncidence", {
                                        IncidenceId: contextObj.IncidenceId,
                                        SapId: contextObj.SapId,
                                        EmployeeId: contextObj.EmployeeId
                                    });
                            }
                        }.bind(this)
                    });
        };

        function onSaveIncidence(oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
        };

        function updateIncidenceCreationDate(oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();
            let oi18nResBun = this.getView().getModel("i18n").getResourceBundle();
            if (!oEvent.getSource().isValidValue() || oEvent.getSource().getDateValue() == null) {
                contextObj._ValiDate = false;
                contextObj.CreationDateState = "Error";
                MessageBox.error(oi18nResBun.getText("notValidCreationDate"), {
                    title: 'Error',
                    onClose: null,
                    styleClass: "",
                    actions: MessageBox.Action.Close,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            } else {
                contextObj.CreationDateState = "None";
                contextObj._ValiDate = true;
                contextObj.CreationDateX = true;
                if (!contextObj.Reason) { contextObj.Reason = ""; }
                if (!contextObj.Type) { contextObj.Type = ""; }
            };
            if (oEvent.getSource().isValidValue() &&
                oEvent.getSource().getDateValue() !== null &&
                contextObj.Reason.trim() !== "" &&
                contextObj.Type.trim() !== "") {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            }
            context.getModel().refresh();
        };

        function updateIncidenceReason(oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();
            if (oEvent.getSource().getValue().trim() !== "") {
                contextObj.ReasonX = true;
                contextObj.ReasonState = "None";
            } else {
                contextObj.ReasonX = false;
                contextObj.ReasonState = "Error";
            };

            if (oEvent.getSource().getValue().trim() !== "" &&
                contextObj._ValiDate &&
                contextObj.Type.trim() !== "") {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            };
            context.getModel().refresh();
        };

        function updateIncidenceType(oEvent) {
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObj = context.getObject();

            if (contextObj._ValiDate && contextObj.Reason.trim() !== "") {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            };

            contextObj.TypeX = true;
            context.getModel().refresh();
        }

        var EmployeeDetails = Controller.extend("ns.Employees.controller.EmployeeDetails", {});

        EmployeeDetails.prototype.onInit = onInit;
        EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
        EmployeeDetails.prototype.Formatter = formatter;
        EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
        EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;

        EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
        EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
        EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;

        return EmployeeDetails;
    });