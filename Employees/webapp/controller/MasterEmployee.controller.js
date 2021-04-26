// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../formaters/EmplyFormaterType"

],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator, EmplyFormaterType) {
        "use strict";

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
        };

        function onFilter() {
            var oJSONCntr = this.getView().getModel("jsonCountries").getData();

            var filters = [];
            if (oJSONCntr.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCntr.EmployeeId));
            }

            if (oJSONCntr.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCntr.CountryKey));
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

        function onShowCity() {
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
        };

        function showOrdersOriginal(oEvent) {
            var ordrsTable = this.getView().byId("ordrsTable");

            ordrsTable.destroyItems();
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            var orders = objectContext.Orders;

            var ordersItems = [];
            for (var i in orders) {
                ordersItems.push(new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Label({ text: orders[i].OrderID }),
                        new sap.m.Label({ text: orders[i].Freight }),
                        new sap.m.Label({ text: orders[i].ShipAddress })
                    ]
                }));
            }

            var newTable = new sap.m.Table({
                width: "auto",
                columns: [
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
                ],
                items: ordersItems
            }).addStyleClass("sapUiSmallMargin");

            ordrsTable.addItem(newTable);



            var newTableJSON = new sap.m.Table();

            newTableJSON.setWidth("auto");
            newTableJSON.addStyleClass("sapUiSmallMargin");

            var columnOrderID = new sap.m.Column();
            var labelOrderID = new sap.m.Label();
            labelOrderID.bindProperty("text", "i18n>orderID");
            columnOrderID.setHeader(labelOrderID);
            newTableJSON.addColumn(columnOrderID);

            var columnFreight = new sap.m.Column();
            var labelFreight = new sap.m.Label();
            labelFreight.bindProperty("text", "i18n>freight");
            columnFreight.setHeader(labelFreight);
            newTableJSON.addColumn(columnFreight);

            var columnshipAddress = new sap.m.Column();
            var labelshipAddress = new sap.m.Label();
            labelshipAddress.bindProperty("text", "i18n>shipAddress");
            columnshipAddress.setHeader(labelshipAddress);
            newTableJSON.addColumn(columnshipAddress);

            var columnListItem = new sap.m.ColumnListItem();

            var cellOrderID = new sap.m.Label();
            cellOrderID.bindProperty("text", "jsonEmployees>OrderID");
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text", "jsonEmployees>Freight");
            columnListItem.addCell(cellFreight);

            var cellshipAddress = new sap.m.Label();
            cellshipAddress.bindProperty("text", "jsonEmployees>ShipAddress");
            columnListItem.addCell(cellshipAddress);

            var oBindingInfo = {
                model: "jsonEmployees",
                path: "Orders",
                template: columnListItem
            };

            newTableJSON.bindAggregation("items", oBindingInfo);
            newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());


            ordrsTable.addItem(newTableJSON);

        };

        function showOrders(oEvent) {
            //get selected controler
            var iconPressed = oEvent.getSource();

            // context from Model
            var oContext = iconPressed.getBindingContext("odataNorthwind");
            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("ns.Employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            };
            // Dialog Binding to Context to access to selected data item
            this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            this._oDialogOrders.open();
        };

        function onCloseOrders() {
            this._oDialogOrders.close();
        };

        function showEmployee(oEvent) {
            var  path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            this._bus.publish("flexible", "showEmployee", path);
        };

         function toOrderDetails(oEvent) {
             var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
             var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
             oRouter.navTo("RouteOrderDetails", {
                 OrderId: orderID
             });
         };

        var Main = Controller.extend("ns.Employees.controller.MainView", {
            formatterTypeEmply: EmplyFormaterType
        })

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee  = showEmployee;
        Main.prototype.toOrderDetails = toOrderDetails;
        return Main;
    });