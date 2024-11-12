sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/core/UiComponent"
], function (Controller, History, UiComponent) {
    "use strict";

    return Controller.extend("demonr.controller.BaseController", {
        getRouter: function () {
            return UiComponent.getRouterFor(this);
        },
        onNavBack: function () {
            var oHistory,
                oPreviousHash;
            oHistory = History.getInstance();
            oPreviousHash = oHistory.getPreviousHash();
            if (oPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("appHome", {}, true);
            }
        }
    })


});
