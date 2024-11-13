// Définition d'un module SAPUI5 en déclarant une dépendance au contrôleur de base "BaseController".
// Cela permet au contrôleur "EmployeeList" d'utiliser les fonctionnalités communes définies dans "BaseController".
sap.ui.define(["demonr/controller/BaseController"], function (BaseController) {
    "use strict";
    // Mode strict pour une exécution plus sécurisée, empêchant certains comportements erronés.

    // Le contrôleur "EmployeeList" étend le contrôleur "BaseController".
    // Cela signifie qu'il hérite des méthodes et des fonctionnalités définies dans "BaseController", comme la gestion de la navigation.
    return BaseController.extend("demonr.controller.employee.EmployeeList", {

        // Méthode d'initialisation. Elle est exécutée au moment où le contrôleur est instancié.
        // Actuellement, cette méthode est vide, ce qui signifie qu'aucune action spécifique n'est effectuée lors de l'initialisation.
        onInit: function () {},

        // Méthode de navigation vers la vue de détails d'un employé.
        // Cette méthode est appelée lorsqu'un événement (comme un clic) se produit sur un élément de la liste des employés.
        onNavToDetail: function (oEvent) {
            var oItem,
                oBdingCtx;

            // Récupère l'élément (composant UI) sur lequel l'événement a été déclenché (par exemple, une ligne d'une table ou d'une liste).
            oItem = oEvent.getSource();

            // Récupère le BindingContext de cet élément, qui contient les données liées à cet élément.
            // Le BindingContext permet d'accéder aux données associées à l'élément dans le modèle de données.
            oBdingCtx = oItem.getBindingContext();

            // Utilisation du routeur pour naviguer vers la vue "EmployeeDetail".
            // On passe un paramètre "employeeId" dans l'URL de la navigation, correspondant à la propriété "EmployeeID" de l'élément sélectionné.
            // Cela permet à la vue de détails d'afficher les informations spécifiques de l'employé sélectionné.
            this.getRouter().navTo("EmployeeDetail", {
                employeeId: oBdingCtx.getProperty("EmployeeID") // Passe l'ID de l'employé comme paramètre de navigation
            });
        }

    });

});
