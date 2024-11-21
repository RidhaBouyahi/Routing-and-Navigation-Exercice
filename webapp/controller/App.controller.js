sap.ui.define([
    "demonr/controller/BaseController", "sap/base/Log"

], function (BaseController, Log) {
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
            oRouter.attachRouteMatched(function (oEvent) { // Récupère le nom de la route qui a été activée par l'utilisateur
                var sRouteName = oEvent.getParameter("name");

                // Enregistre un message d'information dans le journal pour indiquer que l'utilisateur a accédé à une route
                // Le message inclut le nom de la route et le timestamp actuel (en millisecondes depuis l'époque)
                Log.info("user accessed route " + sRouteName + ", timestamp = " + Date.now());
            });

        }
    });
});
