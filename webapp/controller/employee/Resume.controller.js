sap.ui.define([ 
    "demonr/controller/BaseController", // Importation du contrôleur de base pour l'héritage
], function (BaseController) {  // Fonction de rappel qui reçoit le contrôleur de base comme paramètre
    "use strict"; // Active le mode strict pour une meilleure gestion des erreurs et une syntaxe plus rigoureuse

    return BaseController.extend("demonr.controller.employee.Resume", {  // Création d'un nouveau contrôleur qui étend BaseController
        // Fonction d'initialisation de la vue (onInit est appelé lors de la création de la vue)
        onInit() {
            var oRouter;  // Déclaration de la variable pour le routeur

            // Récupération de l'instance du routeur depuis le contrôleur actuel
            oRouter = this.getRouter();

            // Attachement de l'événement "matched" au routeur, ce qui permet de définir une action
            // lorsqu'une route correspondante est activée. Ici, "employeeResume" est la route que nous écoutons.
            // Lors de la correspondance de cette route, la fonction _onRouteMatched sera appelée.
            oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
        },

        // Fonction appelée lorsque la route "employeeResume" est activée
        _onRouteMatched: function (oEvent) {
            var oView,  // Déclaration de la variable pour la vue
                oArgs;  // Déclaration de la variable pour les arguments de la route

            // Récupération de l'instance de la vue actuelle
            oView = this.getView();

            // Récupération des arguments passés à la route, ici l'ID de l'employé
            oArgs = oEvent.getParameter("arguments");

            // Liaison des données de la vue à un élément spécifique en fonction de l'ID de l'employé
            // Le chemin "/Employees(employeeId)" est construit dynamiquement en utilisant l'ID de l'employé passé dans les arguments
            oView.bindElement({
                path: "/Employees(" + oArgs.employeeId + ")",  // Liaison au modèle OData avec le chemin dynamique
                events: {  // Définition des événements associés à cette liaison
                    // Quand les données changent (par exemple, après un chargement ou une modification), on appelle la fonction _onBindingChange
                    change: this._onBindingChange.bind(this),

                    // Avant la récupération des données, on marque la vue comme occupée pour indiquer un chargement
                    dataRequested: function (oEvent) {
                        oView.setBusy(true);  // Affiche un indicateur de chargement (spinner)
                    },

                    // Après la récupération des données, on désactive l'indicateur de chargement
                    dataReceived: function (oEvent) {
                        oView.setBusy(false);  // Cache l'indicateur de chargement
                    }
                }
            });
        },

        // Fonction appelée lorsque le lien de données a changé (par exemple, lorsqu'une nouvelle donnée a été chargée)
        _onBindingChange: function() {
            // Si aucun contexte de liaison n'est trouvé (l'objet de données n'existe pas ou n'est pas valide)
            // On redirige l'utilisateur vers une vue "notFound" pour afficher un message d'erreur ou une vue de remplacement
            if (!this.getView().getBindingContext()) {
                this.getRouter().getTargets().display("notFound");  // Affiche la vue "notFound"
            }
        }
    });

});
