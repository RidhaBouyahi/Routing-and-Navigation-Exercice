sap.ui.define(["demonr/controller/BaseController"], function (BaseController) {
    "use strict";
    return BaseController.extend("demonr.controller.NotFound", {
        onInit: function () {
            var oRouter,oTarget;
            oRouter = this.getRouter();
            oTarget = oRouter.getTarget("notfound");
            oTarget.attachDisplay(function (oEvent) {
                this._oData = oEvent.getParameter("data");
            }, this);
        },
        onNavBack: function () {
            if (this._oData && this._oData.fromTarget) {
                this.getRouter().getTargets().display(this._oData.fromTarget);
                delete this._oData.fromTarget;
                return;
            }
            BaseController.Prototype.onNavBack.apply(this,arguments);
        }

    });
});
