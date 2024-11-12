sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";
    return Controller.extend("demonr.controller.NotFound", {
        onInit: function () {},
       
        onNavBack: function () {
            var oHistory,
                oPreviousHash,oRouter;
            oHistory = History.getInstance();
            oPreviousHash = oHistory.getPreviousHash();
            if (oPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("appHome", {}, true);
            }
        }
    })

});
