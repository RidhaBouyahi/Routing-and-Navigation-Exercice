// Définition du module SAPUI5, qui dépend du contrôleur de base "BaseController".
// Le contrôleur "Employee" étend les fonctionnalités du contrôleur de base.
sap.ui.define(["demonr/controller/BaseController"], function (BaseController) {
    "use strict";
    // Mode strict pour une exécution sécurisée du code.

    // Le contrôleur "Employee" hérite des fonctionnalités de "BaseController".
    // Cela permet de réutiliser les méthodes et la logique communes, comme la gestion de la navigation.
    return BaseController.extend("demonr.controller.employee.Employee", {

        // Méthode d'initialisation, appelée au moment de l'initialisation du contrôleur.
        // Elle configure la gestion des routes et attache un gestionnaire d'événements pour la route "EmployeeDetail".
        onInit: function () {
            var oRouter = this.getRouter();
            // Attache un événement pour la route "EmployeeDetail" lorsqu'elle est "matchée" (lorsque la navigation vers cette route est effectuée).
            // Lorsqu'une route correspond, la méthode "_onRouteMatched" est appelée pour traiter les données associées.
            oRouter.getRoute("EmployeeDetail").attachMatched(this._onRouteMatched, this);
        },

        // Méthode qui est appelée lorsque la route "EmployeeDetail" correspond.
        // Cela se produit lorsque l'utilisateur navigue vers la vue "Employee" en passant un paramètre d'ID d'employé.
        _onRouteMatched: function (oEvent) {
            var oArgs,
                oView;
            // Récupère les arguments passés avec la navigation (ici l'ID de l'employé).
            oArgs = oEvent.getParameter("arguments");
            // Obtient la vue associée à ce contrôleur.
            oView = this.getView();

            // Binds (lie) l'élément de la vue à l'employé correspondant dans le modèle de données.
            // L'ID de l'employé est passé via les arguments récupérés de l'événement de la route.
            oView.bindElement({ // Définit le chemin du modèle de données pour cet employé spécifique, basé sur l'ID passé en paramètre.
                path: "/Employees(" + oArgs.employeeId + ")",
                // Lorsque les données liées changent, la méthode _onBindingChange est appelée pour vérifier si le modèle a bien été trouvé.
                events: {
                    change: this._onBindingChange.bind(this),
                    // Événement "dataRequested" : il est déclenché lorsque les données sont demandées (par exemple, lorsque la vue ou le modèle
                    // commence à charger des données depuis une source, comme un service OData ou un autre modèle de données).
                    dataRequested: function (oEvent) {
                        // Lorsque les données sont en cours de récupération, on active l'indicateur "busy" de la vue.
                        // Cela permet d'afficher un message de "chargement" ou un spinner pour informer l'utilisateur que des données sont en train
                        // d'être récupérées.
                        oView.setBusy(true);
                    },

                    // Événement "dataReceived" : il est déclenché lorsque les données ont été reçues et traitées avec succès par la vue.
                    // Cela signifie que la récupération des données est terminée (qu'elles aient été chargées avec succès ou qu'il y ait eu une erreur).
                    dataReceived: function (oEvent) {
                        // Lorsque les données sont entièrement chargées et reçues, on désactive l'indicateur "busy".
                        // Cela permet de cacher l'indicateur de "chargement" et de rendre la vue disponible pour l'utilisateur.
                        oView.setBusy(false);
                    }

                }
            });
        },

        // Méthode appelée lorsque les données liées (binding) de la vue changent.
        // Elle vérifie si le BindingContext (contexte de données) existe, ce qui signifie que les données ont été trouvées et liées avec succès.
        _onBindingChange: function () {
            // Si le BindingContext est vide (c'est-à-dire que l'employé n'a pas été trouvé dans les données),
            // cela déclenche la vue "notfound" pour afficher une erreur de page introuvable.
            if (!this.getView().getBindingContext()) {
                this.getRouter().getTargets().display("notfound");
            }
        }

    });

});
