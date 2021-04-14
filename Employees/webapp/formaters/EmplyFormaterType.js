sap.ui.define([
], 
function() {
    'use strict'
return{
    EmplyTypeFrm: function (EmplyType) {
    const i18nRsrcBndl = this.getView().getModel("i18n").getResourceBundle();
    switch (EmplyType) {
        case '1': return i18nRsrcBndl.getText("T1");
        case '2': return i18nRsrcBndl.getText("T2");
        default: return 'Sin Valor';
        }
    }
}    
});