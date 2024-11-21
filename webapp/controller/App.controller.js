sap.ui.define([
	"demonr/controller/BaseController",
	"sap/base/Log"

], function (BaseController,Log) {
    "use strict";
    return BaseController.extend("demonr.controller.App", {
        onInit: function () { // Définit le niveau de log à INFO pour que les informations au niveau INFO et plus graves soient enregistrées
            Log.setLevel(Log.Level.INFO);

            // Récupère l'objet du routeur, qui gère la navigation entre les différentes vues
            var oRouter = this.getRouter();

            // Attache un gestionnaire d'événement pour détecter les routes qui n'ont pas pu être trouvées
            oRouter.attachBypassed(function (oEvent) { // Récupère le "hash" de l'URL, c'est-à-dire la partie de l'URL après le `#` (qui correspond à une route demandée)
                var sHash = oEvent.getParameter("hash");

                // Enregistre un message d'information dans le journal pour signaler que la route est invalide
                Log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
            });
        }
    });
});
