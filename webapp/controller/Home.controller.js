sap.ui.define(["demonr/controller/BaseController"], function (BaseController) {
    "use strict";
    return BaseController.extend("demonr.controller.Home", {
        onInit: function () {},
        onDisplayNotFound: function () {
            this.getRouter().getTargets().display("notfound", {fromTarget: "home"});    
        }
    });
});
