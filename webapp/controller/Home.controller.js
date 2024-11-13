// Définition du module SAPUI5 en déclarant une dépendance au contrôleur de base "BaseController".
// Cette dépendance permet d'utiliser les fonctionnalités de "BaseController" dans ce contrôleur.
sap.ui.define(["demonr/controller/BaseController"], function (BaseController) {
    "use strict";
    // Mode strict pour exécuter le code en mode sécurisé, évitant certains comportements erronés.

    // Le contrôleur "Home" étend le contrôleur de base (BaseController).
    // Cela signifie que ce contrôleur hérite des méthodes définies dans BaseController, telles que la gestion de la navigation.
    return BaseController.extend("demonr.controller.Home", {

        // Méthode d'initialisation. Elle est exécutée au moment de l'initialisation du contrôleur.
        // Actuellement, elle est vide, ce qui signifie qu'aucune action spécifique n'est effectuée lors de l'initialisation.
        onInit: function () {},

        // Méthode appelée pour afficher la vue "notfound".
        // Elle est souvent utilisée pour afficher une page d'erreur ou une vue de type "404" quand une route n'est pas définie correctement.
        onDisplayNotFound: function () {
            // Utilisation du routeur pour afficher la cible "notfound".
            // La cible "notfound" est une vue qui montre un message d'erreur ou de non-trouvé.
            // Le paramètre {fromTarget: "home"} est passé pour signaler que cette navigation provient de la vue "home".
            this.getRouter().getTargets().display("notfound", {fromTarget: "home"});
        },

        // Méthode de navigation vers la liste des employés.
        onNavToEmployees: function () {
            // Utilisation du routeur pour naviguer vers la vue "EmployeeList".
            // Cette méthode appelle le routeur pour effectuer la navigation vers la vue correspondante.
            this.getRouter().navTo("EmployeeList");
        }

    });
});
