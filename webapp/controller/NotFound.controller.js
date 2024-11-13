// Définition du module SAPUI5 en déclarant une dépendance au contrôleur de base "BaseController".
// Cela permet d'étendre et de réutiliser les fonctionnalités de "BaseController" dans ce contrôleur "NotFound".
sap.ui.define(["demonr/controller/BaseController"], function (BaseController) {
    "use strict";  // Mode strict pour exécuter le code de manière plus sécurisée (éviter certains comportements erronés).

    // Le contrôleur "NotFound" étend "BaseController", ce qui signifie qu'il hérite des méthodes de "BaseController".
    // Cela permet d'utiliser des fonctionnalités communes, comme la gestion de la navigation.
    return BaseController.extend("demonr.controller.NotFound", {

        // Méthode d'initialisation, exécutée au moment où le contrôleur est instancié.
        // Cette méthode est utilisée pour préparer le contrôleur et configurer certaines actions au démarrage.
        onInit: function () {
            var oRouter, oTarget;

            // On récupère le routeur via la méthode "getRouter" héritée du contrôleur de base.
            oRouter = this.getRouter();

            // On obtient la cible "notfound" définie dans la configuration du routeur.
            // Cette cible représente la vue qui doit être affichée lorsqu'une erreur 404 se produit.
            oTarget = oRouter.getTarget("notfound");

            // On attache un événement "display" à la cible "notfound".
            // Cet événement est déclenché chaque fois que la vue "notfound" est affichée.
            // Lorsque cet événement se produit, nous récupérons les données associées à la vue d'erreur.
            oTarget.attachDisplay(function (oEvent) {
                // On récupère les données de l'événement et on les stocke dans la variable "_oData".
                // Ces données sont probablement liées à l'origine de la navigation qui a échoué.
                this._oData = oEvent.getParameter("data");
            }, this);
        },

        // Méthode pour gérer le comportement du bouton "Retour" (navigation en arrière).
        onNavBack: function () {
            // Si des données sont stockées (cela signifie qu'on vient de la vue "home" ou d'une autre vue spécifique)
            if (this._oData && this._oData.fromTarget) {
                // On utilise le routeur pour afficher la vue d'origine (d'où la navigation a échoué).
                // Le paramètre "fromTarget" est passé à partir des données récupérées dans l'événement "display".
                this.getRouter().getTargets().display(this._oData.fromTarget);

                // Après la navigation, on supprime la donnée "fromTarget" pour éviter qu'elle ne soit utilisée à nouveau.
                delete this._oData.fromTarget;
                return;
            }

            // Si aucune donnée "fromTarget" n'est présente, on appelle la méthode "onNavBack" du contrôleur de base.
            // Cela assure que la navigation en arrière fonctionne comme prévu, en revenant à la vue précédente dans l'historique.
            BaseController.prototype.onNavBack.apply(this, arguments);
        }

    });
});
