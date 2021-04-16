// @ts-nocheck
sap.ui.define([], function () {
    
    function dateFormat(date) {

        var timeDay = 24 * 60 * 60 * 1000;

        if (date) {
            var dateNow = new Date();
            var dateInc = new Date();
            dateInc = date;
            dateNow.setHours('0'); dateNow.setMinutes('0'); dateNow.setSeconds('0'); dateNow.setMilliseconds('0');
            dateInc.setHours('0'); dateInc.setMinutes('0'); dateInc.setSeconds('0'); dateInc.setMilliseconds('0');
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy/MM/dd"});
            var dateNowFormat = new Date(dateFormat.format(dateNow));
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            switch (true) {
                //Today
                case date.getTime() === dateNowFormat.getTime():
                    return oResourceBundle.getText("today");
                //Tomorrow
                case date.getTime() === dateNowFormat.getTime() + timeDay:
                    return oResourceBundle.getText("tomorrow");
                //Yesterday
                case date.getTime() === dateNowFormat.getTime() - timeDay:
                    return oResourceBundle.getText("yesterday");
                default: 
                    return '';
            }
        }
    }

    return {
        dateFormat: dateFormat
    }
    });